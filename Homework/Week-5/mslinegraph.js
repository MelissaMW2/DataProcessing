/****************************************
  mslinegraph.js
  Creates a linegraph from a JSON file

  Melissa Wijngaarden, 10810412
  Data Processing 2017 Week 5
*****************************************/

// get data from json file and return an error if failed
var data = d3.json("AEXWeekly.json", function(error, data) {
  if (error) return console.warn(error);

var parseDate = d3.time.format("%e-%_m-%Y").parse;

var lineAverage = d3.svg.line()
    .x(function(d) { return x(d.date); })
    .y(function(d) { return y(d.average); });

var lineHigh = d3.svg.line()
    .x(function(d) { return x(d.date); })
    .y(function(d) { return y(d.high); });

var lineLow = d3.svg.line()
    .x(function(d) { return x(d.date); })
    .y(function(d) { return y(d.low); });

// add the loaded data into objects
data.forEach(function(d) 
{
  // d.week = +d.week;
  d.date = parseDate(d.date);
  d.high = +d.high;
  d.low = +d.low;
  d.average = +d.average;
});

console.log(data);

var margin = {top: 10, right: 80, bottom: 30, left: 50},
    width = 1200 - margin.left - margin.right,
    height = 600 - margin.top - margin.bottom;

// introduce global variables
// var width = 1200;
// var height = 600;


// var x = d3.time.scale().domain([minDate, maxDate]).range([0, width - 100]);

// scale x and y linear

var x = d3.time.scale()
    .domain([new Date(2006, 11, 31), new Date(2016, 11, 25)])
    .range([0, width - margin.left - margin.right]);

// var x = d3.scale.linear()
//     .range([0, width - 100]);

var y = d3.scale.linear()
    .range([height, 0]);

// create svg inside HTML-body
var svg = d3.select("body").append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.bottom + margin.top)
  .append("g")
    .attr("transform", "translate(" + 40 + "," + 10 + ")");

// create x and y axis
// var xAxis = d3.svg.axis()
//     .scale(x)
//     .orient("bottom");

// // add the tooltip area to the webpage
// var tooltip = d3.select("body").append("div")
//     .attr("class", "tooltip")
//     .style("opacity", 0);

var xAxis = d3.svg.axis()
    .scale(x)
    .orient("bottom")
    .ticks(d3.time.years)
    // .tickSize(5, 0)
    .tickFormat(d3.time.format("%Y"));

var yAxis = d3.svg.axis()
    .scale(y)
    .orient("left");

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

  // append a g for all the mouse over nonsense
var mouseG = svg.append("g")
  .attr("class", "mouse-over-effects");

// this is the vertical line
mouseG.append("path")
  .attr("class", "mouse-line")
  .style("stroke", "black")
  .style("stroke-width", "1px")
  .style("opacity", "0");

// here's a g for each circle and text on the line
var mousePerLine = mouseG.selectAll('.mouse-per-line')
  .data(data)
  .enter()
  .append("g")
  .attr("class", "mouse-per-line");

// keep a reference to all our lines
// var lines = document.querySelectorAll('.lineAverage, .lineLow, .lineHigh');
// var lines = document.getElementsByClassName('lineAverage');

// the circle
mousePerLine.append("circle")
  .attr("r", 7)
  .style("stroke", "black")
  .style("fill", "none")
  .style("stroke-width", "1px")
  .style("opacity", "0");

// the text
mousePerLine.append("text")
  .attr("transform", "translate(10,3)");

// rect to capture mouse movements
mouseG.append('svg:rect')
  .attr('width', width)
  .attr('height', height)
  .attr('fill', 'none')
  .attr('pointer-events', 'all')
  .on('mouseout', function() { // on mouse out hide line, circles and text
    d3.select(".mouse-line")
      .style("opacity", "0");
    d3.selectAll(".mouse-per-line circle")
      .style("opacity", "0");
    d3.selectAll(".mouse-per-line text")
      .style("opacity", "0");
  })
  .on('mouseover', function() { // on mouse in show line, circles and text
    d3.select(".mouse-line")
      .style("opacity", "1");
    d3.selectAll(".mouse-per-line circle")
      .style("opacity", "1");
    d3.selectAll(".mouse-per-line text")
      .style("opacity", "1");
  })
  .on('mousemove', function() { // mouse moving over canvas
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

        // since we are use curve fitting we can't relay on finding the points like I had done in my last answer
        // this conducts a search using some SVG path functions
        // to find the correct position on the line
        // from http://bl.ocks.org/duopixel/3824661
        var beginning = 0,
            end = lines[i].getTotalLength(),
            target = null;

        while (true){
          target = Math.floor((beginning + end) / 2);
          pos = lines[i].getPointAtLength(target);
          if ((target === end || target === beginning) && pos.x !== mouse[0]) {
              break;
          }
          if (pos.x > mouse[0])      end = target;
          else if (pos.x < mouse[0]) beginning = target;
          else break; //position found
        }

        // update the text with y value
        d3.select(this).select('text')
          .text(y.invert(pos.y).toFixed(2));

        // return position
        return "translate(" + mouse[0] + "," + pos.y +")";
      });
  });

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


  var line = d3.svg.line()
    .interpolate("basis")
    .x(function(d) { return x(d.date); })
    .y(function(d) { return y(d.temperature); });

  svg.append("path")
      .attr("class","lineAverage")
      .datum(data)
      .attr("fill", "none")
      .attr("stroke", "steelblue")
      .attr("stroke-linejoin", "round")
      .attr("stroke-linecap", "round")
      .attr("stroke-width", 1.5)
      .attr("d", lineAverage);

  svg.append("path")
      .attr("class","lineHigh")
      .datum(data)
      .attr("fill", "none")
      .attr("stroke", "brown")
      .attr("stroke-linejoin", "round")
      .attr("stroke-linecap", "round")
      .attr("stroke-width", 1.5)
      .attr("d", lineHigh);

  svg.append("path")
      .attr("class","lineLow")
      .datum(data)
      .attr("fill", "none")
      .attr("stroke", "yellow")
      .attr("stroke-linejoin", "round")
      .attr("stroke-linecap", "round")
      .attr("stroke-width", 1.5)
      .attr("d", lineLow);

  // svg.append("path") // this is the black vertical line to follow mouse
  //   .attr("class","mouseLine")  
  //   .style("stroke","black")
  //   .style("stroke-width", "1px")
  //   .style("opacity", "0");

  // svg.append("g")
  //   // .data(data)
  //   // .enter()
  //   .append("text")
  //   .attr("class", "legend");

   

      // .attr("cx", function(d, i) 
      // {
      //     return x(d.date);
      // })
      // .attr("cy", function(d, i) 
      // {
      //     return y(d.average);
      // })
      // .attr("date", function (d,i)
      // {
      //   return d.date;
      // })
      // .attr("low", function (d,i)
      // {
      //   return d.average;
      // })
      // .on("mouseout", function()
      // {
      //   d3.select("text")
      //   .attr("visibility", "hidden")
      // })
      // .on("mouseover", function()
      // {
      //   var currentX = d3.select(this).attr("cx")
      //   var currentDate = d3.select(this).attr("date")
      //   var currentLow = d3.select(this).attr("low")

      //   dates.attr("x", currentX)
      //   .style("visibility", "visible")
      //   .attr("y", (height - 42))
      //   .text(currentDate)

      //   averages.attr("x", currentX)
      //   .style("visibility", "visible")
      //   .attr("y", (height - 50))
      //   .text(currentLow)
      // });
  

  // var dates = svg.append("text")
  // .attr("class", "hover")

  // var averages = svg.append("text")
  // .attr("class", "hover")

