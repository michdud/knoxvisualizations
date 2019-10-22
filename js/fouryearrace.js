// Modified from original stacked bar chart code by Mike Bostock:
// https://observablehq.com/@d3/stacked-to-grouped-bars.
// Creates "Race/Ethnicity of Students: 2013-2017" graph.

var n = 9, // The number of races
    m = 5; // The number of years

d3.csv("data/threeyear.csv", function(error, data){
  data.forEach(function (d){
    d["2013"] = +d["2013"];
    d["2014"] = +d["2014"];
    d["2015"] = +d["2015"];
    d["2016"] = +d["2016"];
    d["2017"] = +d["2017"];
  });

  var y2013 = d3.nest()
    .key(function(d) {return d["raceeth"];})
    .rollup(function(v){return d3.sum(v, function(d) {return d["2013"];})})
    .object(data);

  var y2013vals = Object.keys(y2013).map(key => y2013[key]);
  const y2013bw = mapReverse(y2013);
  
  var y2014 = d3.nest()
    .key(function(d) {return d["raceeth"];})
    .rollup(function(v){return d3.sum(v, function(d) {return d["2014"];})})
    .object(data);  

  var y2014vals = Object.keys(y2014).map(key => y2014[key]);
  const y2014bw = mapReverse(y2014);

  var y2015 = d3.nest()
    .key(function(d) {return d["raceeth"];})
    .rollup(function(v){return d3.sum(v, function(d) {return d["2015"];})})
    .object(data);
  
    var y2015vals = Object.keys(y2015).map(key => y2015[key]);
    const y2015bw = mapReverse(y2015);

  var y2016 = d3.nest()
    .key(function(d) {return d["raceeth"];})
    .rollup(function(v){return d3.sum(v, function(d) {return d["2016"];})})
    .object(data);

    var y2016vals = Object.keys(y2016).map(key => y2016[key]);
    const y2016bw = mapReverse(y2016);

  var y2017 = d3.nest()
    .key(function(d) {return d["raceeth"];})
    .rollup(function(v){return d3.sum(v, function(d) {return d["2017"];})})
    .object(data);

    var y2017vals = Object.keys(y2017).map(key => y2017[key]);
    const y2017bw = mapReverse(y2017);

    const totalMap = new Map([...y2013bw, ...y2014bw, ...y2015bw, ...y2016bw, ...y2017bw]);

  // The xz array has m elements, representing the x-values shared by all series.
  // The yz array has n elements, representing the y-values of each of the n series.
  // Each yz[i] is an array of m non-negative numbers representing a y-value for xz[i].
  // The y01z array has the same structure as yz, but with stacked [y₀, y₁] instead of y.
  var xz = d3.range(m)//.map(elem => elem+2013),
      yz = [y2013vals,y2014vals,y2015vals,y2016vals,y2017vals]
      y01z = d3.stack().keys(d3.range(n))(yz),
      yMax = d3.max(yz, function(y) { return d3.max(y); }),
      y1Max = d3.max(y01z, function(y) { return d3.max(y, function(d) { return d[1]; }); });

  var margin = {top: 40, right: 10, bottom: 20, left: 40},
      width = 900,
      height = 400,
      container = d3.select(".graph")
        .attr("style", "padding-bottom:" + Math.ceil(height * 100 / width) + "%")
        .append("svg")
        .attr("viewBox", "0 0 " + width + " " + (height + 20)),
      svg = container.append("g")
            .attr("width", "100%")
            .attr("height", "100%")
            .attr("transform", "translate(" + margin.left + "," + 0 + ")");

  var x = d3.scaleBand()
      .domain(xz)
      .range([0, width])
      .padding(0.08);

  var y = d3.scaleLinear()
      .domain([0, y1Max])
      .range([height, 0]);

  var tip = d3.tip()
    .attr('class', 'd3-tip')
    .offset([-10, 0])
    .html(function(d) {
      return "<strong style='font-family:Helvetica'>" + totalMap.get(parseFloat(Number(d[1]-d[0]).toFixed(1))) + "</strong> <span style='font-family:Helvetica'>" + Math.round(d[1]-d[0]) + "</span>";
    })

  svg.call(tip);
    

  //initializng color scheme
  var color = d3.scaleOrdinal()
      .domain(d3.range(n))
      .range(d3.schemeCategory20);

  var series = svg.selectAll(".series")
    .data(y01z)
    .enter().append("g")
      .attr("fill", function(d, i) { return color(i); })

  // Initializing legend colors
  d3.selectAll(".legend")
    .attr("fill", function(d,i) { return color(i) });

  var rect = series.selectAll("rect")
    .data(function(d) { return d; })
    .enter().append("rect")
      .attr("x", function(d, i) { return x(i); })
      .attr("y", height)
      .attr("width", x.bandwidth())
      .attr("height", 0)
      .style("stroke", "#fff")
      .on('mouseover', tip.show)
      .on('mouseout', tip.hide);

  rect.transition()
      .attr("y", function(d) { return y(d[1]); })
      .attr("height", function(d) { return y(d[0]) - y(d[1]); });

  //creating x-axis
  svg.append("g")
      .attr("class", "axis axis--x")
      .attr("transform", "translate(0," + height + ")")
      .style("font-size","14px")
      .call(
          d3.axisBottom(x)
          .tickSize(0)
          .tickPadding(6)
          .tickFormat(function(d,i){ return 2013 + d}));

  //creating y-axis
  svg.append("g")
    .attr("class", "axis axis--y")
    .style("font-size", "12px")
    .call(
      d3.axisLeft(y)
      );
  
  // Toggle between color and printer-friendly
  d3.selectAll(".color")
    .on("click", toggleColor);

  var patterns = ["url(#circles-2)", "url(#diagonal-stripe-4)", "url(#dots-8)", "url(#horizontal-stripe-7)", "url(#vertical-stripe-6)", "url(#crosshatch)", "url(#whitecarbon)", "url(#circles-8)", "url(#horizontal-stripe-2)"];

  function toggleColor (){
    var currentRange;
    if(this.value == "color"){
      currentRange = d3.schemeCategory20;
      series.selectAll("rect").style("stroke", "#fff");
    } else {
      currentRange = patterns;
      series.selectAll("rect").style("stroke", "#000000");
    }

    var color2 = d3.scaleOrdinal()
        .domain(d3.range(n))
        .range(currentRange);

    series.attr("fill", function(d, i) { return color2(i); });
    d3.selectAll(".legend").attr("fill", function(d, i) { return color2(i);});
  };


  // Toggle between grouped and stacked
  d3.selectAll(".mode")
      .on("change", changed);

  function changed() {
    if (this.value === "grouped") transitionGrouped();
    else transitionStacked();
  }

  function transitionGrouped() {
    y.domain([0, yMax]);
    if(d3.select('input[name="animation"]:checked').property("value") == "on"){
      rect.transition()
          .duration(500)
          .delay(function(d, i) { return i * 10; })
          .attr("x", function(d, i) { return x(i) + x.bandwidth() / n * this.parentNode.__data__.key; })
          .attr("width", x.bandwidth() / n)
        .transition()
          .attr("y", function(d) { return y(d[1] - d[0]); })
          .attr("height", function(d) { return y(0) - y(d[1] - d[0]); });
    } else {
      rect.attr("x", function(d, i) { return x(i) + x.bandwidth() / n * this.parentNode.__data__.key; })
          .attr("width", x.bandwidth() / n)
          .attr("y", function(d) { return y(d[1] - d[0]); })
          .attr("height", function(d) { return y(0) - y(d[1] - d[0]); });
    }

    //resetting y-axis
    d3.selectAll("g.axis--y").remove();
    
    svg.append("g")
     .attr("class", "axis axis--y")
     .style("font-size", "12px")
     .call(
        d3.axisLeft(y)
      );    
  }

  function transitionStacked() {
    y.domain([0, y1Max]);
    if(d3.select('input[name="animation"]:checked').property("value") == "on"){
      rect.transition()
          .duration(500)
          .delay(function(d, i) { return i * 10; })
          .attr("y", function(d) { return y(d[1]); })
          .attr("height", function(d) { return y(d[0]) - y(d[1]); })
        .transition()
          .attr("x", function(d, i) { return x(i); })
          .attr("width", x.bandwidth());
    } else {
      rect.attr("y", function(d) { return y(d[1]); })
          .attr("height", function(d) { return y(d[0]) - y(d[1]); })
          .attr("x", function(d, i) { return x(i); })
          .attr("width", x.bandwidth());
    }
    //resetting y-axis
      d3.selectAll("g.axis--y").remove();
      
      svg.append("g")
        .attr("class", "axis axis--y")
        .style("font-size", "12px")
        .call(
          d3.axisLeft(y)
        );
  }

  function mapReverse(obj){
    let map = new Map();
    Object.keys(obj).forEach(key => {
      map.set(obj[key], key);
    });
    return map;
  }
});