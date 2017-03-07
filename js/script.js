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


var countries = dataset.map(f => f.country);
var places = dataset.map(f => f.loc);
var scale = 5;

var markerScale = dataset.map(f => (f.fat))
//console.log(markerScale)
var smalldata = dataset.slice(0, 6);


var xField = 'date';
var yField = 'fat';

var selectorOptions = {
   // y: 0,
    buttons: [{
        step: 'year',
        stepmode: 'backward',
        count: 15,
        label: '15y'
    }, {
        step: 'year',
        stepmode: 'backward',
        count: 10,
        label: '10y'
    }, {
        step: 'year',
        stepmode: 'backward',
        count: 5,
        label: '5y'
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
    //console.log(d3.max(data.map(year => year.y)));
    var layout = {
        title: 'Scroll to zoom, use the slider to select a range,<br>or use the buttons to step backward. <br>',
        // height: 700,
        // width: 700,
        showlegend: false,
        // margin: {
        //      t: 100,
        //     pad: 2
        // },
        font: {
            family: "Helvetica",
            size: 12
        },
        xaxis: {
            title: 'YEAR',
            type: 'date',
            titlefont: {
                family: 'Helvetica',
                size: 14,
                color: 'grey'
            },
            rangeselector: selectorOptions,
            rangeslider: {
                bgcolor: "#FFFFFF",
                activecolor: "#BAE1F2",
                thickness: .25,
                //range: [0, ]
                //visible: false
            }
        },
        yaxis: {
            //fixedrange: true,
            //type: 'log',
            //autorange: true,
            //range: [0, d3.max(data.map(year => year.y))],
            //autotick: false,
            ticks: 'outside',
            tick0: 0,
            dtick: 200,
            //ticklen: 400,
            title: 'FATALITIES',
            titlefont: {
                family: 'Helvetica',
                size: 14,
                color: 'grey'
            }
        }
    };
    Plotly.plot('graph', data, layout, {displayModeBar: false, scrollZoom: true});
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

Plotly.d3.csv("data/updated_flight_data.csv", function(err, flights) {
    if (err) return console.warn(err);
        function unpack(flights, key) {
            return flights.map(function(flight) { return flight[key]; })
        }
    var allData = flights;
    var totalCount = allData.length;
    var currentData = [];
    //var currentPhase;

    //make an array of phase variables
    // for (var i = 0; i < allPhases.length; i++ ){
    //     if (listofPhases.indexOf(allPhases[i]) === -1 ){
    //     listofPhases.push(allPhases[i]);
    //     }
    // }

    function getPhaseData(chosenPhase) {
        currentData = [];
        for (var i = 0 ; i < allData.length ; i++){
            if ( allData[i].phase === chosenPhase || allData[i].meta === chosenPhase) {
                currentData.push(allData[i]);
            } else if (chosenPhase === "all" ) {
                currentData.push(allData[i]);
            }
        }
    };
    //console.log(currentData)

    // Default Country Data
    setBubblePlot('all');
    console.log(currentData)

    // var flightInfo = $('#flight-info')
    // flightInfo.css('display', 'none');

    // $('#plotdiv').on('plotly_hover', function(data){
    //     console.log("hovering")
    //     console.log(data)
    //     //console.log(currentData)
    //     var pn="";
    //     var tn="";
    //     data.points.forEach((point, index) => {
    //         pn = point.pointNumber;
    //         var flight = dataset[pn];
    //         console.log(flight,pn)
    //         //tn = point.curveNumber;
    //         $('#ref-id').html(dataset[pn].ref);
    //         $('#fatalities').html(dataset[pn].fat);
    //     $('#date').html((flight.date.getMonth() + 1) + "-" + (flight.date.getDate() + 1) + "-" + flight.date.getFullYear());
    //         $('#aircraft').html(dataset[pn].plane_type);
    //         $('#location').html(dataset[pn].country);
    //         $('#airline').html(dataset[pn].airline);
    //         if (dataset[pn].meta.toLowerCase() != "unknown") {
    //             $('#meta').html((dataset[pn].meta.split('_').join(' ')) + " - ");
    //             $('#cause').html(dataset[pn].cause);
    //         } else {
    //             $('#meta').html("Unknown");
    //         }
    //         $('#certainty').html(dataset[pn].cert);
    //         if (dataset[pn].notes) {
    //             $('#story-label').html("STORY");
    //             $('#story').html( dataset[pn].notes ? dataset[pn].notes : "");
    //         }
    //     })
    //     flightInfo.css('display', 'inline-block');
    // });
    
    function setBubblePlot(chosenPhase) {
        getPhaseData(chosenPhase); 
    
        // console.log(currentData)
        // handleHover();

        var count = currentData.length
        //$("#phase").html(chosenPhase.split('_').join(' '))
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
                size: currentData.map(f => f.fat),
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
            // height: 400,
            width: 600,
            'geo': {
                'scope': 'world',
                'resolution': 100,
                projection: {
                    type: "eckert 3"
                },
                showland: true,
                landcolor: '#E6E8F4',
                showsubunits: true,
                showcountries: true,
                subunitwidth: 1,
                countrywidth: .5,
                subunitcolor: 'rgb(255,255,255)',
                countrycolor: '#323545'
            },
            font: {
                family: "Helvetica",
                size: 12
            },
            autosize: false,
            // width: 900,
            // height: 600,
            margin: {
                l: 5,
                r: 5
                // b: 0,
                // t: 50,
                // pad: 1
            },
            // pad: {
            //     l: 0,
            //     r: 5
            // }
        };
        Plotly.newPlot('plotdiv', data, layout, {displayModeBar: false, scrollZoom: true});

          
        var flightInfo = $('#flight-info')
        flightInfo.css('display', 'none');
        console.log(currentData)

        $('#plotdiv')[0].on('plotly_hover', function(data) {
            console.log(data)
            var pn="";
            var tn="";
            data.points.forEach((point, index) => {
                pn = point.pointNumber;
                var flight = currentData[pn];
                console.log(flight)

                //tn = point.curveNumber;
                $('#ref-id').html(flight.ref);
                $('#fatalities').html(flight.fat);
            // $('#date').html((flight.date.getMonth() + 1) + "-" + (flight.date.getDate() + 1) + "-" + flight.date.getFullYear());
                $('#date').html(flight.date);
                $('#aircraft').html(flight.plane_type);
                $('#location').html(flight.country);
                $('#airline').html(flight.airline);
                if (flight.meta.toLowerCase() != "unknown") {
                    $('#meta').html((flight.meta.split('_').join(' ')));
                    $('#cause').html("- " + flight.cause);
                } else {
                    $('#meta').html("Unknown");
                }
                $('#certainty').html(flight.cert);
                if (flight.notes) {
                    $('#story-label').html("STORY");
                    $('#story').html( flight.notes ? flight.notes : "");
                }
            })
            flightInfo.css('display', 'inline-block');
        });

         
        
    };
        
        
          
       

    var phaseSelector = $('#phase-filter')[0];
    // function updatePhase(){
    //     setBubblePlot(phaseSelector.value);
    // }
    phaseSelector.addEventListener('change', (e) => { setBubblePlot(phaseSelector.value); });

});


// var trace1 = {
//     type: 'scattergeo',
//     mode: 'markers',
//     lat: latitudes,
//     lon: longitudes,
//     //hoverinfo: 'text',
//     text: places,
//     marker: {
//         size: markerScale,
//         color: "#F74356",
//         opacity: 0.6,
//         cmin: d3.min(dataset.map(d=> d.fat)),
//         cmax: d3.max(dataset.map(d => d.fat)),
//         //autocolorscale: true,
//         //colorscale: 'Greens',
//         line: {
//             color: 'black',
//             width: 1
//         },
//         sizeref: 10,
//         sizemin: 2
//     },
//     name: 'flight fatalities'
// };

// var data = [trace1];

// var layout = {
//     title: 'Hover over a circle to view more information,<br>scroll to zoom in/out.',
//     'geo': {
//         'scope': 'world',
//         'resolution': 100,
//         projection: {
//             type: "eckert 3"
//         },
//         showland: true,
//         landcolor: '#E6E8F4',
//         // showwater: true,
//         // watercolor: '#E6E8F4',
//         showsubunits: true,
//         showcountries: true,
//         subunitwidth: 1,
//         countrywidth: .5,
//         subunitcolor: 'rgb(255,255,255)',
//         countrycolor: '#323545'
//     },
//     font: {
//         family: "Arial",
//         size: 14
//     },
//     autosize: false,
//     // width: 900,
//     // height: 600,
//     margin: {
//         l: 10,
//         r: 10
//         // b: 0,
//         // t: 50,
//         // pad: 1
//     },
// };

//  var projection = Plotly.newPlot("projection", data, layout, {displayModeBar: false, scrollZoom: true});

})();





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

// var radioButtons = $("#controls input:radio")[0];
//     this.action = radioButtons.value; //current (initial) selection    
//     // radioButtons.change((e) => { this.action = $(e.target).val();  console.log(this.action); }); //update action
//      radioButtons.addEventListener('change', (e) => { updateBar(radioButtons.value); console.log(this.action); });
//     // function updatePhase(){
//     //     setBubblePlot(phaseSelector.value);
//     // }
    

//     //radioButtons.change(function() {
//     function updateBar(selected) {
//         //this.action = radioButtons.val();
//         this.action = selected;
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
//     // })
//     }

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