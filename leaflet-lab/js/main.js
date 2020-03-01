/* JavaScript by Todd Burciaga, 2020 */

/*$(document).ready(function() {*/

    //cities and centerPop datasets
    var cities = L.layerGroup();
    var centerPop = L.layerGroup();
    //var states = L.layerGroup();

    //create the map
    function createMap(){

        //create basemap layers
        var mbAerial = L.tileLayer('https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}', {
            attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
            maxZoom:18,
            id: 'mapbox/satellite-streets-v11',
            accessToken: 'pk.eyJ1IjoidGJ1cmNpYWdhIiwiYSI6ImNqamwwdnBqZTAyc2MzeHMzZzI5dXFrYjcifQ.Cu1KLjjpM9by5hD5XZXp4Q'
        }), 
            mbStreets = L.tileLayer('https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}', {
            attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
            maxZoom:18,
            id: 'mapbox/streets-v11',
            //id: 'mapbox/light-v10',
            //id: 'mapbox/dark-v10',
            //id: 'mapbox/outdoors-v11',
            accessToken: 'pk.eyJ1IjoidGJ1cmNpYWdhIiwiYSI6ImNqamwwdnBqZTAyc2MzeHMzZzI5dXFrYjcifQ.Cu1KLjjpM9by5hD5XZXp4Q'
        }),
        mbLight = L.tileLayer('https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}', {
            attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
            maxZoom:18,
            //id: 'mapbox/streets-v11',
            id: 'mapbox/light-v10',
            //id: 'mapbox/dark-v10',
            //id: 'mapbox/outdoors-v11',
            accessToken: 'pk.eyJ1IjoidGJ1cmNpYWdhIiwiYSI6ImNqamwwdnBqZTAyc2MzeHMzZzI5dXFrYjcifQ.Cu1KLjjpM9by5hD5XZXp4Q'
        }),
        mbDark = L.tileLayer('https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}', {
            attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
            maxZoom:18,
            //id: 'mapbox/streets-v11',
            //id: 'mapbox/light-v10',
            id: 'mapbox/dark-v10',
            //id: 'mapbox/outdoors-v11',
            accessToken: 'pk.eyJ1IjoidGJ1cmNpYWdhIiwiYSI6ImNqamwwdnBqZTAyc2MzeHMzZzI5dXFrYjcifQ.Cu1KLjjpM9by5hD5XZXp4Q'
        }),
            osmStreets = L.tileLayer('http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap contributors</a>',
            maxZoom:18
        });

        //create the map
        var map = L.map('map', {
            center: [40, -99],
            zoom: 4,
            layers: [mbAerial, cities, centerPop]
        });    

        //create layer control objects
        var baseMaps = {
            "Mapbox Aerial": mbAerial,
            "Mapbox Streets": mbStreets,
            "Mapbox Light": mbLight,
            "Mapbox Dark": mbDark,
            "Open Street Map": osmStreets
        };

        var overlayMaps = {
            "Cities": cities,
            "Center of Population": centerPop
        };

        //add layer controls
        L.control.layers(baseMaps, overlayMaps).addTo(map);

        //add scale bar
        L.control.scale().addTo(map);

        //call getData function
        getData(map);

    };

    //retrieve data
    function getData(map){
        //load data from geoJSON
        $.ajax("data/top15USCitiesRank.geojson", {
            dataType: "json",
            success: function(response){
                //create an attributes array
                var attributes = processData(response);

                //call functions to create symbols, sequence controls, and legend
                createPropSymbols(response, map, attributes);
                createSequenceControls(map, attributes);
                createLegend(map,attributes);
            }
        });
    };

    //calculate the radius of each proportional symbol. ignore 0 ranks
    function calcPropRadius(attValue) {
        //scale factor to adjust symbol size evenly
        var scaleFactor = 1000;
        //area based on attribute value and scale factor
        if (attValue > 0 && attValue < 16){
            var area = 1 / attValue * 2 * scaleFactor;
        } else {
            var area = 0.001;
        }; 
        
        //radius calculated based on area. skip 0 values.
        if (area > 0.001){
            var radius = Math.sqrt(area/Math.PI);
        } else if (area == 0.001){
            var radius = 0.001;
        };
        
        return radius;
    };

    // function cityFilter(cities){
    //     let bigCities = [];
    //     for(let i = 0; i < cities.attribute)
    //     var topFifteen = cities.filter(function (f){
    //         return f.cities > 0 && f.cities < 16;
    //     });
    //     //console.log(topFifteen);
    // };


    //create and bind popup content to send to pointToLayer() and updatePropSymbols()
    function Popup(properties, attribute, layer, radius){
        //object properties
        this.properties = properties;
        this.attribute = attribute;
        this.layer = layer;
        this.year = attribute.split(" ")[0];
        this.rank = this.properties[attribute];
        this.content = "<b>City: </b>" + this.properties.City + ", " + this.properties.State + "<p><b>" + this.year + " Rank: </b>" + this.rank + "</p>";

        this.bindToLayer = function(){
            this.layer.bindPopup(this.content, {
                offset: new L.Point(0,-radius),
                closeButton: false
            });
        };  
    };

    //convert markers to circle markers
    function pointToLayer(feature, latlng, attributes){        
        //assign the current attribute based on the first index of the attributes array
        var attribute = attributes[0];

        //create base marker symbology
        var options = {
            fillColor: "purple",
            color: "white",
            weight: 1,
            opacity: 1,
            fillOpacity: 0.6
        };

        //for each feature, determine its value for the selected attribute
        var attValue = Number(feature.properties[attribute]);

        //give each feature's circle marker a radius based on its attribute value
        options.radius = calcPropRadius(attValue);

        /////////////////////////////////////////////
        var filter = "";
        //create circle marker layer
        var layer = L.circleMarker(latlng, options);
        
        //create new popup
        var popup = new Popup(feature.properties, attribute, layer, options.radius);

        //add popup to circle marker
        popup.bindToLayer();

        //event listeners to open popup and change symbol on hover
        layer.on({
            mouseover: function(){
                this.openPopup();
                this.setStyle({fillColor: 'yellow'});
            },
            mouseout: function(){
                this.closePopup();
                this.setStyle({fillColor: 'purple'});
            }
        });

        //return the circle marker to the L.geoJson pointToLayer option
        return layer;
    };

    //build attributes header arrays from the data
    function processData(data){
        //empty array to hold attributes
        var attributes = [];

        //properties of the first feature in the dataset
        var properties = data.features[0].properties;

        //push each attribute name into attributes array
        for (var x in properties){
            //only take attributes with a rank value
            if (x.indexOf("Rank") > -1){
                attributes.push(x);
            };
        };
        return attributes;
    };

    //create symbols using attribute data.
    function createPropSymbols(data, map, attributes) {
        //create leaflet GeoJSON layer and add to map
        L.geoJson(data, {
            pointToLayer: function(feature, latlng){
                return pointToLayer(feature, latlng, attributes);
                }
            }).addTo(cities);
    };

    //create sequence control slider to control city display
    function createSequenceControls(map, attributes) {

        var SequenceControl = L.Control.extend({
            options: {
                position: 'bottomright'
            },

            onAdd: function (map) {
                //create the control container div with a particular class name
                var container = L.DomUtil.create('div', 'sequence-control-container');

                //create range input element (slider)
                $(container).append('<input class="range-slider" type="range" max="23" min="0" value="0" step="1">');

                //stop click interactions with map under container
                L.DomEvent.addListener(container, 'mousedown', function(e) {
                    L.DomEvent.stopPropagation(e);
                });

                L.DomEvent.disableClickPropagation(container);

                return container;
            }
        });

        map.addControl(new SequenceControl());

        //set slider attributes
        $('.range-slider').attr({
            max: 23,
            min: 0,
            value: 0,
            step: 1
        });

        //input listener for slider
        $('.range-slider').on('input', function(){
            //get the new index value. 
            
            var index = $(this).val();

            //pass new attribute index to update symbols
            updatePropSymbols(map, attributes[index]);
        });
    };

    //pass new attribute to update symbols-called in slider event listeners
    function updatePropSymbols(map, attribute){
        
        //update the layer style and popup
        map.eachLayer(function(layer){
            
            if (layer.feature && layer.feature.properties[attribute]){
                
                //pull feature properties
                var props = layer.feature.properties;
                
                //update each feature's radius based on new attribute values
                var radius = calcPropRadius(props[attribute]);
                layer.setRadius(radius);
                
                //create popups
                var popup = new Popup(props, attribute, layer, radius);
                //add popup to circle marker
                popup.bindToLayer();
            };
        });

        updateLegend(map, attribute);
    };

    //create a legend and add it to the map
    function createLegend(map, attributes){
        var LegendControl = L.Control.extend({
            options: {
                position: 'bottomleft'
            },
    
            onAdd: function (map) {
                // create the control container with a particular class name
                var container = L.DomUtil.create('div', 'legend-control-container');

                //and temporal legend to container
                $(container).append('<div id="temporal-legend">')

                //attribute legend svg
                var svg = '<svg id="attribute-legend" width="100px" height="80px">';

                //circle sizes to be used for y positioning of legend labels
                var circles = {
                    max: 60,
                    mean: 40,
                    min: 20
                };

                //add circles to svg
                for (var circle in circles){
                    //circle string
                    svg += '<circle class="legend-circle" id="' + circle + '" fill="#800080" fill-opacity="0.6" stroke="#FFFFFF" cx="30"/>';
                
                    //text string
                    svg += '<text id="' + circle + '-text" x="65" y="' + circles[circle] + '"></text>';
                    //console.log(svg)
                };

                //svg string closure
                svg += "</svg>";
                //console.log(svg);

                L.DomEvent.disableClickPropagation(container);

                //add attribute legend svg to container
                $(container).append(svg);

                return container;
    
            }
        });
    
        map.addControl(new LegendControl());

        updateLegend(map, attributes[0]);
    };

    //this simply passes through the preset values for top 15 city rankings
    function getCircleValues(map, attribute){
        //start with min at highest possible and max at lowest possible number
        var min = Infinity,
            max = -Infinity;
    
        // map.eachLayer(function(layer){
        //     //get the attribute value
        //     if (layer.feature){
        //         var attributeValue = Number(layer.feature.properties[attribute]);
    
        //         //test for min
        //         if (attributeValue < min){
        //             min = attributeValue;
        //         };
    
        //         //test for max
        //         if (attributeValue > max){
        //             max = attributeValue;
        //         };
        //     };
        // });
    
        // //set mean
        // var mean = (max + min) / 2;
    
        //return values as an object
        return {
            max: 15,
            mean: 7,
            min: 1
        };
    };

    //update the legend with new attributes
    function updateLegend(map, attribute){
        //create content for legend
        var year = attribute.split(" ")[0];
        var content = "City Rank in " + "<b>" + year + "</b>";
    
        //replace legend content
        $('#temporal-legend').html(content);
    
        //get the max, mean, and min values as an object
        var circleValues = getCircleValues(map, attribute);
    
        for (var key in circleValues){
            //get radius
            var radius = calcPropRadius(circleValues[key]);
    
            //Step 3: assign the cy and r attributes
            $('#'+key).attr({
                cy: 59 - radius,
                r: radius
            });
    
            //Step 4: add legend text
            $('#'+key+'-text').text(Math.round(circleValues[key]*100)/100);
        };
    };

