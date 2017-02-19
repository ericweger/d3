//Variables
var population = "B01003_001E";
var income = "B19013_001E";
var median_gross_rent = "B25064_001E";
var median_home_value = "B25077_001E";
var income_per_capita = "B19301_001E";
var employment_employed = "B23025_004E";
var employment_unemployed = "B23025_005E";
var poverty = "B17001_002E";
var commute_time = "B08136_001E";
var commute_time_solo_automobile = "B08136_003E";
var commute_time_carpool = "B08136_004E";
var commute_time_public_transport = "B08136_007E";
var commute_time_walked = "B08136_011E";
var commute_time_other = "B08136_012E";


//Filter Variables
var minPop = null;
var maxPop = null;

$(function initialize() {
	sdk = new CitySdk();
	census = new CensusModule("3a8e2ee9ffcaf4931c4966b551c551cfa48809d8");
	allCall();
});

function allCall() {
	let request = {
		level : "us",
		sublevel : true,
		variables : [
			population,
			income,
			median_gross_rent,
			median_home_value,
			employment_unemployed,
			commute_time
		],
		api : "acs5",
		year : "2014"
	};

	census.apiRequest(request, stateCall);
};
function stateCall(response) {
	fullData = {};
	for (var i = 0; i < response["data"].length; i++) {
		let request = {
			state : response["data"][i]["state"],
			level : "state",
			sublevel : true,
			variables : [
				population,
				income,
				median_gross_rent,
				median_home_value,
				employment_unemployed,
				commute_time
			],
			api : "acs5",
			year : "2014"
		};

		census.apiRequest(request, function(response) {
			fullData[response["data"]["name"]] = response["data"];
			console.log(response);
		});
	};
	console.log("Full Data:");
	console.log(fullData);
};
function cityCall() {
	let request = {
		state : "OR",
		level : "state",
		sublevel : true,
		variables : [
			population,
			income,
			median_gross_rent
		],
		api : "acs5",
		year : "2014"
	};

	census.apiRequest(request, cityCallback);
}
function cityCallback(response) {

	fullData = response["data"];
	update();
};

function allCallback(response) {
	fullData = response["data"];
	for (var i = 0; i < response["data"].length; i++) {
		stateCall(response["data"][i]["state"]);
	}
};
function stateCallback(request) {
	fullData
};

function update() {
	console.log("minPop: " + minPop);
	console.log("maxPop: " + maxPop);

	var data = fullData.filter(popFilter);
	var rows = d3.select("#rawdata").selectAll("p")
		.data(data)
		.text(function(d,i) {return d["NAME"] + " | Population: " + d[population] + ", Avg. Income: $" + d[income] + "/year, Median Gross Rent: $" + d[median_gross_rent] + "/month"});
	rows.enter().append("p")
		.text(function(d,i) {return d["NAME"] + " | Population: " + d[population] + ", Avg. Income: $" + d[income] + "/year, Median Gross Rent: $" + d[median_gross_rent] + "/month"});
	rows.exit().remove();

	

	var bars = d3.select("#barchart")
		.selectAll("rect")
		.data(data, function(d) { return d ? d.name : this.id; });

	var y = d3.scaleLinear()
		.domain([0, d3.max(data.map( function(d) { return Number(d[population]); } ))])
		.range([0, 800]);

	var x = d3.scaleBand()
		.domain(data.map(function(d) { return d["NAME"]; }))
		.padding(0.3);

	var t = d3.transition()
	.duration(350);

	bars.transition()
		.attr("height", function(d,i) { return y(d[population]); })
		.attr("width", function(d,i) { return x.bandwidth() * 100 + "%"; })
		.attr("x", function(d,i) { return x(d["NAME"]) * 100 + "%"; })
		.attr("y", function(d,i) {return 800 - y(d[population]);});
	bars.enter()
		.append("rect")
		.attr("x", function(d,i) { return x(d["NAME"]) * 100 + "%"; })
		.attr("width", 0)
		.attr("height", 0)
		.attr("y", 800)
		.transition(t)
			.attr("width", function(d,i) { return x.bandwidth() * 100 + "%"; })
			.attr("height", function(d,i) { return y(d[population]);})
			.attr("y", function(d,i) {return 800 - y(d[population]);});
	console.log(bars);
	bars.exit()
		.transition(t)
			.attr("width", "0px")
			.attr("height", "0px")
			.attr("y", 800)
			.remove();
};
function newMinPop(field) {
	console.log(field.value);
	minPop = field.value;
	update();
}
function newMaxPop(field) {
	maxPop = field.value;
	update();
}
function popFilter(place) {
	if (minPop > 0) {
		if (maxPop > 0) {
			return Number(place[population]) >= minPop && Number(place[population]) <= maxPop;
		} else {
			return Number(place[population]) >= minPop;
		};
	} else if (maxPop) {
		return Number(place[population]) <= maxPop;
	} else {
		return true;
	};
};