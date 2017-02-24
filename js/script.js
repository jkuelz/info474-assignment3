//var geocoder = require('geocoder');
// var geocoder = new google.maps.Geocoder();

var w = 750;
var h = 450;
var margin = {top: 20, right: 15, bottom: 30, left: 50};
    var width = w - margin.left - margin.right;
    var height = h - margin.top - margin.bottom;

var svg = d3.select("svg")

var dataset; //the full dataset
var patt = new RegExp("all");

d3.csv("data/flights2.csv", function(error, flights) {
//read in the data
var geocoder = new google.maps.Geocoder();

function getAddress(address, fn){
    geocoder.geocode( { 'address': address.loc}, function(results, status) {
        
        //if (result != undefined) {
        if (status === 'OK' && result !== undefined) {
            console.log(results.loc);
        var location = results[0].geometry.location; 
        address.latlng = [location.lat(), location.lng()];
        }
    });
}
var setLocation = function(results) {
    return [results.lat(), results.lng()];
}
//console.log(getAddress("paris france"))

// getAddress("address", function(location){
//   console.log(location.lng());
//   return location.lng(); // this is where you get the return value
// });

  if (error) return console.warn(error);
     flights.forEach(function(d) {
        d.date = new Date(d.date);
        d.fat = +d.fat;
        d.px = +d.px;
        //d.lat = getGeocodes(d.loc, function(location){location[0]});
        d.latlng = getAddress(d, setLocation);
        //console.log(d.latlng);
        // d.lat = new google.maps.Geocoder().geocode({'address': d.loc}, function(results, status) {
        //     //if (status === 'OK') {
        //    // console.log(results[0]);
        //     return results[0].geometry.location.lat()}
        // );
  });


//dataset is the full dataset -- maintain a copy of this at all times
  dataset = flights;

//all the data is now loaded, so draw the initial vis
  //drawBar(dataset);
  //drawMap(dataset);

  console.log(dataset);
//   var dates = dataset.map(flight => flight.date);
//   console.log(dates[0]);

//   TESTER = document.getElementById('tester');

//     Plotly.plot( TESTER, [{
//         x: ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"],
//         y: dates }], { 
//         margin: { t: 0 } } );
var phases = ["grounded", "takeoff", "initial_climb", "en_route", "approach", "landing", "unknown"];

    var filteredPhase = [dataset.filter(f => f.phase ==="grounded"), dataset.filter(f => f.phase ==="takeoff"), dataset.filter(f => f.phase ==="initial_climb"), dataset.filter(f => f.phase ==="en_route"), dataset.filter(f => f.phase ==="approach"), dataset.filter(f => f.phase ==="landing"), dataset.filter(f => f.phase ==="unknown")];
    //console.log(filteredPhase);
    
    var crashes = [];
    filteredPhase.forEach(function(phase) {
        crashes.push(phase.length);
    });
    var fatalities = [];
    filteredPhase.forEach(function(phase) {
        result = phase.map(f => f.fat)
        var deaths = 0;
        for (var i = 0; i <result.length; i++) {
            deaths += result[i]; 
        }
        fatalities.push(deaths);
    });

    function filterPhase(mytype) {
        var filterData = new RegExp("all").test(mytype);
	//add code to filter to mytype and rerender vis here
        var res = patt.test(mytype);
        if (res) {
           // drawVis(dataset);
        } else {
            var newdata = dataset.filter(function(d) {
            return d.phase == mytype;
            });
          //  drawVis(newdata);
        }

    }
    // console.log(fatalities);
    // console.log(crashes);
    // function assemble(combiner, crash) {
    //     combiner.fatalities[crash.phase] = crash.fat;
    //     return combiner
    // }
    // var dead = filteredPhase.reduce(assemble, {
    //     fatalities: {}
    // })
  

var countries = dataset.map(f => f.country);
var places = dataset.map(f => f.loc);
var smalldata = dataset.slice(0, 6);
//console.log(dataset);
var geocoder = new google.maps.Geocoder();

//for (var i = 0; i < places.length; i++) {
    // geocoder.geocode(places[0], function ( err, data ) {
    //     location= results[0].geometry.location;
    //     latitude = results[0].geometry.location.latitude;
    //     longitude = results[0].geometry.location.longitude;
    //     console.log(location);
    // });
//}

  
    // var geocoder = new google.maps.Geocoder();
    // //function geocodeAddress(geocoder, resultsMap) {
       
        
        var address = places[0];
        // console.log(places);
//for (var i = 0; i < dataset; i++) {
// dataset.forEach(function(element) {
    // var address = element.loc;
    // var refID = element.ref;
    // console.log(refID);
// }, getGeocode(address, refID));
let longitudes = [];
let latitudes = [];

function getLocation(element) {
   var element = this.element
    return element.loc;
}

// var latlng = [];
var coordinates = [];
// geocodes = dataset.map(function(flight) {

function getGeocodes(flight, fn) {
   geocoder.geocode({'address': flight.loc}, function(results, status) {
        if (status === 'OK') {

        var latitude = results[0].geometry.location.lat();
        var longitude = results[0].geometry.location.lng();
        // console.log(latitude);
        // console.log(longitude);
        // console.log(results[0]);
        //var thisFlight = dataset.filterData("ref", refID);
        // flight.lat = latitude;
        // flight.lng = longitude;
        // latitudes.push(latitude);
        // longitudes.push(longitude);
        var latlng = [];
        latlng.push(latitude);
        latlng.push(longitude);
        fn(latlng);
        console.log(flight.ref+": "+latlng);
        // coordinates.concat(latlng);
        return latlng;
        //console.log(smalldata[0]);
        // resultsMap.setCenter(results[0].geometry.location);
        // var marker = new fmaps.Marker({
        //   map: resultsMap,
        //   position: results[0].geometry.location
        // });
        } else {
            alert('Geocode was not successful for the following reason: ' + status);
        }
    });
}
//, element);
// console.log(getGeocodes(dataset[0]))
// for (flight in dataset) {
//     getGeocodes(flight, function(location){
//         coordinates.concat(location);
//     });
// }
// var locations = dataset.map(getGeocodes);
// console.log(locations);
// console.log(coordinates)

function updateData(flight, data) {
    return function() {
        dataset.flight.latlng = data;
    }
}
// var newLongitudes = longitudes.reduce(function(newArray, longitude){
//     newArray.push(number);
//     return newArray;
// }, []);

// var longitudes = smalldata.map(d => d.lng);
// var latitudes = smalldata.map(d => d.lat);
// console.log(smalldata);
// console.log(longitudes[0]);
console.log(dataset.map(d => {
    if (d.latlng[0] =undefined) {
        return 0;
    } else if (d.latlng[0] =null) {
        return 0;
    } else {
        return d.latlng[0];
    }
}));

var trace1 = {
    type: 'scattergeo',
    mode: 'markers',
    //locations: ['FRA', 'DEU', 'RUS', 'ESP'],
    lon: [dataset.map(d => d.latlng[0])],
    lat: [dataset.map(d => d.latlng[1])],
    text: [places],
    marker: {
    
        size: [fatalities],
            color: [10, 20, 40, 50],
            cmin: 0,
            cmax: 450,
            colorscale: 'Greens',
            colorbar: {
                title: 'Number of Fatalities',
                //ticksuffix: '%',
                //showticksuffix: 'last'
            },
            line: {
                color: 'black'
            }
        },
    name: 'europe data'
};

var data = [trace1];

var layout = {
    'geo': {
        'scope': 'world',
        'resolution': 50
    }
};

Plotly.newPlot('map', data, layout, {displayModeBar: false});

function filterData(type, result) {
	//add code to filter to mytype and rerender vis here
//   var res = patt.test(filterOn);
//   if (res) {
//     drawVis(dataset);
//   } else {
    var newdata = dataset.filter(function(d) {
      return d[type] == result;
     })
    // drawVis(newdata);
 // }
};

    (function() {
    var d3 = Plotly.d3;

    var WIDTH_IN_PERCENT_OF_PARENT = 100;
    var HEIGHT_IN_PERCENT_OF_PARENT = 90;

    var gd3 = d3.select('#chart')
        .append('div')
        .style({
            width: WIDTH_IN_PERCENT_OF_PARENT + '%',
            'margin-left': (100 - WIDTH_IN_PERCENT_OF_PARENT) / 2 + '%',

            height: HEIGHT_IN_PERCENT_OF_PARENT + 'vh',
            'margin-top': (100 - HEIGHT_IN_PERCENT_OF_PARENT) / 2 + 'vh'
        });

    var gd = gd3.node();

var phases = ["Grounded", "Takeoff", "Initial climb", "En route", "Approach", "Landing", "Unknown"];
console.log(filterPhase("Grounded"))

    var phase = {
        x: ["Grounded", "Takeoff", "Initial climb", "En route", "Approach", "Landing", "Unknown"],
        y: fatalities,
        // mode: 'markers',
        // marker: {
        //    // size: [filteredPhase.map(f => f.fatalities)],
        //    sizemode: "area",
        //    size: crashes,
        //    sizeref: .1
        //}
        type: 'bar'
    }
    
    // var cause = {
    //     x: ["Human Error", "Weather", "Mechanical", "Criminal", "Unknown"],
    //     y: 
    // }

    var data = [phase];

    var layout = {
        title: 'Plane Crash Phases and Fatalities',
        xaxis: {title: ''},
        yaxis: {title: 'Total Fatalities', type: ''},
        font: {
            size: 16
        }
    }
    
    Plotly.plot(gd, data, layout, {displayModeBar: false});

    window.onresize = function() {
        Plotly.Plots.resize(gd);
    };

    })();

});
//var dates = dataset.map(flight => flight.date);
//console.log(dates);

