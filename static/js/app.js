
function buildMetadata(sample) {

  // @TODO: Complete the following function that builds the metadata panel

  // Use `d3.json` to fetch the metadata for a sample
 
  d3.json("/metadata/" + sample).then(function(response){
    console.log(response);
    selection = d3.select("#sample-card").select("#sample-metadata")
    console.log(selection)
    selection.html("");
    var table = selection.append("table")
    .append("tbody")

    Object.entries(response).forEach(([key, value]) => {
      var row = table.append("tr")
      row.append("td").text(key, ": ");
      row.append("td").text(value)
      
    });
    
  }); 

    // Use d3 to select the panel with id of `#sample-metadata`

    
    // Use `.html("") to clear any existing metadata
    
    // Use `Object.entries` to add each key and value pair to the panel

    
    // Hint: Inside the loop, you will need to use d3 to append new
    // tags for each key-value in the metadata.

    // BONUS: Build the Gauge Chart
    // buildGauge(data.WFREQ);
}
function buildCharts(sample) {

//   // @TODO: Use `d3.json` to fetch the sample data for the plots
    d3.json("/samples/" + sample).then(function(response){
  console.log(response);
 
  var otuId = response.otu_ids;
  var sliceotuId = otuId.slice(0, 10);
  var sampleValue = response.sample_values;
  var slicesampleValue = sampleValue.slice(0,10);
  var otuLabels = response.otu_labels;
  var sliceotuLabels = otuLabels.slice(0,10);
      var trace1 = {
        labels : sliceotuId,
        values : slicesampleValue,
        hovertext : sliceotuLabels,
        type : "pie"
        
      }
   
   var layout = {
    height: 400,
    width: 400
  
  };
  var trace2 = {
    x : otuId,
    y : sampleValue,
    mode : 'markers',
    marker: {
      color : otuId,
      size: sampleValue
    },
    hovertext : otuLabels
  };
  var layout2 = {
    showlegend : false,
    tickvalue : otuId,
    
  }
  Plotly.newPlot("pie", [trace1], layout);
  Plotly.newPlot("bubble", [trace2], layout2)
  
})

// Enter a speed between 0 and 180
var level = 10;

// Trig to calc meter point
var degrees = 180 - level,
     radius = .5;
var radians = degrees * Math.PI / 180;
var x = radius * Math.cos(radians);
var y = radius * Math.sin(radians);

// Path: may have to change to create a better triangle
var mainPath = 'M -.0 -0.025 L .0 0.025 L ',
     pathX = String(x),
     space = ' ',
     pathY = String(y),
     pathEnd = ' Z';
var path = mainPath.concat(pathX,space,pathY,pathEnd);

var data = [{ type: 'scatter',
   x: [0], y:[0],
    marker: {size: 28, color:'850000'},
    showlegend: false,
    name: 'speed',
    text: level,
    hoverinfo: 'text+name'},
  { values: [50/6, 50/6, 50/6, 50/6, 50/6, 50/6, 50],
  rotation: 90,
  text: ['TOO FAST!', 'Pretty Fast', 'Fast', 'Average',
            'Slow', 'Super Slow', ''],
  textinfo: 'text',
  textposition:'inside',
  marker: {colors:['rgba(14, 127, 0, .5)', 'rgba(110, 154, 22, .5)',
                         'rgba(170, 202, 42, .5)', 'rgba(202, 209, 95, .5)',
                         'rgba(210, 206, 145, .5)', 'rgba(232, 226, 202, .5)',
                         'rgba(255, 255, 255, 0)']},
  labels: ['151-180', '121-150', '91-120', '61-90', '31-60', '0-30', ''],
  hoverinfo: 'label',
  hole: .5,
  type: 'pie',
  showlegend: false
}];

var layout = {
  shapes:[{
      type: 'path',
      path: path,
      fillcolor: '850000',
      line: {
        color: '850000'
      }
    }],
  title: 'Gauge',
  height: 1000,
  width: 1000,
  xaxis: {zeroline:false, showticklabels:false,
             showgrid: false, range: [-1, 1]},
  yaxis: {zeroline:false, showticklabels:false,
             showgrid: false, range: [-1, 1]}
};

Plotly.newPlot('guage', data, layout);
}

function init() {
//   // Grab a reference to the dropdown select element
   var selector = d3.select("#selDataset");

// //   // Use the list of sample names to populate the select options
   d3.json("/names").then((sampleNames) => {
     sampleNames.forEach((sample) => {
       selector
        .append("option")
        .text(sample)
        .property("value", sample);
    });

// //     // Use the first sample from the list to build the initial plots
    const firstSample = sampleNames[0];
    buildCharts(firstSample);
    buildMetadata(firstSample);
  });
}

 function optionChanged(newSample) {
// //   // Fetch new data each time a new sample is selected
  buildCharts(newSample);
  buildMetadata(newSample);
}

// // // Initialize the dashboard
init();
