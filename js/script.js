
//variables for filtering
var phaseVars = ["all", "grounded", "takeoff", "initial_climb", "en_route", "approach", "landing"];
var causeVars = ["human_error", "weather", "mechanical", "criminal", "unknown"]
var filterVars = phaseVars.concat(causeVars);

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

//step buttons on scatterplot
var selectorOptions = {
    buttons: [{
        step: 'year',
        stepmode: 'backward',
        count: 20,
        label: '20y'
    }, {
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
    },  {
        step: 'all',
    }],
};

Plotly.d3.csv("data/updated_flight_data.csv", function(err, flights) {
    if (err) return console.warn(err);
        function unpack(flights, key) {
            return flights.map(function(flight) { return flight[key]; })
        }
    var allData = flights;
    var currentData = [];
    var traceCount = -2;
    var color;    

    // Update current data
    function getPhaseData(chosenPhase) {
        currentData = [];
        traceCount++;
        for (var i = 0 ; i < allData.length ; i++){
           if ( allData[i].phase === chosenPhase || allData[i].meta === chosenPhase) {
                currentData.push(allData[i]);
            } else if (chosenPhase === "all" ) {
                currentData.push(allData[i]);
            }
        }
    };

    // default map data
    setBubblePlot('all');

    // default scatterplot data
    causeVars.map( cause => setScatterPlot(currentData.filter(d => d.meta === cause)));
    
    // Updates the map view
    function setBubblePlot(chosenPhase) {
        getPhaseData(chosenPhase); 

        var allColors = ['#666666','#543005','#8c510a','#dfc27d','#98e0d5','#39a39a','#003c30','#984ea3',"#386cb0",'#4daf4a','#e41a1c','#ff7f00']
        
        //set the colors to the variables
        for (var i = 0; i < filterVars.length; i++) {
            if (chosenPhase === filterVars[i]) {
                color = allColors[i];
            }
        }

        // converts current data variables to html to display in summary text
        var count = currentData.length;
        var totalCount = allData.length;
        $('#count').html(count);
        $('#totalCount').html(totalCount);
        $('#percentage').html(Math.round(count/totalCount * 100) + '%');
        
        var trace1 = {
            type: 'scattergeo',
            mode: 'markers',
            lon: currentData.map(f => { if (f.lng !== "ERROR") { return f.lng } else { return 0 } }),
            lat: currentData.map(f => { if (f.lat !== "ERROR") { return f.lat } else { return 0 } }),
            text: currentData.map(f => f.loc),
            marker: {
                size: currentData.map(f => f.fat),
                color: color,
                opacity: 0.7,
                cmin: d3.min(currentData.map(d=> d.fat)),
                cmax: d3.max(currentData.map(d => d.fat)),
                line: {
                    color: 'white',
                    width: .8
                },
                sizeref: 10,
                sizemin: 4
            },
            name: chosenPhase.split('_').join(' ') + ' flight fatalities',
            visible: true,
        };

        var data = [trace1];

        var layout = {
            title: 'Scroll to zoom in or out.',
            width: 590,
            'geo': {
                'scope': 'world',
                'resolution': 100,
                projection: {
                    type: "eckert 3"
                },
                showland: false,
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
            autosize: true,
            margin: {
                l: 1,
                r: 1,
                b: 0,
                t: 35,
            },
        };

        //draw the map
        Plotly.plot('map', data, layout, {displayModeBar: false, scrollZoom: true});

        //display the flight info on hover 
        $('#map')[0].on('plotly_hover', function(data) {
            handleHover(data);
        });
        
    };

    // event handler for hover to display the flight info text
    function handleHover(data) {
        var flightInfo = $('#flight-info')
            var pn;
            data.points.forEach((point, index) => {
                pn = point.pointNumber;
                var flight = currentData[pn];
                $('#ref-id').html(flight.ref);
                $('#fatalities').html(flight.fat);
                $('#date').html(flight.date);
                $('#aircraft').html(flight.plane_type);
                $('#location').html(flight.country);
                $('#airline').html(flight.airline);
                $('#phase').html(flight.phase.split('_').join(' '));
                if (flight.meta.toLowerCase() != "unknown") {
                    $('#meta').html((flight.meta.split('_').join(' ')));
                    $('#cause').html("- " + flight.cause);
                } else {
                    $('#meta').html("Unknown");
                }
                $('#certainty').html(flight.cert);
                $('#story-label').html("STORY");
                $('#story').html( flight.notes);
                if (flight.notes !== "") {
                    $('#story-label').css('display', 'inline-block');
                    $('#story').css('display', 'inline-block');
                } else {
                    $('#story-label').css('display', 'none');
                    $('#story').css('display', 'none');
                }
            })
            $('#hover-helper').css('display', 'none');
            flightInfo.css('display', 'inline-block');
    }
        
    //updates the scatter plot
    function setScatterPlot(currentData) {
        var data = [{
            mode: 'markers',
            name: currentData[0].meta.split("_").join(" "),
            x: currentData.map(d => d.date),
            y: currentData.map(d => d.fat),
            text: currentData.map(d => d.cause),
            marker: {
                color: color,
                opacity: 0.6,
                size: 8,
            },
            line: {
                color: 'white',
                width: 1
            },
        }]

        var layout = {
            title: 'Scroll or select an area to zoom, or use the buttons to step backward.',
            width: 590,
            height: 380,
            showlegend: true,
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
                // rangeslider: {
                //     bgcolor: "#FFFFFF",
                //     activecolor: "#BAE1F2",
                //     thickness: .3,
                //     visible: true
                // }
            },
            yaxis: {
                type: 'log',
                autorange: true,
                ticks: 'outside',
                title: 'FATALITIES',
                titlefont: {
                    family: 'Helvetica',
                    size: 14,
                    color: 'grey'
                }
            }
        };

        //draws the scatterplot
        Plotly.plot('scatter', data, layout, {displayModeBar: false, scrollZoom: true});
        
        //apply the appropriate colors to the traces
        var update = { 'marker.color': ['#984ea3',"#386cb0",'#4daf4a','#e41a1c','#ff7f00']}
        Plotly.restyle('scatter', update);

        //display the appropriate info on hover
        $('#scatter')[0].on('plotly_hover', function(data) {
            handleHover(data);
        });

    }

    // filter on-change updates
    var phaseSelector = $('#phase-filter')[0];
    phaseSelector.addEventListener('change', (e) => { updatePhase(phaseSelector.value); });

    //event handler for when the filter is changed
    function updatePhase(){
        setBubblePlot(phaseSelector.value);
        var visibility = $("#map")[0].data[traceCount].visible;
        Plotly.restyle("map", {'visible': "legendonly"}, traceCount);
        if (causeVars.indexOf(phaseSelector.value) >= 0) {
            Plotly.restyle("scatter", {visible: "legendonly"})
            Plotly.restyle("scatter", {'visible': "true"}, causeVars.indexOf(phaseSelector.value))
        } else {
            Plotly.restyle("scatter", {visible: "true"})
        }
    }

});

});
