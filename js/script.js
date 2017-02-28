//var geocoder = require('geocoder');
// var geocoder = new google.maps.Geocoder();

var w = 750;
var h = 450;
var margin = {top: 20, right: 15, bottom: 30, left: 50};
    var width = w - margin.left - margin.right;
    var height = h - margin.top - margin.bottom;

var dataset; //the full dataset
var patt = new RegExp("all");

//variables for filtering
var phaseVars = ["grounded", "takeoff", "initial_climb", "en_route", "approach", "landing"];
var causeVars = ["human_error", "weather", "mechanical", "criminal", "unknown"]

d3.csv("data/updated_flight_data.csv", function(error, flights) {
//read in the data

  if (error) return console.warn(error);
     flights.forEach(function(d) {
        d.date = new Date(d.date);
        d.fat = +d.fat;
        d.px = +d.px;
        d.lat = +d.lat;
        d.lng = +d.lng;
  });


//dataset is the full dataset -- maintain a copy of this at all times
  dataset = flights;
  currentData = flights;

//all the data is now loaded, so draw the initial vis
  //drawBar(dataset);
  //drawMap(dataset);
  //drawVis(dataset);
// });

// var col = d3.scale.ordinal(d3.schemeCategory10);

//     var chart = d3.select("#chart")
//         .attr("width", width + margin.left + margin.right)
//         .attr("height", height + margin.top + margin.bottom)
//     .append("g")
//         .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

// //     var tooltip = d3.select("body").append("div")
// //         .attr("class", "tooltip")
// //         .style("opacity", 0);

//     var x = d3.scaleLinear()
//             .domain([0, 1000])
//             .range([0, width]);

//     var y = d3.scaleLinear()
//             .domain([0, 1000])
//             .range([height, 0]);

//     var xAxis = d3.axisBottom()
//         .ticks(6)
//         .scale(x);

//     chart.append("g")
//         .attr("class", "axis")
//         .attr("transform", "translate(0," + height + ")")
//         .call(xAxis)
//         .append("text")
//         .attr("x", w)
//         .attr("y", -6)
//         .style("text-anchor", "end")
//         .text("Phase/Cause");

//     var yAxis = d3.axisLeft()
//         .scale(y);

//     chart.append("g")
//     .attr("class", "axis")
//     .call(yAxis)
//         .append("text")
//         .attr("transform", "rotate(-90)")
//         .attr("y", 6)
//         .attr("dy", ".71em")
//         .style("text-anchor", "end")
//         .text("Number of Fatalities");

//     function drawVis(dataset) { //draw the circles initially and on each interaction with a control

//     var rect = chart.selectAll("rect")
//     .data(dataset);

//     rect
//         .attr("cx", function(d) { return x(d.phase);  })
//         .attr("cy", function(d) { return y(d.fat);  })
//         //.style("fill", function(d) { return col(d.plane_type); });

//     rect.exit().remove();

//     rect.enter().append("rect")
//         .attr("x", function(d) { return x(d.phase);  })
//         .attr("y", function(d) { return y(d.fat);  })
//         .attr("height", 0)
//         .style("stroke", "black");

//     }
// // var makeProjection = () => {
//     var width = 960,
//     height = 500;

//     var projection = d3.geoMercator() 
//         .scale(175)
//         .translate([width / 2, height / 2])
//         .precision(.1);

//     var path = d3.geoPath()
//         .projection(projection);

//     var graticule = d3.geoGraticule();

//     var svg = d3.select("body").append("svg")
//         .attr("width", width)
//         .attr("height", height);

//     svg.append("defs").append("path")
//         .datum({type: "Sphere"})
//         .attr("id", "sphere")
//         .attr("d", path);

//     svg.append("use")
//         .attr("class", "stroke")
//         .attr("xlink:href", "#sphere");

//     svg.append("use")
//         .attr("class", "fill")
//         .attr("xlink:href", "#sphere");

//     svg.append("path")
//         .datum(graticule)
//         .attr("class", "graticule")
//         .attr("d", path);

//     d3.json("/mbostock/raw/4090846/world-50m.json", function(error, world) {
//         if (error) throw error;

//         svg.insert("path", ".graticule")
//             .datum(topojson.feature(world, world.objects.land))
//             .attr("class", "land")
//             .attr("d", path);

//         svg.insert("path", ".graticule")
//             .datum(topojson.mesh(world, world.objects.countries, function(a, b) { return a !== b; }))
//             .attr("class", "boundary")
//             .attr("d", path);
//         });

//     d3.select(self.frameElement).style("height", height + "px");
// // }


// var color = d3.scaleQuantile()
//     .domain([0, 100, 200, 300, 400, 500, 600])
//     .range(["#eff3ff", "#c6dbef", "#9ecae1", "#6baed6", "#3182bd", "#08519c"]);

// var path = d3.geoPath();

// var svg = d3.select("body").append("svg")
//     .attr("width", width)
//     .attr("height", height);

// queue()
//     .defer(d3.json, "world-50.json")
//     .defer(d3.csv, "data/updated_flight_data.csv")
//     .await(ready);

// function ready(error, world, flights) {
//   if (error) throw error;

//   var fatByPhase = {};

//   flights.forEach(function(f) { fatByPhase[f.phase] = +f.fat; });

//   svg.append("g")
//       .attr("class", "countries")
//       .datum(topojson.feature(world, world.objects.countries))
//     .enter().append("path")
//       .attr("d", path)
//       .style("fill", function(d) { return color(fatByPhase[f.phase]); });

// //   svg.append("path")
// //       .datum(topojson.mesh(us, us.objects.states, function(a, b) { return a.id !== b.id; }))
// //       .attr("class", "states")
// //       .attr("d", path);

//     svg.selectAll(".symbol")
//         .data(flights.sort(function(a, b) { return b.fat }))
//         .attr("class", "symbol")
//         .attr("d", path.pointRadius(d => {radius(d.fat)} ))

// }

    var filteredPhase = [dataset.filter(f => f.phase ==="grounded"), dataset.filter(f => f.phase ==="takeoff"), dataset.filter(f => f.phase ==="initial_climb"), dataset.filter(f => f.phase ==="en_route"), dataset.filter(f => f.phase ==="approach"), dataset.filter(f => f.phase ==="landing")];
    
    var filteredPhases = phaseVars.map(p => dataset.filter(f => f.phase === p));
    var filteredCauses = causeVars.map(c => dataset.filter(f => f.meta === c));


    var crashes = [];
    filteredPhase.forEach(function(phase) {
        crashes.push(phase.length);
    });

    var fatalities = [];
    //for each flight phase array
    filteredPhases.forEach(function(phase) {
        //make a new array of just the fatalities
        result = phase.map(f => f.fat)
        var deaths = 0;
        //for each flight in the group
        for (var i = 0; i <result.length; i++) {
            //add it to the total 
            deaths += result[i]; 
        }
        //push it to the fatalities array
        fatalities.push(deaths);
    });

    var causeFatalities = [];
    filteredCauses.forEach(function(cause) {
        filtered = cause.map(f => f.fat)
        var deaths = 0;
        filtered.forEach(f => {deaths += f})
        causeFatalities.push(deaths);
    })

    // document.getElementById("type").onChange =
   // function() { filterType(this.value); }


function aggregateFilter(filteredData, filterOn) {
	//add code to filter to mytype and rerender vis here
    var totals = [];
 filteredData.forEach(function(element) {
        result = element.map(f => f[filterOn])
        var count = 0;
        for (var i = 0; i <result.length; i++) {
            count += result[i]; 
        }
        totals.push(count);
    });
    return totals;
};

var getData = function(data, category, callback) {
    callback(data, category);
}

//console.log(getData(filteredPhases, "phase", aggregateFilter))

function filterPhase(ftype) {
	//add code to filter to mytype and rerender vis here
    var filteredAll = new RegExp("all").test(ftype);
    if (filteredAll) {
        chart.data[0].x 
        Plotly.redraw(chart);
    } else {
        var filtered = currentData.filter( (f) => d.phase === ftype);
    }
   // Plotly.purge(chart);
    Plotly.redraw(chart);
}


var countries = dataset.map(f => f.country);
var places = dataset.map(f => f.loc);
var scale = 5;

var markerScale = dataset.map(f => (f.fat))
//console.log(markerScale)
var smalldata = dataset.slice(0, 6);


var xField = 'date';
var yField = 'fat';

var selectorOptions = {
    buttons: [{
        step: 'month',
        stepmode: 'backward',
        count: 1,
        label: '1m'
    }, {
        step: 'month',
        stepmode: 'backward',
        count: 6,
        label: '6m'
    }, {
        step: 'year',
        stepmode: 'todate',
        count: 1,
        label: 'YTD'
    }, {
        step: 'year',
        stepmode: 'backward',
        count: 1,
        label: '1y'
    }, {
        step: 'all',
    }],
};

Plotly.d3.csv('data/updated_flight_data.csv', function(err, rawData) {
    if(err) throw err;

    var data = prepData(rawData);
    var layout = {
        title: 'Time series with range slider and selectors',
        showlegend: false,
        // margin: {
        //      t: 100,
        //     // pad: 2
        // },
        font: {
            family: "Arial",
            size: 14
        },
        xaxis: {
            title: 'YEAR',
            titlefont: {
                family: 'Arial',
                size: 16,
                color: 'lightgrey'
            },
            rangeselector: selectorOptions,
            rangeslider: {}
        },
        yaxis: {
            //fixedrange: true,
            type: 'log',
            autorange: true,
            title: 'FATALITIES',
            titlefont: {
                family: 'Arial',
                size: 16,
                color: 'lightgrey'
            }
        }
    };
   // Plotly.deleteTraces('graph', 0);
    Plotly.plot('graph', data, layout, {displayModeBar: false});
});

function prepData(rawData) {
    var x = [];
    var y = [];

    rawData.forEach(function(datum, i) {

        x.push(datum[xField]);
        y.push(datum[yField]);
    });

    return [{
        mode: 'lines',
        x: x,
        y: y,
        line: 
            {color: "#642EC"
        }
    }];
}

(function() {

var latitudes = dataset.map(f => { if (f.lat) { return f.lat } else { return 0 } })
var longitudes = dataset.map(f => { if (f.lng) { return f.lng } else { return 0 } })

Plotly.d3.csv("/data/updated_flight_data.csv", function(err, flights) {
    if (err) return console.warn(err);
        function unpack(flights, key) {
            return flights.map(function(flight) { return flight[key]; })
        }
    var allData = flights;
    // var allFatalities = unpack(flights, 'fat');
    // var allDates = unpack(flights, 'date');
    var allPhases = unpack(flights, 'phase');
    var totalCount = allData.length;
    //var listofPhases = [];
    var currentData = [];
    var currentPhase;
    // var currentFatality = [];
    // var currentDate = [];

    //make an array of phase variables
    // for (var i = 0; i < allPhases.length; i++ ){
    //     if (listofPhases.indexOf(allPhases[i]) === -1 ){
    //     listofPhases.push(allPhases[i]);
    //     }
    // }

    function getPhaseData(chosenPhase) {
        // currentFatalities = [];
        // currentDate = [];
        currentData = [];
        for (var i = 0 ; i < allPhases.length ; i++){
            if ( allPhases[i] === chosenPhase ) {
                currentData.push(allData[i]);
            } else if (chosenPhase === "all" ) {
                currentData.push(allData[i]);
            }
        }
    };

    // Default Country Data
    setBubblePlot('all');
    
    function setBubblePlot(chosenPhase) {
        getPhaseData(chosenPhase); 

        var count = currentData.length
        $("#phase").html(chosenPhase.split('_').join(' '))
        $('#count').html(count);
        $('#totalCount').html(totalCount);
        $('#percentage').html(Math.round(count/totalCount * 100) + '%');
        var trace1 = {
            type: 'scattergeo',
            mode: 'markers',
            lon: currentData.map(f => f.lng),
            lat: currentData.map(f => f.lat),
            text: currentData.map(f => f.loc),
            marker: {
                size: markerScale,
                color: "#F74356",
                opacity: 0.6,
                cmin: d3.min(currentData.map(d=> d.fat)),
                cmax: d3.max(currentData.map(d => d.fat)),
                //autocolorscale: true,
                //colorscale: 'Greens',
                line: {
                    color: 'black',
                    width: 1
                },
                sizeref: 10,
                sizemin: 2
            },
            name: 'flight fatalities'
        };

    var data = [trace1];

    var layout = {
        title: 'Hover over a circle to view more information,<br>scroll to zoom in/out.',
        'geo': {
            'scope': 'world',
            'resolution': 100,
            projection: {
                type: "eckert 3"
            },
            showland: true,
            landcolor: '#E6E8F4',
            // showwater: true,
            // watercolor: '#E6E8F4',
            showsubunits: true,
            showcountries: true,
            subunitwidth: 1,
            countrywidth: .5,
            subunitcolor: 'rgb(255,255,255)',
            countrycolor: '#323545'
        },
        font: {
            family: "Arial",
            size: 14
        },
        autosize: false,
        // width: 900,
        // height: 600,
        margin: {
            l: 10,
            r: 10
            // b: 0,
            // t: 50,
            // pad: 1
        },
    };


    Plotly.newPlot('plotdiv', data, layout, {displayModeBar: false, scrollZoom: true});
};

var phaseSelector = $('#phase-filter')[0];

function updatePhase(){
    setBubblePlot(phaseSelector.value);
}

phaseSelector.addEventListener('change', (e) => { updatePhase(phaseSelector.value); });

});


var trace1 = {
    type: 'scattergeo',
    mode: 'markers',
    lat: latitudes,
    lon: longitudes,
    //hoverinfo: 'text',
    text: places,
    marker: {
        size: markerScale,
        color: "#F74356",
        opacity: 0.6,
        cmin: d3.min(dataset.map(d=> d.fat)),
        cmax: d3.max(dataset.map(d => d.fat)),
        //autocolorscale: true,
        //colorscale: 'Greens',
        line: {
            color: 'black',
            width: 1
        },
        sizeref: 10,
        sizemin: 2
    },
    name: 'flight fatalities'
};

var data = [trace1];

var layout = {
    title: 'Hover over a circle to view more information,<br>scroll to zoom in/out.',
    'geo': {
        'scope': 'world',
        'resolution': 100,
        projection: {
            type: "eckert 3"
        },
        showland: true,
        landcolor: '#E6E8F4',
        // showwater: true,
        // watercolor: '#E6E8F4',
        showsubunits: true,
        showcountries: true,
        subunitwidth: 1,
        countrywidth: .5,
        subunitcolor: 'rgb(255,255,255)',
        countrycolor: '#323545'
    },
    font: {
        family: "Arial",
        size: 14
    },
    autosize: false,
    // width: 900,
    // height: 600,
    margin: {
        l: 10,
        r: 10
        // b: 0,
        // t: 50,
        // pad: 1
    },
};

 var projection = Plotly.newPlot("projection", data, layout, {displayModeBar: false, scrollZoom: true});

})();

var flightInfo = $('#flight-info')
flightInfo.css('display', 'none');

projection.on('plotly_hover', function(data){
    var pn="";
    var tn="";
    data.points.forEach((point, index) => {
        pn = point.pointNumber;
        var flight = dataset[pn];
        //tn = point.curveNumber;
        $('#ref-id').html(dataset[pn].ref);
        $('#fatalities').html(dataset[pn].fat);
    $('#date').html((flight.date.getMonth() + 1) + "-" + (flight.date.getDate() + 1) + "-" + flight.date.getFullYear());
        $('#aircraft').html(dataset[pn].plane_type);
        $('#location').html(dataset[pn].country);
        $('#airline').html(dataset[pn].airline);
        if (dataset[pn].meta.toLowerCase() != "unknown") {
            $('#meta').html((dataset[pn].meta.split('_').join(' ')) + " - ");
            $('#cause').html(dataset[pn].cause);
        } else {
            $('#meta').html("Unknown");
        }
        $('#certainty').html(dataset[pn].cert);
        if (dataset[pn].notes) {
            $('#story-label').html("STORY");
            $('#story').html( dataset[pn].notes ? dataset[pn].notes : "");
        }
    })
    flightInfo.css('display', 'inline-block');
});

//     (function() {
//     var d3 = Plotly.d3;

//     var WIDTH_IN_PERCENT_OF_PARENT = 100;
//     var HEIGHT_IN_PERCENT_OF_PARENT = 90;

//     var gd3 = d3.select('#chart')
//         .style({
//             width: WIDTH_IN_PERCENT_OF_PARENT + '%',
//             'margin-left': (100 - WIDTH_IN_PERCENT_OF_PARENT) / 2 + '%',

//             height: HEIGHT_IN_PERCENT_OF_PARENT + 'vh',
//             'margin-top': (100 - HEIGHT_IN_PERCENT_OF_PARENT) / 2 + 'vh'
//         });

//     var chart = gd3.node();

// var phaseNames = ["Grounded", "Takeoff", "Initial climb", "En route", "Approach", "Landing", "Unknown"];

// var radioButtons = $("#controls input:radio");
//     this.action = radioButtons.val(); //current (initial) selection    
//     radioButtons.change((e) => { this.action = $(e.target).val();  console.log(this.action); }); //update action

//     radioButtons.change(function() {
//         this.action = radioButtons.val();
//             var data_index;
//             if (this.action === "phase") {
//                 data_index = 0;
//             } else {
//                 data_index = 1;
//             }
//             var chartDiv = document.getElementById("chart"),
//             visible = chartDiv.data[data_index].visible;
//     console.log(chartDiv.data[data_index])
//         if( visible === undefined ) visible = true;
    
//         Plotly.restyle("chart", {'visible': !visible}, data_index);
//         console.log(chartDiv.data[data_index])
//     })

//     var phase = {
//         x: ["Grounded", "Takeoff", "Initial climb", "En route", "Approach", "Landing"],
//         y: fatalities,
//         name: "Flight Phases",
//         marker: {
//             color: ['rgb(228,26,28)', 'rgb(55,126,184)', 'rgb(77,175,74)', 'rgb(152,78,163)', 'rgb(255,127,0)', 'rgb(255,255,51)']
//         },
//         visible: true,
//         showlegend: false,
//         legendgroup: "phase",
//         type: 'bar'
//     }
    
//     var cause = {
//         x: ["Human Error", "Weather", "Mechanical", "Criminal", "Unknown"],
//         y: causeFatalities,
//         name: "Crash Causes",
//         marker: {
//             color: ['rgb(127,201,127)', 'rgb(190,174,212)', 'rgb(253,192,134)', 'rgb(255,255,153)', 'rgb(141,211,199)']
//         },
//         visible: true,
//         showlegend: false,
//         legendgroup: "cause",
//         type: 'bar'
//     }

//     var data = [phase, cause];

//     var layout = {
//         title: 'Plane Crash Phases and Fatalities',
//         showlegend: false,
//         xaxis: {title: ''},
//         yaxis: {title: 'Total Fatalities', type: ''},
//         font: {
//             family: "Arial",
//             size: 14
//         }
//     }
    
//     Plotly.plot(chart, data, layout, {displayModeBar: false});

//     window.onresize = function() {
//         Plotly.Plots.resize(chart);
//     };

//     })();


});
// var geocoder = new google.maps.Geocoder();
// var latitudes = [];
// var longitudes = [];
// var locationNames = [];
// function getAddress(address, fn){
//     geocoder.geocode( { 'address': address.loc}, function(results, status) {
        
