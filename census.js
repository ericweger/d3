//Variables
var population = "B01003_001E";
var income = "B19013_001E";
var median_gross_rent = "B25064_001E";

//Filter Variables
var minPop;
var maxPop;

$(function initialize() {
    sdk = new CitySdk();
    census = new CensusModule("3a8e2ee9ffcaf4931c4966b551c551cfa48809d8");
    cityCall();
});

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
        year : "2013"
    };

    census.apiRequest(request, callback);
}
var callback = function callback(response) {

	fullData = response["data"];
    update();
};

function update(field, value) {

    data = fullData.filter(popFilter);
    var rows = d3.select("#rawdata").selectAll("p").data(data).text(function(d,i) {return d["NAME"]});
    rows.enter().append("p").text(function(d,i) {return d["NAME"] + " | Population: " + d[population] + ", Avg. Income: $" + d[income] + "/year, Median Gross Rent: $" + d[median_gross_rent] + "/month"});
    rows.exit().remove();

    

    var bars = d3.select("#barchart")
    .selectAll("rect")
    .data(data);

    var y = d3.scaleLinear()
        .domain([0, d3.max(data.map( function(d) { return Number(d[population]); } ))])
        .range([0, 800]);
    console.log(data.map( function(d) { return Number(d[population]); } ));
    console.log(d3.max(data.map( function(d) { return Number(d[population]); } )));

    bars.attr("height", function(d,i) { return y(d[population]); })
    .attr("width", 20)
    .attr("x", function(d,i) { return 30 * i; })
    .attr("y", function(d,i) {return 800 - y(d[population]);});
    console.log(bars);
    bars.enter()
    .append("rect")
    .attr("height", function(d,i) { return y(d[population]);})
    .attr("width", 20)
    .attr("x", function(d,i) { return 30 * i; })
    .attr("y", function(d,i) {return 800 - y(d[population]);});
    console.log(bars);
    bars.exit().remove();
};

function popFilter(place) {
    if (minPop) {
        if (maxPop) {
            return place[population] >= minPop && place[population] <= maxPop;
        } else {
            return place[population] >= minPop;
        };
    } else if (maxPop) {
        return place[population] <= maxPop;
    } else {
        return true;
    };
};