// var col = d3.scale.ordinal(d3.schemeCategory10);

//     var svg = d3.select("body").append("svg")
//         .attr("width", w + margin.left + margin.right)
//         .attr("height", h + margin.top + margin.bottom)
//     .append("g")
//         .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

//     var chart = d3.select(".chart")
//         .attr("width", w + margin.left + margin.right)
//         .attr("height", h + margin.top + margin.bottom+15)
//         .append("g")
//         .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

//     var tooltip = d3.select("body").append("div")
//         .attr("class", "tooltip")
//         .style("opacity", 0);

//     var x = d3.scale.linear()
//             .domain([0, 1000])
//             .range([0, w]);

//     var y = d3.scale.linear()
//             .domain([0, 1000])
//             .range([h, 0]);

//     // var xAxis = d3.axis.bottom()
//     //     .ticks(4)
//     //     .scale(x);

//     chart.append("g")
//         .attr("class", "axis")
//         .attr("transform", "translate(0," + h + ")")
//         .call(xAxis)
//         .append("text")
//         .attr("x", w)
//         .attr("y", -6)
//         .style("text-anchor", "end")
//         .text("Price");

//     var yAxis = d3.axis.left()
//         .scale(y);

//     chart.append("g")
//     .attr("class", "axis")
//     .call(yAxis)
//         .append("text")
//         .attr("transform", "rotate(-90)")
//         .attr("y", 6)
//         .attr("dy", ".71em")
//         .style("text-anchor", "end")
//         .text("True Value");