// var mouseText = svg.append("g") // for each line, add group to hold text and circle
//       .attr("class","mouseText"); 

//     mouseText.append("text")
//       .attr("transform", "translate(10,3)");


// svg.append('svg:rect') // append a rect to catch mouse movements on canvas
//   .attr('width', width) // can't catch mouse events on a g element
//   .attr('height', height)
//   .attr('fill', 'none')
//   .attr('pointer-events', 'all')
//   .on('mouseout', function(){ // on mouse out hide line, circles and text
//     d3.select(".lineAverage")
//       .style("opacity", "0");
//     d3.selectAll(".mouseText")
//       .style("opacity", "0");
//   })
//   .on('mouseover', function(){ // on mouse in show line, circles and text
//     d3.select(".lineAverage")
//       .style("opacity", "1");
//     d3.selectAll(".mouseText")
//       .style("opacity", "1");
//   })
//   .on('mousemove', function() { // mouse moving over canvas
//     d3.select(".lineAverage")
//     .attr("d", function(){
//       yRange = y.range(); // range of y axis
//       var xCoor = d3.mouse(this)[0]; // mouse position in x
//       var xDate = x.invert(xCoor); // date corresponding to mouse x 
//       d3.selectAll('.mouseText') // for each circle group
//         .each(function(d,i){
//          var rightIdx = bisect(data[1].values, xDate); // find date in data that right off mouse
//          var interSect = get_line_intersection(xCoor,  // get the intersection of our vertical line and the data line
//             yRange[0], 
//             xCoor, 
//             yRange[1],
//             x(data[i].values[rightIdx-1].date),
//             y(data[i].values[rightIdx-1].average),
//             x(data[i].values[rightIdx].date),
//             y(data[i].values[rightIdx].average));
          
