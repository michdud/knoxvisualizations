// Creates "4-year Graduation Rates..." graph on Persistence and Graduation Rates page.
var width = 900,
	height = 500,
	container = d3.select(".grad")
				.attr("style", "padding-bottom:" + Math.ceil(height * 100 / width) + "%")
        		.append("svg")
        		.attr("viewBox", "0 0 " + (width + 190) + " " + (height + 40)),
	margin = {top: 20, right: 20, bottom: 30, left: 40},
	svg2 = container.append("g")
		  .attr("width", "100%")
		  .attr("height", "100%")
		  .attr("transform", "translate(" + (margin.left+24) + "," + 0 + ")");

var x1 = d3.scaleLinear().range([0, width]),
	y1 = d3.scaleLinear().range([height, 0]);
	z1 = d3.scaleOrdinal(["#FF0C1E", "#3B7EAC", "#4CAF4F", "#9C4BAB", "#FF7F03", "#F283BD", "#A15127"]);

var myline = d3.line()
    .x(function(d) { return x1(d.year); })
    .y(function(d) { return y1(d.rate); })
    .defined(function(d){ return !isNaN(d.rate); });

var dotLine = d3.line()
	.x(function(d){return x1(d[0]);})
	.y(function(d){return y1(d[1]);})

d3.csv("data/4yrgrad.csv", type, function(error, data){
	if (error) throw error;
	var races = data.columns.slice(1).map(function(id){
		return{
			id: id,
			values: data.map(function(d){
				return {year: +d.year, rate: +d[id]};
			})
		};
	});

	x1.domain(d3.extent(data, function(d){return d.year;}));

	y1.domain([
		d3.min(races, function(c){ return d3.min(c.values, function(d) { return d.rate; }); }),
		d3.max(races, function(c){ return d3.max(c.values, function(d){ return d.rate; }); })
	]);

	z1.domain(races.map(function(c){ return c.id }));

	svg2.append("g")
		.attr("class", "axis axis--x")
		.attr("transform", "translate(0," + height + ")")
		.call(d3.axisBottom(x1).tickFormat(function(d){return d;}).ticks(5));

	svg2.append("g")
		.attr("class", "axis axis--y")
		.call(d3.axisLeft(y1).ticks(10, "%"))
		.append("text")
			.attr("transform", "translate(-"+(margin.left+20)+"," + height/3 + "), rotate(-90)")
			.attr("dy", "0.71em")
			.attr("fill", "#000")
			.text("Graduation rate, %");

	var race = svg2.selectAll(".race")
		.data(races)
		.enter().append("g")
			.attr("class", "race");

	race.append("path")
		.attr("class","line")
		.attr("d", function(d){ return myline(d.values); })
		.style("stroke", function(d) {return z1(d.id);});

	race.append("path")
		.attr("class", "line")
		.attr("id", "dottedline")
		.attr("d", dotLine([[2009,.29], [2011,.63]]))
		.style("stroke", function(d) {return z1(d.id);})
		.style("stroke-dasharray", ("3,3"));
	
	race.append("text")
		.attr("class", "lineEndText")
		.attr("text-anchor", "left")
		.attr("x", width + 4)
		.attr("y", function(d){return y1(d.values[4].rate) + 5;})
		.text(function(d){return d.id;});

	d3.selectAll(".legend").attr("fill", function(d, i) { return z1(i);});

});

function type(d, _, columns){
	d.year = +d.year;
	for(var i = 1, n = columns.length, c; i<n; ++i) d[c = columns[i]] = +d[c];
	return d;
}