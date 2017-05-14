/****************************************
  mslinegraph.js
  Creates a linegraph from a JSON file

  Melissa Wijngaarden, 10810412
  Data Processing 2017 Week 5
*****************************************/

// get data from json file and return an error if failed
var data1 = d3.json("AEXWeekly.json", function(error, data) {
  if (error) return console.warn(error);

// dataset 2 for when DJI is clicked in drop down
var data2 = d3.json("DJIWeekly.json")

// To work with dropdown, make function of makeGraph
// function makeGraph(data) {

// put time column in right format
var parseDate = d3.time.format("%e-%_m-%Y").parse;

// add the loaded data into objects
data.forEach(function(d) 
{
  d.date = parseDate(d.date);
  d.high = +d.high;
  d.low = +d.low;
  d.average = +d.average;
});

// create window
var margin = {top: 10, right: 80, bottom: 30, left: 50},
    width = 1200 - margin.left - margin.right,
    height = 600 - margin.top - margin.bottom;

// scale x based on time
var x = d3.time.scale()
    .domain([new Date(2006, 11, 31), new Date(2016, 11, 25)])
    .range([0, width - margin.left - margin.right]);

// scale y linear
var y = d3.scale.linear()
    .range([height, 0]);

// create svg inside HTML-body
var svg = d3.select("body").append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.bottom + margin.top)
  .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

  // create rounded ticks for the x and y axis
  x.domain(d3.extent(data, function(d) 
  { 
    return d.date; 
  }))
  .nice();

  y.domain(d3.extent(data, function(d)
  { 
    return d.low; 
  }))
  .nice();

// create x axis
var xAxis = d3.svg.axis()
    .scale(x)
    .orient("bottom")
    .ticks(d3.time.years)
    .tickFormat(d3.time.format("%Y"));

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
      .text("Years");

// create y axis
var yAxis = d3.svg.axis()
    .scale(y)
    .orient("left");

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
      .text("Euro")

// create line representing date and average AEX value corresponding to that week
var lineAverage = d3.svg.line()
    .x(function(d) { return x(d.date); })
    .y(function(d) { return y(d.average); });

// create line representing date and highest AEX value corresponding to that week
var lineHigh = d3.svg.line()
    .x(function(d) { return x(d.date); })
    .y(function(d) { return y(d.high); });

// create line representing date and lowest AEX value corresponding to that week
var lineLow = d3.svg.line()
    .x(function(d) { return x(d.date); })
    .y(function(d) { return y(d.low); });


// draw lines with id depending on what they represent
svg.append("path")
      .attr("id", "lineAverage")
      .attr("class","line")
      .datum(data)
      .attr("fill", "none")
      .attr("stroke", "steelblue")
      .attr("stroke-linejoin", "round")
      .attr("stroke-linecap", "round")
      .attr("stroke-width", 1.5)
      .attr("d", lineAverage);

  svg.append("path")
      .attr("id", "lineHigh")
      .attr("class","line")
      .datum(data)
      .attr("fill", "none")
      .attr("stroke", "brown")
      .attr("stroke-linejoin", "round")
      .attr("stroke-linecap", "round")
      .attr("stroke-width", 1.5)
      .attr("d", lineHigh);

  svg.append("path")
      .attr("id", "lineLow")
      .attr("class","line")
      .datum(data)
      .attr("fill", "none")
      .attr("stroke", "yellow")
      .attr("stroke-linejoin", "round")
      .attr("stroke-linecap", "round")
      .attr("stroke-width", 1.5)
      .attr("d", lineLow);


// append in svg g with class mouse-over-effects
var mouseG = svg.append("g")
  .attr("class", "mouse-over-effects");

// create the vertical line
mouseG.append("path")
  .attr("class", "mouse-line")
  .style("stroke", "black")
  .style("stroke-width", "1px")
  .style("opacity", "0");

// include data from all three lines
var lines = document.getElementsByClassName('line');

// create a g for each circle and text on the line
var mousePerLine = mouseG.selectAll('.mouse-per-line')
  .data(data)
  .enter()
  .append("g")
  .attr("class", "mouse-per-line");

mousePerLine.append("circle")
  .attr("r", 7)
  .style("stroke", "black")
  .style("fill", "none")
  .style("stroke-width", "1px")
  .style("opacity", "0");

// rect to capture mouse movements
mouseG.append('svg:rect')
  .attr('width', width)
  .attr('height', height)
  .attr('fill', 'none')
  .attr('pointer-events', 'all')
  .on('mouseout', function() { 
    d3.select(".mouse-line")
      .style("opacity", "0");
    d3.selectAll(".mouse-per-line circle")
      .style("opacity", "0");
    d3.selectAll(".mouse-per-line text")
      .style("opacity", "0");
  })
  .on('mouseover', function() { 
    d3.select(".mouse-line")
      .style("opacity", "1");
    d3.selectAll(".mouse-per-line circle")
      .style("opacity", "1");
    d3.selectAll(".mouse-per-line text")
      .style("opacity", "1");
  })
  .on('mousemove', function() {
    var mouse = d3.mouse(this);

    // move the vertical line
    d3.select(".mouse-line")
      .attr("d", function() {
        var d = "M" + mouse[0] + "," + height;
        d += " " + mouse[0] + "," + 0;
        return d;
      });

    // position the circle and text
    d3.selectAll(".mouse-per-line")
      .attr("transform", function(d, i) {
        var xDate = x.invert(mouse[0]),
            bisect = d3.bisector(function(d) { return d.date; }).right;
            idx = bisect(d.average, xDate);

        var beginning = 0,
            // end = width = 1200 - margin.left - margin.right
            end = lines[i].getTotalLength(),
            target = null;

        while (true){
          target = Math.floor((beginning + end) / 2);
          pos = lines[i].getPointAtLength(target);
          if ((target === end || target === beginning) && pos.x !== mouse[0]) {
              break;
          }
          if (pos.x > mouse[0])
          {
            end = target;
          }     
          else if (pos.x < mouse[0])
          {
            beginning = target;
          }
          else break; //position found
        }

      // update the text with y value
        d3.select(this).select('text')
          .text(y.invert(pos.y).toFixed(2));

        // return position
        return "translate(" + mouse[0] + "," + pos.y +")";
    });

});

// if id 1 is selected
//   makeGraph(data2);
// else makeGraph(data1)

});
