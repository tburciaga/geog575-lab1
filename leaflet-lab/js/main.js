/* Javascript by Todd Burciaga, 2020 */

//create the map
function createMap(){
    //create the map
    var map = L.map('map', {
        center: [40, -99],
        zoom: 5
    });
    
    //add OSM base tile layer
    L.tileLayer('http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap contributors</a>'
    }).addTo(map);

    //call getData function
    getData(map);
};

//function to retrieve the data and place it on the map
function getData(map){
    //load the data
    $.ajax("data/top15USCitiesRank.geojson", {
        dataType: "json",
        success: function(response){
            //create an attributes array
            var attributes = processData(response);

            //call function to create proportional symbols
            createPropSymbols(response, map, attributes);
            createSequenceControls(map, attributes);
        }
    });
};

//build an attributes array from the data
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

    ////check result
    //console.log(attributes);

    return attributes;
};

//add circle markers for point features to the map
function createPropSymbols(data, map, attributes){
    //create a Leaflet GeoJSON layer with styling and add to map
    L.geoJson(data, {
        pointToLayer: function(feature, latlng){
            return pointToLayer(feature, latlng, attributes);
        } 
        //pointToLayer //{
            // //deterine each feature value for attribute
            // var attValue = Number(feature.properties[attribute]);

            // //Give each features circle marker a radius based on attribute value
            // geojsonMarkerOptions.radius = calcPropRadius(attValue);

            // // //check attribute value to ensure it is correct
            // // console.log(feature.properties, attValue);

            // //create circle markers
            // return L.circleMarker(latlng, geojsonMarkerOptions);
        //}
    }).addTo(map);
};

//convert markers to circle markers
function pointToLayer(feature, latlng, attributes){
    //Assign the current attribute based on the first index of the attributes array
    var attribute = attributes[0];
    // //check
    // console.log(attribute)

    //create marker options
    var options = {
        fillColor: "#ff7800",
        color: "#000",
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

    /* Original popup content is changed to panel content */
    var panelContent = "<p><b>City:</b> " + feature.properties.City + "</p>";

    //add formatted attribute to panel content string
    var rankYear = attribute.split(" ")[0];
    panelContent += "<b>Rank in " + rankYear + ": </b>" + feature.properties[attribute] + "</p>";

    //popup content is now just the city name
    var popupContent = feature.properties.City;

    //bind the popup to the circle marker
    layer.bindPopup(popupContent, {
        offset: new L.Point(0,-options.radius),
        closeButton: false
    });

    // //build popup content string
    // var popupContent = "<p><b>City:</b> " + feature.properties.City + "</p>";
    
    // //add formatted attribute to popup content string
    // var year = attribute;
    // popupContent += "<p><b> " + year + ":</b> " + feature.properties[attribute] + "</p>";

    // //bind the popup to the circle marker, add offset
    // layer.bindPopup(popupContent, {
    //     offset: new L.Point(0,-options.radius)
    // });

    //event listeners to open popup on hover
    layer.on({
    mouseover: function(){
        this.openPopup();
    },
    mouseout: function(){
        this.closePopup();
    },
    click: function(){
        $("#panel").html(panelContent);
    }
});

    //return the circle marker to the L.geoJson pointToLayer option
    return layer;
};

//create sequence controls
function createSequenceControls(map){
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
        //sequence
    })

    //input listener for slider
    $('.range-slider').on('input', function(){
        //sequence
    })

    //input listener for slider
    $('.range-slider').on('input', function(){
        //get the new index value
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

//calculate the radius of each proportional symbol
function calcPropRadius(attValue) {
    //scale factor to adjust symbol size evenly
    var scaleFactor = 50;
    //area based on attribute value and scale factor
    var area = attValue * scaleFactor;
    //radius calcluated based on area
    var radius = Math.sqrt(area/Math.PI);

    return radius;
};

//called in both skip button and slider event listener handlers
//pass new attribute to update symbols
function updatePropSymbols(map, attribute){
    map.eachLayer(function(layer){
        if (layer.feature && layer.feature.properties[attribute]){
            //update the layer style and popup

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
                offset: new L.Point(0,-radius)
            });
        };
    });
};

$(document).ready(createMap);