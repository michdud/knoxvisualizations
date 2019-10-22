// Allows users to select a major on the "Percent of Degrees Awarded..." page.
d3.selectAll("#majorselect")
    	.on("change", highlight);

var svg = d3.selectAll("g");

function highlight(){

	var menu = document.getElementById("majorselect");
    svg.selectAll("rect")
    	.style("fill", function(d){if(d.major == menu.options[menu.selectedIndex].text) return "#000000";})
    	
}