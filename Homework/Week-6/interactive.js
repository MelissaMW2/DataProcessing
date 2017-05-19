/****************************************
  interactive.js
  Creates a interactive map from a JSON file

  Melissa Wijngaarden, 10810412
  Data Processing 2017 Week 6
*****************************************/

var div = d3.select("body").append("div")
  .attr("class", "tooltip")
  .style("opacity", 0);

// introduce global variables
var width = 1200;
var height = 600;

//Tells the nap what projection to use
var projection = d3.geo.albersUsa()
    .scale(850)
    .translate([width / 2, height / 2]);

//Tells the map how to draw the paths from the projection
var path = d3.geo.path()
    .projection(projection);

//Appened svg to page
var map = d3.select(".g-chart").append("svg")
  .style('height', height + 'px')
  .style('width', width + 'px');  

//Load the files
queue()
    .defer(d3.json, "us2.json")
    .defer(d3.json, "GSPUS.json")
    .await(ready);

//Moves selection to front
d3.selection.prototype.moveToFront = function() {
  return this.each(function(){
    this.parentNode.appendChild(this);
  });
}; 

//Moves selection to back
d3.selection.prototype.moveToBack = function() { 
  return this.each(function() { 
  var firstChild = this.parentNode.firstChild; 
    if (firstChild) { 
      this.parentNode.insertBefore(this, firstChild); 
    } 
  }); 
};    

function ready(error, us, maptemplate) {
  if (error) throw error;

  console.log(maptemplate);   

  //Sets color scale
  var numMedian = d3.median(maptemplate, function(d) { return d.GSP1960;}); 
  
  var quantize = d3.scale.quantize()
    .domain([0, numMedian])
    .range(d3.range(5).map(function(i) { return "q" + i + "-9"; }));

 
  //Pair data with state id
  var dataByFIPS = {};
  maptemplate.forEach(function(d) { dataByFIPS[d.FIPS] = +d.GSP1960; });
  console.log(dataByFIPS)

  //Pair state name with state id
  var stateByFIPS = {};
  maptemplate.forEach(function(d) { stateByFIPS[d.FIPS] = d.state; });
  console.log(stateByFIPS)

  //Appends chart headline
  d3.select(".g-hed").text("Gross State Product 1960 United States of America");

  //Appends chart intro text
  d3.select(".g-intro").text("Data visualisation by Melissa Wijngaarden for Data Processing at UvA.");

  //Append states
  map.append("g")
    .attr("class", "states")
    .selectAll("path")
    .data(topojson.feature(us, us.objects.states).features)
    .enter()
    .append("path")
    .attr("d", path)
    //Color states
    .attr("class", function(d) { return quantize(dataByFIPS[d.id]); })
    // Hovers
    .on("mouseover", function(d) {
      var sel = d3.select(this);
        sel.moveToFront();
      d3.select(this).transition().duration(300).style("opacity", 0.8);
      div.transition().duration(300)
      .style("opacity", 1)
      div.text(stateByFIPS[d.id] + ": " + dataByFIPS[d.id])
      .style("left", (d3.event.pageX) + "px")
      .style("top", (d3.event.pageY -30) + "px");
    })
    .on("mouseout", function() {
      var sel = d3.select(this);
        sel.moveToBack();
      d3.select(this)
      .transition().duration(300)
      .style("opacity", 1);
      div.transition().duration(300)
      .style("opacity", 0);
    });

  svg.append("path")
      .attr("class", "state-borders")
      .attr("d", path(topojson.mesh(us, us.objects.states, function(a, b) { return a !== b; })));

  //Appends chart source
  d3.select(".g-source-bold")
    .text("SOURCE: ")
    .attr("class", "g-source-bold");

  d3.select(".g-source-reg")
    .text("Chart source info goes here")
    .attr("class", "g-source-reg");    

// ** Update data section (Called from the onclick)
function updateData() {

    // Get the data again
  queue()
    .defer(d3.json, "us2.json")
    .defer(d3.json, "GSPUS2.json")
    .await(ready);

  function ready(error, us, maptemplate) {
  if (error) throw error;

  console.log(maptemplate);   

  //Sets color scale
  var numMedian = d3.median(maptemplate, function(d) { return d.GSP2010;}); 
  
  var quantize = d3.scale.quantize()
    .domain([0, numMedian])
    .range(d3.range(5).map(function(i) { return "q" + i + "-9"; }));

 
  //Pair data with state id
  var dataByFIPS = {};
  maptemplate.forEach(function(d) { dataByFIPS[d.FIPS] = +d.GSP2010; });
  console.log(dataByFIPS)

  //Pair state name with state id
  var stateByFIPS = {};
  maptemplate.forEach(function(d) { stateByFIPS[d.FIPS] = d.state; });
  console.log(stateByFIPS)
}
}
}