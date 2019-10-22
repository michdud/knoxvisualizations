// Creates "Avg. 1st to 2nd year persistence..." graph on Persistence and Graduation Rates page.
var width = 900,
	height = 500,
	container = d3.select(".avgpers")
				.attr("style", "padding-bottom:" + Math.ceil(height * 100 / width) + "%")
        		.append("svg")
        		.attr("viewBox", "0 0 " + (width + 140) + " " + (height + 46)),
	margin = {top: 20, right: 20, bottom: 30, left: 140},
	svg = container.append("g")
		  .attr("width", "100%")
		  .attr("height", "100%")
		  .attr("transform", "translate(" + margin.left + "," + 0 + ")");

var x = d3.scaleLinear().rangeRound([0, width]),
	y = d3.scaleBand().rangeRound([height, 0]).padding(0.1);

d3.csv("data/fiveyearpers.csv", function(d){
	d.percent = +d.percent;
	return d;
}, function(error, data){
	if (error) throw error;

	x.domain([0, d3.max(data, function(d) {return d.percent;})]);
	y.domain(data.map(function(d) {return d.race;}));

	svg.append("g")
		.attr("class", "axis axis--y")
		.call(d3.axisLeft(y))
		.style("font-size","14px");

	svg.append("g")
		.attr("class", "axis axis--x")
		.attr("transform", "translate(0," + height + ")")
		.style("font-size","14px")
		.call(d3.axisBottom(x).ticks(10, "%"));
	 
	svg.selectAll(".bar")
	 	.data(data)
	 	.enter().append("rect")
	 		.attr("class", "bar")
	 		.attr("y", function(d){return y(d.race);})
	 		.attr("width", function(d) {return x(d.percent);})
	 		.style("fill", "#1ba39c")
	 		.attr("height", y.bandwidth());

	var xTextPadding = 90;
	svg.selectAll(".bartext")
		.data(data)
		.enter()
			.append("text")
			.text(function(d) {return d.Total;})
			.attr("class", "bartext")
			.attr("text-anchor", "middle")
			.attr("fill", "white")
			.attr("x", function(d,i) {
			    return x(d.percent) - 40;
			})
			.attr("y", function(d,i) {
				return y(d.race) + y.bandwidth()/2 + 4;
			})
			.text(function(d){
			     return d.percent * 100 + "%";
			});

	svg.append("text")
		.attr("transform",
            "translate(" + (width/2) + " ," + 
                           (height + margin.top + 40) + ")")
        .style("text-anchor", "middle")
        .text("1st to 2nd year persistence rate (cohort entering fall 2012-2016)");

});