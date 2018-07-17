
// Adapted from D3 homework solution and from activity code repository

// Grab the width for chart svg
var width = parseInt(d3.select(".chart").style("width"));

// Designate the height of the graph
var height = width - width / 3.9;

// Margin spacing for graph
var margin = 60;

// space for placing axis text
var labelArea = 110;

// padding for the text at the bottom and left axes
var tPadBot = 20;
var tPadLeft = 5;

// Create the actual canvas for the graph
var svg = d3
  .select(".chart")
  .append("svg")
  .attr("width", width)
  .attr("height", height)
  .attr("class", "bubble");

// Set the radius.

function getRadius(d) {
    return d <= -5 ? d * 80 : 
      d <= -3 ? d * 80 :
      d <= -1 ? d * 80 :
      d <= 0.05 ? d * 100 :
      d <= 0.10 ? d * 80 :
      d <= 0.20 ? d * 80 :
      d <= 0.40 ? d * 80 : 
      d <= 0.60 ? d * 20 :
      d <= 0.70 ? d * 20 :
      d <= 0.80 ? d * 20 :
      d <= 0.90 ? d * 20 : 
      d <= 1.2 ? d * 20 : 
      d * 10;
  }
  function getColor(d) {
    return d <= 0 ? '#41f49a' : 
      d <= 0.05  ? '#4ff441' :
      d <= 0.10 ? '#91f441' :
      d <= 0.15 ? '#bef441' :
      d <= 0.20 ?  '#eef441' :
      d <= 0.25 ? '#f4df41':
      d <= 0.30 ?  '#f4c741': 
      d <= 0.35 ? '#f4a041' :
      d <= 0.40 ? '#f47141' : 
      d <= 0.50 ? '#f46441' :
      d <= 0.55 ? '#f45b41' :
      d <= 0.60 ? '#f44941' :
      d <= 0.65 ? '#f44141' :
      d <= 0.70 ? '#f44155' :
      d <= 0.75 ? '#f44179' :
      d <= 0.80 ? '#f4419a' :
      d <= 0.85 ? '#f441be' :
      d <= 0.90 ? '#f441eb' :
      '#ca41f4';
  }

// A) Bottom Axis
// ==============

// group element to nest our bottom axes labels.
svg.append("g").attr("class", "xText");
// xText to select the group without excess code.
var xText = d3.select(".xText");

// We give xText a transform property that places it at the bottom of the chart.
// By nesting this attribute in a function, we can easily change the location of the label group
// whenever the width of the window changes.
function xTextRefresh() {
  xText.attr(
    "transform",
    "translate(" +
      ((width - labelArea) / 2 + labelArea) +
      ", " +
      (height - margin - tPadBot) +
      ")"
  );
}
xTextRefresh();

// 1. positive
xText
  .append("text")
  .attr("y", -26)
  .attr("data-name", "avgNounRatio")
  .attr("data-axis", "x")
  .attr("class", "aText active x")
  .text("Artist Lyric Noun Ratio");
// 2. negative
xText
  .append("text")
  .attr("y", 0)
  .attr("data-name", "avgVerbRatio")
  .attr("data-axis", "x")
  .attr("class", "aText inactive x")
  .text("Artist Lyric Verb Ratio");
// 3. neutral
xText
  .append("text")
  .attr("y", 26)
  .attr("data-name", "avgAdjRatio")
  .attr("data-axis", "x")
  .attr("class", "aText inactive x")
  .text("Artist Lyric Adjective Ratio");

// B) Left Axis
// ============

var leftTextX = margin + tPadLeft;
var leftTextY = (height + labelArea) / 2 - labelArea;

// We add a second label group, this time for the axis left of the chart.
svg.append("g").attr("class", "yText");

// yText will allows us to select the group without excess code.
var yText = d3.select(".yText");


function yTextRefresh() {
  yText.attr(
    "transform",
    "translate(" + leftTextX + ", " + leftTextY + ")rotate(-90)"
  );
}
yTextRefresh();

// 1. danceability
yText
  .append("text")
  .attr("y", -50)
  .attr("data-name", "danceability")
  .attr("data-axis", "y")
  .attr("class", "aText active y")
  .text("Danceability Rating");

// 2. tempo
yText
  .append("text")
  .attr("y", -25)
  .attr("data-name", "tempo")
  .attr("data-axis", "y")
  .attr("class", "aText inactive y")
  .text("Tempo Rating");

