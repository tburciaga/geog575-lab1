/* Javascript by Todd Burciaga, 2020 */

//GOAL: Symbols reflect attribute values
//STEPS:
//1. Create the leaflet map--done (createMap() function)
//2. Import GeoJSON data--done (in getData())
//3. Add circle markers for point features to the map--done (in AJAX callback)
//4. Determine which attribute to visualize with proportional symbols--done (in geoJson call)
//5. For each feature, determine its value for the selected attribute--done with var attribute
//6. Give each feature's circle marker a radius based on its attribute value

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

//calculate the radius of each proportional symbol
function calcPropRadius(attValue) {
    //scale factor to adjust symbol size evenly
    var scaleFactor = 5000;
    //area based on attribute value and scale factor
    var area = 1 / attValue * scaleFactor;
    //radius calcluated based on area
    var radius = Math.sqrt(area/Math.PI);

    return radius;
};

//convert markers to circle markers
function pointToLayer(feature, latlng){
    //Determine which attribute to visualize with proportional symbols
    var attribute = "2020 Rank";

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

//add circle markers for point features to the map
function createPropSymbols(data, map){
    //create a Leaflet GeoJSON layer with styling and add to map
    L.geoJson(data, {
        pointToLayer: pointToLayer //{
        //     //deterine each feature value for attribute
        //     var attValue = Number(feature.properties[attribute]);

        //     //Give each features circle marker a radius based on attribute value
        //     geojsonMarkerOptions.radius = calcPropRadius(attValue);

        //     // //check attribute value to ensure it is correct
        //     // console.log(feature.properties, attValue);

        //     //create circle markers
        //     return L.circleMarker(latlng, geojsonMarkerOptions);
        // }
    }).addTo(map);
};

//function to retrieve the data and place it on the map
function getData(map){
    //load the data
    $.ajax("data/top15USCitiesRank.geojson", {
        dataType: "json",
        success: function(response){
            //call function to create proportional symbols
            createPropSymbols(response, map);
        }
    });
};

$(document).ready(createMap);


/* Map of GeoJSON data from MegaCities.geojson */
// //function to instantiate the Leaflet map
// function createMap(){
//     //create the map
//     var map = L.map('map', {
//         center: [20, 0],
//         zoom: 2
//     });

//     //add OSM base tilelayer
//     L.tileLayer('http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
//         attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap contributors</a>'
//     }).addTo(map);

//     //call getData function
//     getData(map);
// };

// //build html for popups
// function onEachFeature(feature, layer) {
//     //create html string
//     var popupContent = "";
//     if (feature.properties) {
//         //loop to add feature property names and values to html string
//         for (var property in feature.properties){
//             popupContent += "<p>" + property + ": " + feature.properties[property] + "</p>";
//         }
//         layer.bindPopup(popupContent);
//     };
// };

// //function to retrieve the data and place it on the map
// function getData(map){
//     //load the data
//     $.ajax("data/megaCities.geojson", {
//         dataType: "json",
//         success: function(response){

//             /* This block simply adds the geojson layer to the 
//             marker cluster group */
            
//             //create a Leaflet GeoJSON layer
//             var geoJsonLayer = L.geoJson(response);
//             //create a L.markerClusterGroup layer
//             var markers = L.markerClusterGroup();
//             //add geojson to marker cluster layer
//             markers.addLayer(geoJsonLayer);
//             //add marker cluster layer to map
//             map.addLayer(markers);

//             /* The commented out section builds a marker cluster group with a loop */
//             // //examine the data in the console to figure out how to construct the loop
//             // console.log(response)

//             // //create an L.markerClusterGroup layer
//             // var markers = L.markerClusterGroup();

//             // //loop through features to create markers and add to MarkerClusterGroup
//             // for (var i = 0; i < response.features.length; i++) {
//             //     var a = response.features[i];

//             //     //add properties html string to each marker
//             //     var properties = "";
//             //     for (var property in a.properties){
//             //         properties += "<p>" + property + ": " + a.properties[property] + "</p>";
//             //     };
//             //     var marker = L.marker(new L.LatLng(a.geometry.coordinates[1], a.geometry.coordinates[0]), { properties : properties });

//             //     //add a popup for each marker
//             //     marker.bindPopup(properties);
//             //     //add marker to MarkerClusterGroup
//             //     markers.addLayer(marker);
//             // }
//             // //add MarkerClusterGroup to map
//             // map.addLayer(markers);

            
//             // //set marker options
//             // var geojsonMarkerOptions = {
//             //     radius: 8,
//             //     fillColor: "#ff7800",
//             //     color: "#000",
//             //     weight: 1,
//             //     opacity: 1,
//             //     fillOpacity: 0.6
//             // };

//             // //create a Leaflet GeoJSON layer with a filter and add to map
//             // L.geoJson(response, {
//             //     //use filter function to only show cities with 2015 populations greater than 20 million
//             //     filter: function(feature, layer) {
//             //         return feature.properties.Pop_2015 > 20;
//             //     }
//             // }).addTo(map);

//             // //create a Leaflet GeoJSON layer with popups and add to map
//             // L.geoJson(response, {
//             //     onEachFeature: onEachFeature
//             // }).addTo(map);

//             // //create a Leaflet GeoJSON layer with styling and add to map
//             // L.geoJson(response, {
//             //     pointToLayer: function (feature, latlng){
//             //         return L.circleMarker(latlng, geojsonMarkerOptions);
//             //     }
//             // }).addTo(map);
//         }
//     });
// };

// $(document).ready(createMap);





// //Add popup to features if they have popups
// function onEachFeature(feature, layer) {
//     //does this feature have a property named popupContent?
//     if (feature.properties && feature.properties.popupContent) {
//         layer.bindPopup(feature.properties.popupContent);
//     }
// }

// // Initialize map and set initial extent
// var map = L.map('map').setView([51.505, -0.09], 3);

// //Add tile layer
// L.tileLayer('http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
//     attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap contributors</a>'
// }).addTo(map);

// //Establish a geoJSON feature
// var geojsonFeature = {
//     "type": "Feature",
//     "properties": {
//         "name": "Home",
//         "amenity": "Apartment Building",
//         "popupContent": "This is where Todd lives!"
//     },
//     "geometry": {
//         "type": "Point",
//         "coordinates": [-87.616822, 41.886674]
//     }
// };

// //Adds features to map
// L.geoJSON(geojsonFeature, {
//     onEachFeature: onEachFeature
// }).addTo(map);


// /* Initialize map and set initial extent */
// var mymap = L.map('map').setView([51.505, -0.09], 3);

// //function to instantiate the Leaflet map
// function createMap(){
//     //create the map
//     var map = L.map('map', {
//         center: [20, 0],
//         zoom: 2
//     });

//     //add OSM base tilelayer
//     L.tileLayer('http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
//         attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap contributors</a>'
//     }).addTo(map);

//     //call getData function
//     getData(map);
// };

// //function to retrieve the data and place it on the map
// function getData(map){
//     //load the data
//     $.ajax("data/megaCities.geojson", {
//         dataType: "json",
//         success: function(response){

//             //create a Leaflet GeoJSON layer and add it to the map
//             L.geoJson(response).addTo(map);
//         }
//     });
// };

// $(document).ready(createMap);

// //function to retrieve the data and place it on the map
// function getData(map){
//     //load the data
//     $.ajax("data/MegaCities.geojson", {
//         dataType: "json",
//         success: function(response){
//             //examine the data in the console to figure out how to construct the loop
//             console.log(response)

//             //create an L.markerClusterGroup layer
//             var markers = L.markerClusterGroup();

//             //loop through features to create markers and add to MarkerClusterGroup
//             for (var i = 0; i < response.features.length; i++) {
//                 var a = response.features[i];
//                 //add properties html string to each marker
//                 var properties = "";
//                 for (var property in a.properties){
//                     properties += "<p>" + property + ": " + a.properties[property] + "</p>";
//                 };
//                 var marker = L.marker(new L.LatLng(a.geometry.coordinates[1], a.geometry.coordinates[0]), { properties: properties });
//                 //add a popup for each marker
//                 marker.bindPopup(properties);
//                 //add marker to MarkerClusterGroup
//                 markers.addLayer(marker);
//             }

//             //add MarkerClusterGroup to map
//             map.addLayer(markers);
//         }
//     });
// };