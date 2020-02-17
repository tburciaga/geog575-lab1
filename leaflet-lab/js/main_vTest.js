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

//create symbols using attribute data.
function createPropSymbols(data, map, attributes) {
    //create a leaflet GeoJSON layer and add to map
    L.geoJson(data, {
        pointToLayer: function(feature, latlng){
            return pointToLayer(feature, latlng, attributes);
        }
    }).addTo(map);
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

$(document).ready(createMap);