// 3. loudness
yText
  .append("text")
  .attr("y", 25)
  .attr("data-name", "loudness")
  .attr("data-axis", "y")
  .attr("class", "aText inactive y")
  .text("Loudness Rating");

// 3. energy
yText
  .append("text")
  .attr("y", 0)
  .attr("data-name", "energy")
  .attr("data-axis", "y")
  .attr("class", "aText inactive y")
  .text("Energy Rating");

// 3. valence
yText
  .append("text")
  .attr("y", 50)
  .attr("data-name", "valence")
  .attr("data-axis", "y")
  .attr("class", "aText inactive y")
  .text("Valence Rating");


// Import our CSV data with d3's .csv import method.
d3.csv("/static/avg_artist_pos_final.csv", function(data) {
  // Visualize the data
  visualize(data);
});

//visualization function

function visualize(theData) {
  
    // default chosen values
  var xValue = "avgNounRatio";
  var yValue = "danceability";

  // xmin and xmax variables for scales
  var xMin;
  var xMax;
  var yMin;
  var yMax;

  // tooltip
  var toolTip = d3
    .tip()
    .attr("class", "tooltip")
    .offset([80, -120])
    .html(function(d) {
      // chosen x key
      var theX;
      // value of artist name
      var theArtist = "<div>" + `<b> ${d.artist}</b>` + "</div>";
      // chosen y key and value
      var theY = "<div>" + `<b> ${yValue} </b>` + ": " + d[yValue] + "</div>";
      // If the x key is positive
      if (xValue=== "positive") {
        // selected x key and value
        theX = "<div>" + `<b> ${xValue} </b>` + ": " + d[xValue] + "</div>";
      }
      else {
        // select x key and value if not first xaxis
        theX = "<div>" + `<b> ${xValue} </b>` + ": " + d[xValue] + "</div>";
      
      }
      // display values
      return theArtist + theX + theY;
    });
  // Call the toolTip function.
  svg.call(toolTip);

 
  // a. change the min and max for x
  function xMinMax() {
    
    xMin = d3.min(theData, function(d) {
      return parseFloat(d[xValue]) * 0.80;
    });

    xMax = d3.max(theData, function(d) {
      return parseFloat(d[xValue]) * 1.10;
    });
  }

  // b. change the min and max for y
  function yMinMax() {
    
    yMin = d3.min(theData, function(d) {
      return parseFloat(d[yValue]) * 0.80;
    });

    yMax = d3.max(theData, function(d) {
      return parseFloat(d[yValue]) * 1.10;
    });
  }

  // c. change the classes (and appearance) of label text when clicked.
  function labelChange(axis, clickedText) {
    // Switch the currently active to inactive.
    d3
      .selectAll(".aText")
      .filter("." + axis)
      .filter(".active")
      .classed("active", false)
      .classed("inactive", true);

    // Switch the text just clicked to active.
    clickedText.classed("inactive", false).classed("active", true);
  }

  // grab the min and max values of x and y.
  xMinMax();
  yMinMax();

 // create scales

  var xScale = d3
    .scaleLinear()
    .domain([xMin, xMax])
    .range([margin + labelArea, width - margin]);
  var yScale = d3
    .scaleLinear()
    .domain([yMin, yMax])
    // Height is inversed due to how d3 calc's y-axis placement
    .range([height - margin - labelArea, margin]);


  var xAxis = d3.axisBottom(xScale);
  var yAxis = d3.axisLeft(yScale);

  // Determine x and y tick counts.
  // Note: Saved as a function for easy mobile updates.
  function tickCount() {
    if (width <= 500) {
      xAxis.ticks(5);
      yAxis.ticks(5);
    }
    else {
      xAxis.ticks(10);
      yAxis.ticks(10);
    }
  }
  tickCount();

  svg
    .append("g")
    .call(xAxis)
    .attr("class", "xAxis")
    .attr("transform", "translate(0," + (height - margin - labelArea) + ")");
  svg
    .append("g")
    .call(yAxis)
    .attr("class", "yAxis")
    .attr("transform", "translate(" + (margin + labelArea) + ", 0)");

  // grouping for circles
  var theCircles = svg.selectAll("g theCircles").data(theData).enter();

  // append circles
  theCircles
    .append("circle")
    
    .attr("cx", function(d) {
      return xScale(d[xValue]);
    })
    .attr("cy", function(d) {
      return yScale(d[yValue]);
    })
    .attr("r", d => getRadius(d[xValue]))
    .style("fill", d => getColor(d[xValue]))
    .style("opacity", ".65")
    .style("stroke", "black")

    .on("mouseover", function(d) {
      
      toolTip.show(d);
    })
    .on("mouseout", function(d) {
      
      toolTip.hide(d);

    });

  // Select all axis text and add this d3 click event.
  d3.selectAll(".aText").on("click", function() {
    // select clicked text
    var self = d3.select(this);

    if (self.classed("inactive")) {
      // Grab the name and axis saved in label.
      var axis = self.attr("data-axis");
      var name = self.attr("data-name");

      // When x is the saved axis:
      if (axis === "x") {
        
        xValue = name;

        // Change the min and max of the x-axis
        xMinMax();

        // Update the domain of x.
        xScale.domain([xMin, xMax]);

        // set transition to update axis
        svg.select(".xAxis").transition().duration(300).call(xAxis);

        // update circle locations
        d3.selectAll("circle").each(function() {
        
          d3
            .select(this)
            .transition()
            .attr("cx", function(d) {
              return xScale(d[xValue]);
            })
            .attr("r", d => getRadius(d[xValue]))
            .style("fill", d => getColor(d[xValue]))
            .style("opacity", ".65")
            .style("stroke", "black")
            .duration(300);
        });

        // We need change the location of the state texts, too.
        d3.selectAll(".stateText").each(function() {
          
          d3
            .select(this)
            .transition()
            .attr("dx", function(d) {
              return xScale(d[xValue]);
            })
            .duration(300);
        });

        labelChange(axis, self);
      }
      else {
        // When y is the saved axis:
        yValue = name;

        // Change the min and max of the y-axis.
        yMinMax();

        // Update the domain of y.
        yScale.domain([yMin, yMax]);

        // Update Y Axis
        svg.select(".yAxis").transition().duration(300).call(yAxis);

        // With the axis changed, let's update the location of the state circles.
        d3.selectAll("circle").each(function() {
          // circle transitions
          d3
            .select(this)
            .transition()
            .attr("cy", function(d) {
              return yScale(d[yValue]);
            })
            .attr("r", d => getRadius(d[xValue]))
            .style("fill", d => getColor(d[xValue]))
            .style("opacity", ".65")
            .style("stroke", "black")
            .duration(300);
        });

        // We need change the location of the state texts, too.
        d3.selectAll(".stateText").each(function() {
          // We give each state text the same motion tween as the matching circle.
          d3
            .select(this)
            .transition()
            .attr("dy", function(d) {
              return yScale(d[yValue]) + getRadius;
            })
            .duration(300);
        });

        // Finally, change the classes of the last active label and the clicked label.
        labelChange(axis, self);
      }
    }
  });

  // mobile resizing
  d3.select(window).on("resize", resize);

  function resize() {
    // Redefine the width, height and leftTextY (the three variables dependent on the width of the window).
    width = parseInt(d3.select(".chart").style("width"));
    height = width - width / 3.9;
    leftTextY = (height + labelArea) / 2 - labelArea;

    // Apply the width and height to the svg canvas.
    svg.attr("width", width).attr("height", height);

    // Change the xScale and yScale ranges
    xScale.range([margin + labelArea, width - margin]);
    yScale.range([height - margin - labelArea, margin]);

    // With the scales changes, update the axes (and the height of the x-axis)
    svg
      .select(".xAxis")
      .call(xAxis)
      .attr("transform", "translate(0," + (height - margin - labelArea) + ")");

    svg.select(".yAxis").call(yAxis);

    // Update the ticks on each axis.
    tickCount();

    // Update the labels.
    xTextRefresh();
    yTextRefresh();

    // Update the radius of each dot.
    getRadius();

    // change the location of circle styles
    d3
      .selectAll("circle")
      .attr("cy", function(d) {
        return yScale(d[yValue]);
      })
      .attr("cx", function(d) {
        return xScale(d[xValue]);
      })
      .attr("r", d => getRadius(d[xValue]))
      }

    // change the location of circle text
    d3
      .selectAll(".stateText")
      .attr("dy", function(d) {
        return yScale(d[yValue]) + getRadius;
      })
      .attr("dx", function(d) {
        return xScale(d[xValue]);
      })
      .attr("r", d => getRadius(d[xValue]))
  }