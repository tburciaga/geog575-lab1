/* JavaScript by Todd Burciaga, 2020 */

//create the map
function createMap(){
    //create the map
    var map = L.map('map', {
        center: [40, -99],
        zoom: 4
    });

    //add Mapbox base tile layer
    L.tileLayer('https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}', {
        attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
        maxZoom:18,
        id: 'mapbox/streets-v11',
        accessToken: 'pk.eyJ1IjoidGJ1cmNpYWdhIiwiYSI6ImNqamwwdnBqZTAyc2MzeHMzZzI5dXFrYjcifQ.Cu1KLjjpM9by5hD5XZXp4Q'
    }).addTo(map);

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
            
            //call function to create symbols and sequence controls
            createPropSymbols(response, map, attributes);
            createSequenceControls(response, map, attributes);
        }
    });
};

//build attributes arrays from the data
function processData(data){
    //empty array to hold attributes
    var attributes = [];

    //properties of the first feature in the dataset
    var properties = data.features[0].properties;

    //push each attribute name into attributes array
    for (var attribute in properties){
        //only take attributes with rank values
        if (attribute.indexOf("Rank") > -1){
            attributes.push(attribute);
        };
    };

    //check result
    // console.log("Current attribute:" + attributes);

    return attributes;

};

//create symbols using attribute data.
function createPropSymbols(data, map, attributes) {
    //create a leaflet GeoJSON layer and add to map
    L.geoJson(data, {
        pointToLayer: function(feature, latlng){
            return pointToLayer(feature, latlng, attributes);
        }
    }).addTo(map);

    //check values
    //console.log(data.features[0].properties)

};

//calculate the radius of each proportional symbol. ignore 0 ranks
function calcPropRadius(attValue) {
    //scale factor to adjust symbol size evenly
    var scaleFactor = 5000;
    //area based on attribute value and scale factor
    if (attValue > 0){
        var area = 1 / attValue * scaleFactor;
    } else if (attValue == 0){
        var area = 0;
    }; 
    
    //radius calculated based on area. skip 0 values.
    if (area > 0){
        var radius = Math.sqrt(area/Math.PI);
    } else if (area == 0){
        var radius = 0;
    };
    
    return radius;
};

//convert markers to circle markers
function pointToLayer(feature, latlng, attributes){
    //assign the current attribute based on the first index of the attributes array
    var attribute = attributes[0];
    
    //check result
    // console.log("Current Attribute:" + attribute);

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

    //create circle marker layer
    var layer = L.circleMarker(latlng, options, {
        title: feature.properties.City
    });

    // //create panel content
    // var panelContent = "<p><b>City:</b> " + feature.properties.City + "</p>";

    // //add formatted attribute to panel content string
    // var rankYear = attribute.split(" ")[0];
    // panelContent += "<b>Rank in " + rankYear + ": </b>" + feature.properties[attribute] + "</p>";

    //popup content *** MAY NEED TO REMOVE RANK IF TOO MESSY
    var rankYear = attribute.split(" ")[0];
    var popupContent = "<p><b>City: </b>" + feature.properties.City + ", " + feature.properties.State + "<p>" + "<b>" + rankYear + " Rank: </b>" + feature.properties[attribute] + "</p>";

    //bind the popup to the circle marker **** NOT NECESSARY IF MARKER NOT CREATED INITIALLY
    if (feature.properties[attribute] > 0){
        layer.bindPopup(popupContent, {
            offset: new L.Point(0,-options.radius),
            closeButton: false
        })
    };
    //event listeners to open popup on hover
    layer.on({
        mouseover: function(){
            this.openPopup();
        },
        // mouseout: function(){
        //     this.closePopup();
        // },
         click: function(){
             //$("#panel").html(panelContent);
            this.openPopup();
        }
    });

    //return the circle marker to the L.geoJson pointToLayer option
    return layer;
};

//create slider to control symbol display
function createSequenceControls(map, attributes){
    //create range input element (slider)
    $('#panel').append('<input class="range-slider" type="range">');

    //set slider attributes
    $('.range-slider').attr({
        max: 23,
        min: 0,
        value: 0,
        step: 1
    });

    //add skip buttons
    $('#panel').append('<button class="skip" id="reverse">Reverse</button>');
    $('#panel').append('<button class="skip" id="forward">Skip</button>');

    //replace button content with images
    $('#reverse').html('<img src="img/reverse.png">');
    $('#forward').html('<img src="img/forward.png">');

    //click listener for buttons
    $('.skip').click(function(){
        //sequence *** MAY BE A PROBLEM HERE
    })

    // //input listener for slider
    // $('.range-slider').on('input', function(){
    //     //sequence
    // })

    //input listener for slider
    $('.range-slider').on('input', function(){
        //sequence *** MAY BE A PROBLEM HERE
        var index = $(this).val();
    });

    //click listener for buttons
    $('.skip').click(function(){
        //get the old index value
        var index = $('.range-slider').val();

        //increment or decrement depending on button clicked
        if ($(this).attr('id') == 'forward'){
            index++;
            //if past the last attribute, wrap around to first attribute
            index = index > 23 ? 0 : index;
        } else if ($(this).attr('id') == 'reverse'){
            index--;
            //if past the first attribute, wrap around to last attribute
            index = index < 0 ? 23 : index;
        };

        //update slider
        $('.range-slider').val(index);
    });
};

//pass new attribute to update symbols-called in skip button and slider event listeners
function updatePropSymbols(map, attribute){
    map.eachLayer(function(layer){
        
        //update the layer style and popup
        if (layer.feature && layer.feature.properties[attribute]){

        //access feature properties
        var props = layer.feature.properties;

        //update each feature's radius based on new attribute values
        var radius = calcPropRadius(props[attribute]);
        layer.setRadius(radius);

        //add city to popup content string
        var popupContent = "<p><b>City:</b> " + props.City + "</p>";

        //add formatted attribute to panel content string
        var year = attribute.split(" ")[1];
        popupContent += "<p><b>Rank in " + year + ":</b> " + props[attribute] + "</p>";

        //replace the layer popup
        layer.bindPopup(popupContent, {
            offset: newL.Point(0,-radius)
        });
        };
    });
};

$(document).ready(createMap);