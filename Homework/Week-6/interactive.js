/****************************************
  interactive.js
  Creates a interactive map from a JSON file

  Melissa Wijngaarden, 10810412
  Data Processing 2017 Week 6
*****************************************/

window.onload = initialize();

function initialize(){ 

  var margin = { top: 10, left: 10, right: 10, bottom: 10},
    height = 400 - margin.top - margin.bottom,
    width = 800 - margin.left - margin.right;

  var svg = d3.select(".g-chart")
      .append("svg")
      .attr("height", height + margin.top + margin.bottom)
      .attr("width", width + margin.left + margin.right)
      .append("g")
      .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

  //Load the files
  queue()
      .defer(d3.json, "us2.json")
      .defer(d3.json, "GSPUS.json")
      .await(ready);

  var div = d3.select("body").append("div")
    .attr("class", "tooltip")
    .style("opacity", 0);

  //Tells the nap what projection to use
  var projection = d3.geo.albersUsa()
      .scale(850)
      .translate([width / 2, height / 2]);
  
  //Tells the map how to draw the paths from the projection
  var path = d3.geo.path()
      .projection(projection);

  function ready (error, data, gsp) {
    if (error) throw error;

    console.log(data, gsp);




  // //Moves selection to front
  // d3.selection.prototype.moveToFront = function() {
  //   return this.each(function(){
  //     this.parentNode.appendChild(this);
  //   });
  // }; 

  // //Moves selection to back
  // d3.selection.prototype.moveToBack = function() { 
  //   return this.each(function() { 
  //   var firstChild = this.parentNode.firstChild; 
  //     if (firstChild) { 
  //       this.parentNode.insertBefore(this, firstChild); 
  //     } 
  //   }); 
  // };    

  // function ready(error, us, maptemplate) {
  //   if (error) throw error;

  //   console.log(maptemplate);   

    //Sets color scale
    var numMedian = d3.median(gsp, function(d) { return d.GSP1960;}); 
    
    var quantize = d3.scale.quantize()
      .domain([0, numMedian])
      .range(d3.range(5).map(function(i) { return "q" + i + "-9"; }));

   
    //Pair data with state id
    var dataByFIPS = {};
    gsp.forEach(function(d) { dataByFIPS[d.FIPS] = +d.GSP1960; });
    console.log(dataByFIPS)

    //Pair state name with state id
    var stateByFIPS = {};
    gsp.forEach(function(d) { stateByFIPS[d.FIPS] = d.state; });
    console.log(stateByFIPS)

    //Appends chart headline
    d3.select(".header").text("Gross State Product 1960 United States of America");

    //Appends chart intro text
    d3.select(".intro").text("Data visualisation by Melissa Wijngaarden for Data Processing at UvA.");

    //Append states
    svg.append("g")
      .attr("class", "states")
      .selectAll("path")
      .data(topojson.feature(data, data.objects.states).features)
      .enter()
      .append("path")
      .attr("d", path)
      //Color states
      .attr("class", function(d) { return quantize(dataByFIPS[d.id]); })
      // Hovers
      .on("mouseover", function(d) {
        // var sel = d3.select(this)
        //   sel.moveToFront();
        d3.select(this).transition().duration(300).style("opacity", 0.8);
        div.transition().duration(300)
        .style("opacity", 1)
        div.text(stateByFIPS[d.id] + ": " + dataByFIPS[d.id])
        .style("left", (d3.event.pageX) + "px")
        .style("top", (d3.event.pageY -30) + "px");
      })
      .on("mouseout", function() {
        // var sel = d3.select(this);
        //   sel.moveToBack();
        d3.select(this)
        .transition().duration(300)
        .style("opacity", 1);
        div.transition().duration(300)
        .style("opacity", 0);
      });

    //Appends chart source
    d3.select(".source-bold")
      .text("SOURCE: ")
      .attr("class", ".source-bold");

    d3.select(".source-reg")
      .text("Leuk hoor")
      .attr("class", ".source-reg");    

  // ** Update data section (Called from the onclick)
//   function updateData() {
//       // Get the data again
//     queue()
//       .defer(d3.json, "us2.json")
//       .defer(d3.json, "GSPUS2.json")
//       .await(ready);

//     function ready(error, us, gsp) {
//     if (error) throw error;

//     console.log(gsp);   

//     //Sets color scale
//     var numMedian = d3.median(maptemplate, function(d) { return d.GSP2010;}); 
    
//     var quantize = d3.scale.quantize()
//       .domain([0, numMedian])
//       .range(d3.range(5).map(function(i) { return "q" + i + "-9"; }));

   
//     //Pair data with state id
//     var dataByFIPS = {};
//     gsp.forEach(function(d) { dataByFIPS[d.FIPS] = +d.GSP2010; });
//     console.log(dataByFIPS)

//     //Pair state name with state id
//     var stateByFIPS = {};
//     gsp.forEach(function(d) { stateByFIPS[d.FIPS] = d.state; });
//     console.log(stateByFIPS)
// }
// }
}
}
