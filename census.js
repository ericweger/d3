//variables
var population = "B01003_001E";
var income = "B19013_001E";
var median_gross_rent = "B25064_001E";

$(function initialize() {
    sdk = new CitySdk();
    census = new CensusModule("3a8e2ee9ffcaf4931c4966b551c551cfa48809d8");
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

	let data = response["data"].filter(popFilter);
	var rows = d3.select("#rawdata").selectAll("p").data(data).text(function(d,i) {return d["NAME"]});
	rows.enter().append("p").text(function(d,i) {return d["NAME"] + " | Population: " + d[population] + ", Avg. Income: $" + d[income] + "/year, Median Gross Rent: $" + d[median_gross_rent] + "/month"});
	rows.exit().remove();
};

function popFilter(place) {
	return place[population] >= 50000;
}