//         console.log(address.loc)
//         //if (result != undefined) {
//         if (status === 'OK') {
//             var location = results[0].geometry.location; 
//             address.latlng = [location.lat(), location.lng()];
//         // console.log(JSON.stringify(location))
//             latitudes = latitudes.concat([location.lat()])
//             longitudes = longitudes.concat([location.lng()])
//             console.log("Latitudes: "+latitudes.length + JSON.stringify(latitudes))
//             console.log("Longitudes: " + longitudes.length + JSON.stringify(longitudes))
//         } else if (status === "ZERO_RESULTS") {
//             latitudes = latitudes.concat(["ERROR"])
//             longitudes = longitudes.concat(["ERROR"])
//             console.log("Latitudes: "+latitudes.length + JSON.stringify(latitudes))
//             console.log("Longitudes: " + longitudes.length + JSON.stringify(longitudes))
//         }
//     });
    
// }

// var setLocation = function(results) {
//     return [results.lat(), results.lng()];
// }

//79 was lagos, need to do 80-90, starting at alotau
// for (var i=80; i <90; i++) {
//     getAddress(flights[i], setLocation);
//     console.log(flights[i]);
//     console.log(flights[i].loc);
// };

//console.log(getAddress("paris france"))

// getAddress("address", function(location){
//   console.log(location.lng());
//   return location.lng(); // this is where you get the return value
 //});