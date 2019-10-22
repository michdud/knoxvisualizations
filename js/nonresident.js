// Creates graphs on the "Percent of Degrees Awarded..." page.

var divs = [".nonresident", ".hispanic", ".asian", ".black", ".white", ".multiracial"];
var csvs = ["data/nonresident-majors.csv", "data/hispanic-majors.csv", "data/asian-majors.csv", "data/black-majors.csv", "data/white-majors.csv", "data/multiracial-majors.csv"];

for(i = 0; i < divs.length; i++){
	createBarGraph(divs[i], csvs[i]);
}

function createBarGraph(divClass, csvFile){
var margin = {top: 20, right: 20, bottom: 30, left: 190},
	width = 900,
	height = 500,
	container = d3.select(divClass)
				.attr("style", "padding-bottom:" + Math.ceil(height * 100 / width) + "%")
        		.append("svg")
        		.attr("viewBox", "0 0 " + width + " " + (height + 46)),
	svg = container.append("g")
		  .attr("width", "100%")
		  .attr("height", "100%")
		  .attr("transform", "translate(" + margin.left + "," + 0 + ")");

var x = d3.scaleLinear().rangeRound([0, width - margin.left - 30]),
	y = d3.scaleBand().rangeRound([height, 0]).padding(0.1);

d3.csv(csvFile, function(d){
	d["percent"] = parseFloat(+d["percent"]/100).toFixed(3);
	return d;
}, function (error, data){
	if(error) throw error;

	x.domain([0, d3.max(data, function(d) {return d["percent"];})]);
	y.domain(data.map(function(d) {return d["major"];}));

	svg.append("g")
		.attr("class", "axis axis--y")
		.call(d3.axisLeft(y))
		.style("font-size","14px");

	svg.append("g")
		.attr("class", "axis axis--x")
		.attr("transform", "translate(0," + height + ")")
		.style("font-size","14px")
		.call(d3.axisBottom(x).ticks(10, "%"));

	svg.append("text")
		.attr("transform",
            "translate(" + (width/3) + " ," + 
                           (height + margin.top + 20) + ")")
        .style("text-anchor", "middle")
        .text("% of graduating " + divClass.charAt(1).toUpperCase() + divClass.substr(2) + " students");

    svg.append("text")
      .attr("transform", "rotate(-90)")
      .attr("y", 0 - margin.left - 40)
      .attr("x",0 - (height / 2))
      .attr("dy", "1em")
      .style("text-anchor", "middle")
      .text("Degree Awarded");   

	var tip = d3.tip()
    .attr('class', 'd3-tip')
    .offset([-10, 0])
    .html(function(d) {
      return "<strong style='font-family:Helvetica'>" + d.major + "</strong> <span style='font-family:Helvetica'>" + (d.percent * 100).toFixed(1) + "%" + "</span>";
    });
    svg.call(tip);

	svg.selectAll(".bar")
	 	.data(data)
	 	.enter().append("rect")
	 		.attr("class", "bar")
	 		.attr("y", function(d){return y(d["major"]);})
	 		.attr("width", function(d) {return x(d.percent);})
	 		.attr("height", y.bandwidth())
	 		.on('mouseover', tip.show)
      		.on('mouseout', tip.hide);



});
}