//     function drawVis(dataset) { //draw the circiles initially and on each interaction with a control

//     var circle = chart.selectAll("circle")
//     .data(dataset);

//     circle
//         .attr("cx", function(d) { return x(d.price);  })
//         .attr("cy", function(d) { return y(d.tValue);  })
//         .style("fill", function(d) { return col(d.plane_type); });

//     circle.exit().remove();

//     circle.enter().append("circle")
//         .attr("cx", function(d) { return x(d.price);  })
//         .attr("cy", function(d) { return y(d.tValue);  })
//         .attr("r", 4)
//         .style("stroke", "black");

//     };

// var x = d3.time.scale()
//     .domain([new Date(2012, 0, 1), new Date(2012, 11, 31)])
//     .range([0, width]);

// var xAxis = d3.svg.axis()
//     .scale(x)
//     .orient("bottom")
//     .ticks(d3.time.months)
//     .tickSize(16, 0)
//     .tickFormat(d3.time.format("%B"));

// var svg = d3.select("body").append("svg")
//     .attr("width", w)
//     .attr("height", h)
//   .append("g")
//     .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

// svg.append("g")
//     .attr("class", "x axis")
//     .attr("transform", "translate(0," + height + ")")
//     .call(xAxis)
//   .selectAll(".tick text")
//     .style("text-anchor", "start")
//     .attr("x", 6)
//     .attr("y", 6);

