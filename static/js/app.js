
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
  
});
};

function buildGauge(sample){
  d3.json("/wfreq/" + sample).then(function(response){
    console.log(response);
    var WFREQ = response.WFREQ
    console.log(WFREQ)
    var level = WFREQ *20;



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

var trace3 = [{ type: 'scatter',
   x: [0], y:[0],
    marker: {size: 28, color:'850000'},
    showlegend: false,
    name: '# of washings',
    text: level,
    hoverinfo: 'text+name'},
  { values: [20, 20, 20, 20, 20, 100],
  rotation: 90,
  text: ['8-9', '6-7', '4-5',
            '2-3', '0-1'],
  textinfo: 'text',
  textposition:'inside',
  marker: {colors:['rgba(14, 127, 0, .5)', 'rgba(110, 154, 22, .5)',
                         'rgba(170, 202, 42, .5)', 'rgba(202, 209, 95, .5)',
                         'rgba(210, 206, 145, .5)',
                         'rgba(255, 255, 255, 0)']},
  labels: ['8-9', '6-7', '4-5',
  '2-3', '0-1', ''],
  hoverinfo: 'label',
  hole: .5,
  type: 'pie',
  showlegend: false
}];

var layout3 = {
  shapes:[{
      type: 'path',
      path: path,
      fillcolor: '850000',
      line: {
        color: '850000'
      }
    }],
  title: 'Belly Button Washing',
  height: 500,
  width: 500,
  xaxis: {zeroline:false, showticklabels:false,
             showgrid: false, range: [-1, 1]},
  yaxis: {zeroline:false, showticklabels:false,
             showgrid: false, range: [-1, 1]}
};

Plotly.newPlot('gauge', trace3, layout3);
  });
};

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
    buildGauge(firstSample);
  });
}

 function optionChanged(newSample) {
// //   // Fetch new data each time a new sample is selected
  buildCharts(newSample);
  buildMetadata(newSample);
  buildGauge(newSample);
}

// // // Initialize the dashboard
init();
