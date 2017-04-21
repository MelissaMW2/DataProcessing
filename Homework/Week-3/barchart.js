/****************************************
	Barchart.js
	Creates a barchart from a json file

	Melissa Wijngaarden, 10810412
	Data Processing 2017 Week 3
*****************************************/

// get data from json file
var data = d3.json("dataAirbnb.json", function (error, data)
{
	// if the data is not loaded, return an error
	if (error) return console.warn(error);

// create svg inside HTML-body
var svg = d3.select("body").append("svg")
	.attr("width", "1200")
	.attr("height", "500")

// create text inside svg to add data in later
var info = svg.append("text")
	.attr("width", "120")
	.attr("height", "50")
	.attr("x", "200")
	.attr("y", "100")
	.attr("fill", "#000000")


// create rectangles for the bar chart inside svg
svg.selectAll("rect")
	.data(data)
	.enter()
	.append("rect")
	.attr("width", 40)
	// height of the rectangle depends on the value of listings in a neigbourhood
	.attr("height",  function (d, i)
	{
		return d.listings * 0.15;
	})
	// to start each rectangle at the same horizontal line the y position of the rectangle also depends on listings in a neighbourhood
	.attr("y", function ( d, i)
	{
		return 500 - (d.listings * 0.15);
	})
	.attr("x", function ( d, i)
	{
		return (i * 50) + 10;
	})
	// create new objects to be able able to access data of each rectangle later
	.attr("d", function ( d, i) 
	{
		return d.listings;
	})
	.attr("i", function ( d, i) 
	{
		return i;
	})
	.attr("n", function ( d, i) 
		{
			return d.neighbourhood;
		})
	.attr("fill", "brown")
	.on("mouseover", function()
	{
		// when hovered over the color of that rectangle needs to change to orange
		d3.select(this)
		.attr("fill", "orange")

		// store the listings, index and neighbourhood from current rectancle
		var current_d = d3.select(this).attr("d");
		var current_i = d3.select(this).attr("i");
		var current_n = d3.select(this).attr("n");
		
		// make the text containing the listing of the neighbourhood that belongs to the current rectangle visible
		info.attr("x", (current_i * 50) + 15)
		.style("visibility", "visible")
		.attr("y", 500 - (Number(current_d) * 0.15))
		.text(current_d)

		// make the text containing the name of the neighbourhood that belongs to the current rectangle visible
 		xValues.attr("x", (current_i * 50) + 15)
		.style("visibility", "visible")
		.attr("y", 500 - (Number(current_d) * 0.15 + 20))
		.text(current_n)
	})
	// when not being hovered over the color of the rectangle needs to be brown again and all text hidden
	.on("mouseout", function ()
	{
		d3.select(this)
		.attr("fill","brown")
		d3.selectAll("text")
		.style("visibility","hidden")
	})

	// file is loaded asynchronically so text containing names of the neighbourhood written last such that it appears in front of the bars
	var xValues = svg.append("text")
	.attr("width", "120")
	.attr("height", "50")
	.attr("x", "200")
	.attr("y", "100")
	.attr("fill", "#000000")
})