/////////////////////////////////////////////////////////////////////////////

    // //retrieve center of population data
    // function getCenterPopData(map){
    //     //load data from geoJSON
    //     $.ajax("data/meancenterofusPop.geojson", {
    //         dataType: "json",
    //         success: function(response){
    //         //create an array of attributes
    //         var centerAttributes = processData(response);

    //         //call functions to create symbols
    //         createCenterPropSymbols(response, map, attributes);
    //         }
    //     });
    // };

    // //create symbols using attribute data.
    // function createCenterPropSymbols(data, map, attributes) {
    //     //create leaflet GeoJSON layer and add to map

    //     L.geoJson(data, {
    //         centerPointToLayer: function(feature, latlng){
    //             return centerPointToLayer(feature, latlng, attributes);
    //             }
    //         }).addTo(centerPop);
    // };

    // //convert markers to circle markers
    // function centerPointToLayer(feature, latlng, attributes){
    //     //assign the current attribute based on the first index of the attributes array
    //     var attribute = attributes[0];

    //     //create base marker symbology
    //     var options = {
    //         fillColor: "blue",
    //         color: "grey",
    //         size: 10,
    //         weight: 1,
    //         opacity: 1,
    //         fillOpacity: 1
    //     };

    //     //for each feature, determine its value for the selected attribute
    //     var attValue = Number(feature.properties[attribute]);

    //     //give each feature's circle marker a radius based on its attribute value
    //     options.radius = 10;

    //     //create circle marker layer
    //     var layer = L.circleMarker(latlng, options);
        
    //     // //create new popup
    //     // var popup = new Popup(feature.properties, attribute, layer, options.radius);

    //     // //add popup to circle marker
    //     // popup.bindToLayer();

    //     // //event listeners to open popup and change symbol on hover
    //     // layer.on({
    //     //     mouseover: function(){
    //     //         this.openPopup();
    //     //         this.setStyle({fillColor: 'yellow'});
    //     //     },
    //     //     mouseout: function(){
    //     //         this.closePopup();
    //     //         this.setStyle({fillColor: 'purple'});
    //     //     }
    //     // });

    //     //return the circle marker to the L.geoJson pointToLayer option
    //     return layer;
    // };

$(document).ready(createMap);

// console.log(data.features[0])
// console.log(attributes)
// console.log(data.features[0].properties["1790 Rank"])

// console.log(response, attributes)

/* code and approach modified from lab exercises and
stackovervlow contributions at 
https://stackoverflow.com/questions/16148598/leaflet-update-geojson-filter
*/