/****************************************
  scatterplot.js
  Creates a scatterplot from a JSON file

  Melissa Wijngaarden, 10810412
  Data Processing 2017 Week 4
*****************************************/

// get data from json file and return an error if failed
var data = d3.json("OECDCountries.json", function(error, data) {
  if (error) return console.warn(error);

// add the loaded data into objects
data.forEach(function(d) 
{
  d.satisfaction = +d.satisfaction;
  d.freetime = +d.freetime;
  d.unemployment = +d.unemployment;
});

// introduce global variables
var width = 1200;
var height = 600;

// scale x, y and dotsize linear
var x = d3.scale.linear()
    .range([0, width - 100]);

var y = d3.scale.linear()
    .range([height, 0]);

var dotSize = d3.scale.linear()
      .range([0,1]);

// create colorscale
var color = d3.scale.category20b();

// create svg inside HTML-body
var svg = d3.select("body").append("svg")
    .attr("width", width + 40 + 20)
    .attr("height", height + 20 + 30)
  .append("g")
    .attr("transform", "translate(" + 40 + "," + 10 + ")");

// create x and y axis
var xAxis = d3.svg.axis()
    .scale(x)
    .orient("bottom");

var yAxis = d3.svg.axis()
    .scale(y)
    .orient("left");

  // create rounded ticks for the x and y axis
  x.domain(d3.extent(data, function(d) 
  { 
    return d.freetime; 
  }))
  .nice();

  y.domain(d3.extent(data, function(d)
  { 
    return d.satisfaction; 
  }))
  .nice();

  // draw x axis
  svg.append("g")
      .attr("class", "x axis")
      .attr("transform", "translate(0,"+ height +")")
      .call(xAxis)

  // write x title
  svg.append("text")
      .attr("class", "label")
      .attr("transform", "translate(" + (width / 2) + " ," + (height + 30) + ")")
      .style("text-anchor", "middle")
      .text("Average Free Hours per Day");

  // draw y axis
  svg.append("g")
      .attr("class", "y axis")
      .call(yAxis)
  
  // write title on y-axis
  svg.append("text")
      .attr("class", "label")
      .attr("transform", "rotate(-90)")
      .attr("y", - 40)
      .attr("x", - (height / 2))
      .attr("dy", "0.71em")
      .style("text-anchor", "middle")
      .text("Satisfaction with Maximum of 10")

  // create the scatterplot's dots inside svg
  svg.selectAll(".dot")
      .data(data)
    .enter().append("circle")
      .attr("class", "dot")
      // size of the dot depends on the scaled value of unemployment
      .attr("r", function(d)
      {
        return dotSize(d.unemployment);
      })
      // the horizontal location depends on the scaled value of freetime
      .attr("cx", function(d) 
      { 
        return x(d.freetime);
      })
      // the vertical location depends on the scaled value of satisfaction
      .attr("cy", function(d) 
      { 
        return y(d.satisfaction); 
      })
      // the color depends on the country's colorscale
      .style("fill", function(d) 
      { 
        return color(d.country); 
      })
      // store values to access later
      .attr("ctr", function (d,i)
      {
        return d.country;
      })
      .attr("ftm", function (d,i)
      {
        return d.freetime;
      })
      .attr("stf", function (d,i)
      {
        return d.satisfaction;
      })
      .attr("unpmt", function (d,i)
      {
        return d.unemployment;
      })
      .on("mouseover", function()
      {
        // store the current values of this specific dot
        var currentCtr = d3.select(this).attr("ctr");
        var currentD = d3.select(this).attr("cy")
        var currentX = d3.select(this).attr("cx")
        var currentFtm = d3.select(this).attr("ftm")
        var currentStf = d3.select(this).attr("stf")
        var currentUnpmt = d3.select(this).attr("unpmt")

        // when hovered over show relevant countryname
        countryName.attr("x", currentX + 5)
        .style("visibility", "visible")
        .attr("y", (Number(currentD) - 42))
        .text(currentCtr)

        // when hovered over show relevant satisfactionrate
        yValues.attr("x", currentX + 5)
        .style("visibility", "visible")
        .attr("y", (Number(currentD) - 27))
        .text("Satisfaction: " + currentStf)

        // when hovered over show relevant free time
        xValues.attr("x", currentX + 5)
        .style("visibility", "visible")
        .attr("y", (Number(currentD) - 14))
        .text("Freetime: " + currentFtm)

        // when hovered over show relevant unemploymentrate
        unempRate.attr("x", currentX + 5)
        .style("visibility", "visible")
        .attr("y", (Number(currentD) - 1))
        .text("Unemploymentrate: " + currentUnpmt)
      })
      .on("mouseout", function ()
      {
        // when not hovered over, remove all text with class hover
        d3.selectAll(".hover")
        .style("visibility", "hidden")
      })

  // file is loaded asynchronically text is written last such that it appears in front of the other items
  var countryName = svg.append("text")
  .attr("class", "hover")

  var xValues = svg.append("text")
  .attr("class", "hover")

  var yValues = svg.append("text")
  .attr("class", "hover")

  var unempRate = svg.append("text")
  .attr("class", "hover")

  // create a class called legend in svg
  var legend = svg.selectAll(".legend")
      .data(color.domain())
    .enter().append("g")
      .attr("class", "legend")
      // both text and color are based on index and data
      .attr("transform", function(d, i)
      { 
        return "translate(0," + i * 20 + ")";
      });

  // draw the rectangles and fill them with appropiate color
  legend.append("rect")
      .attr("x", width - 20)
      .attr("width", 18)
      .attr("height", 18)
      .style("fill", color);

  // write countryname next to the rectangle
  legend.append("text")
      .attr("x", width - 24)
      .attr("y", 9)
      .attr("dy", ".35em")
      .style("text-anchor", "end")
      // text is based on data
      .text(function(d) 
      { 
        return d; 
      });

});