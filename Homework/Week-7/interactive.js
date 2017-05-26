/* 
  interactive.js
  interactive webpage mapping GSP's of the USA
  Melissa Wijngaarden, 10810412
  Week 6 & 7
*/

var margin = {top: 10, right: 80, bottom: 30, left: 50},
    width = 800 - margin.left - margin.right,
    height = 600 - margin.top - margin.bottom;

// create tooltip and hide it
var div = d3.select("body").append("div")
            .attr("class", "tooltip")
            .style("opacity", 0);
 
// draw svg inside of body
var svg = d3.select("body").append("svg")
            .attr("width", width)
            .attr("height", height)
            .attr("class", "col-sm-6")

// use the albersUsa projection with focus on the USA
var projection = d3.geo.albersUsa()
                   .scale(900)
                   .translate([width / 2, height / 2]);

// draw pahts
var path = d3.geo.path()
             .projection(projection);

// load data using queue 
queue()
  .defer(d3.json, "us.json")
  .defer(d3.json, "GSPUS.json")
  .await(ready);
 
// when data is loaded execute ready function
function ready(error, us, data) {

// introduce objects to store data in
var pairAbsWithId = {};
var pairNameWithId = {};
var pairGRateWithId = {};
var pairPRateWithId = {};
 
// load data in objects
data.forEach(function(d) 
{
  pairAbsWithId[d.FIPS] = +d.GSP;
  pairGRateWithId[d.FIPS] = +d.percentagegsp;
  pairPRateWithId[d.FIPS] = +d.percentagepop;
  pairNameWithId[d.FIPS] = d.state;
});

// function to display the right values next to the map
function displayInfo(d) 
{

  // update statename
  $('#state-name')
    .html(pairNameWithId[d.id]);

  // update colored part of progressbar subject to GSP as percentage of GDP
  $("#progress-move")
    .css({
      "width": (25 + pairGRateWithId[d.id]) + "%"
    });

  // update progressbar text with GSP as percentage of GDP
  $("#progress-move")
    .text(pairGRateWithId[d.id] + "%");

  // update colored part of progressbar subject to population as percentage of total
  $("#progress-move2")
    .css({
      "width": (25 + pairPRateWithId[d.id]) + "%"
    });

  // update progressbar text with population as percentage of total
  $("#progress-move2")
    .text(pairPRateWithId[d.id] + "%");
};

// draw map
svg.append("g")
   .attr("class", "state")
   .selectAll("path")
   .data(topojson.feature(us, us.objects.states).features)
   .enter().append("path")
   .attr("d", path)
   .on("mouseover", function(d) 
   {
     // create mouse-over effect on state
     d3.select(this)
       .transition()
       .duration(300)
       .style("fill", "orange");

     // show tooltip
     div.transition()
        .duration(300)
        .style("opacity", 1)
     div.text(pairNameWithId[d.id] + " : $" + pairAbsWithId[d.id] + "bln")
        .style("left", (d3.event.pageX) + "px")
        .style("top", (d3.event.pageY -30) + "px");

      // show info from function displayInfo
      $("#state-info-holder")
        .show();
        displayInfo(d);
      return;
  })
  .on("mouseout", function() 
  {
      // color state back to black
      d3.select(this)
        .transition()
        .duration(300)
        .style("fill", "black");

      // hide tooltip again
      div.transition()
         .duration(300)
         .style("opacity", 0);
  });

// function to update values on map
function updateData (option) 
{
  if (option == 2016)
    {
      // load new data
      queue()
        .defer(d3.json, "us.json")
        .defer(d3.json, "GSPUS2.json")
        .await(ready);

      // execute ready with new data
      ready(error, us, data);

      // update text
      d3.select(".upper")
        .text("Welcome to the Present");

      d3.select(".intro")
        .text("Gross State Product in 2016 in the United States of America");

      d3.select(".progress-bar1")
        .text("$ 18 569.1 billion");

      d3.select(".progress-bar2")
        .text("323.1 mln people");
  }

  else if (option == 1960)
  {
    // load new data
    queue()
      .defer(d3.json, "us.json")
      .defer(d3.json, "GSPUS.json")
      .await(ready);

    // execute ready with new data
    ready(error, us, data);
      
    // update text
    d3.select(".upper")
      .text("Welcome to the Past");

    d3.select(".intro")
      .text("Gross State Product in 1960 in the United States of America");

    d3.select(".progress-bar1")
      .text("$ 543.3 billion");

    d3.select(".progress-bar2")
      .text("543.3 mln people");
  }

  else if (option == 2022)
  {
    // load new data
    queue()
      .defer(d3.json, "us.json")
      .defer(d3.json, "GSPUS3.json")
      .await(ready);

    // execute ready with new data
    ready(error, us, data);
      
    // update text
    d3.select(".upper")
      .text("Welcome to the Future");

    d3.select(".intro")
      .text("Estimated Gross State Product in 2022 in the United States of America");

    d3.select(".progress-bar1")
      .text("$ 23 092.7 billion");
    d3.select(".progress-bar2")
      .text("334.5 mln people");
  }

}; 


// if an option from the drop down menu is selected execute ready with new values
d3.select("#time_selector")
  .on("change", function ready()
  {
    // store wich value is selected
    var select = document.getElementById("time_selector");
    var option = select.options[select.selectedIndex].value;

    // execute function update data for the given option
    updateData(option);
  });

}