//         d3.select(this.children[1]) // write coordinates out
//           .text(xDate.toLocaleDateString() + "," + y.invert(interSect.y).toFixed(0));

//         });

//       return "M"+ xCoor +"," + yRange[0] + "L" + xCoor + "," + yRange[1]; // position vertical line
//     });
//   });  

var legend = svg.append("g")
    .attr("class", "legend")
    // // both text and color are based on index and data
    // .attr("transform", function(d, i)
    // { 
    //   return "translate(0," + i * 20 + ")";
    // });

// HIER EEN FUNCTIE VOOR SCHRIJVEN IS MOOIER EN KORTER

  legend.append("rect")
      .attr("x", width - 20)
      .attr("y", 8)
      .attr("width", 18)
      .attr("height", 2)
      .style("fill", "yellow");

  legend.append("text")
      .attr("x", width - 24)
      .attr("y", 9)
      .attr("dy", ".35em")
      .style("text-anchor", "end")
      .text("Weekly Minimum")

  legend.append("rect")
      .attr("x", width - 20)
      .attr("y", 20)
      .attr("width", 18)
      .attr("height", 2)
      .style("fill", "steelblue");

  legend.append("text")
      .attr("x", width - 25)
      .attr("y", 21)
      .attr("dy", ".35em")
      .style("text-anchor", "end")
      .text("Weekly Average")

  legend.append("rect")
      .attr("x", width - 20)
      .attr("y", 32)
      .attr("width", 18)
      .attr("height", 1)
      .style("fill", "brown");

  legend.append("text")
      .attr("x", width - 24)
      .attr("y", 33)
      .attr("dy", ".35em")
      .style("text-anchor", "end")
      .text("Weekly Maximum")
      // text is based on data
      // .text(function(d) 
      // { 
      //   return d; 
      // });




// // create crosshairs
//     var crosshair = svg.append("g")
//       .attr("class", "line");
//     // create horizontal line
//     crosshair.append("line")
//       .attr("id", "crosshairX")
//       .attr("class", "crosshair");
//     // create vertical line
//     crosshair.append("line")
//       .attr("id", "crosshairY")
//       .attr("class", "crosshair");
//     svg.append("rect")
//       .attr("class", "overlay")
//       .attr("width", width)
//       .attr("height", height)
//       .on("mouseover", function() {
//         crosshair.style("display", null);
//       })
//       .on("mouseout", function() {
//         crosshair.style("display", "none");
//         label.text("");
//       })
//       .on("mousemove", function() {
//         var mouse = d3.mouse(this);
//         var x = mouse[0];
//         var y = mouse[1];
//         crosshair.select("#crosshairX")
//           .attr("x1", mouse[0])
//           .attr("y1", yScale(yDomain[0]))
//           .attr("x2", mouse[0])
//           .attr("y2", yScale(yDomain[1]));
//         crosshair.select("#crosshairY")
//           .attr("x1", xScale(xDomain[0]))
//           .attr("y1", mouse[1])
//           .attr("x2", xScale(xDomain[1]))
//           .attr("y2", mouse[1]);
//         label.text(function() {
//           return "x=" + x + ", y=" + y;
//         });
//       })
//       .on("click", function() {
//         console.log(d3.mouse(this));
      });

