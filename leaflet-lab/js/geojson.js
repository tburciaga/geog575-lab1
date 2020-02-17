/* Javascript by Todd Burciaga, 2020
Map of GeoJSON data from MegaCities.geojson */


//function to instantiate the Leaflet map
function createMap(){
    //create the map
    var map = L.map('map', {
        center: [20, 0],
        zoom: 2
    });

    //add OSM base tilelayer
    L.tileLayer('http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap contributors</a>'
    }).addTo(map);

    //call getData function
    getData(map);
};

//build html for popups
function onEachFeature(feature, layer) {
    //create html string
    var popupContent = "";
    if (feature.properties) {
        //loop to add feature property names and values to html string
        for (var property in feature.properties){
            popupContent += "<p>" + property + ": " + feature.properties[property] + "</p>";
        }
        layer.bindPopup(popupContent);
    };
};

//function to retrieve the data and place it on the map
function getData(map){
    //load the data
    $.ajax("data/megaCities.geojson", {
        dataType: "json",
        success: function(response){

            /* This block simply adds the geojson layer to the 
            marker cluster group */
            
            //create a Leaflet GeoJSON layer
            var geoJsonLayer = L.geoJson(response);
            //create a L.markerClusterGroup layer
            var markers = L.markerClusterGroup();
            //add geojson to marker cluster layer
            markers.addLayer(geoJsonLayer);
            //add marker cluster layer to map
            map.addLayer(markers);

            /* The commented out section builds a marker cluster group with a loop */
            // //examine the data in the console to figure out how to construct the loop
            // console.log(response)

            // //create an L.markerClusterGroup layer
            // var markers = L.markerClusterGroup();

            // //loop through features to create markers and add to MarkerClusterGroup
            // for (var i = 0; i < response.features.length; i++) {
            //     var a = response.features[i];

            //     //add properties html string to each marker
            //     var properties = "";
            //     for (var property in a.properties){
            //         properties += "<p>" + property + ": " + a.properties[property] + "</p>";
            //     };
            //     var marker = L.marker(new L.LatLng(a.geometry.coordinates[1], a.geometry.coordinates[0]), { properties : properties });

            //     //add a popup for each marker
            //     marker.bindPopup(properties);
            //     //add marker to MarkerClusterGroup
            //     markers.addLayer(marker);
            // }
            // //add MarkerClusterGroup to map
            // map.addLayer(markers);

            
            // //set marker options
            // var geojsonMarkerOptions = {
            //     radius: 8,
            //     fillColor: "#ff7800",
            //     color: "#000",
            //     weight: 1,
            //     opacity: 1,
            //     fillOpacity: 0.6
            // };

            // //create a Leaflet GeoJSON layer with a filter and add to map
            // L.geoJson(response, {
            //     //use filter function to only show cities with 2015 populations greater than 20 million
            //     filter: function(feature, layer) {
            //         return feature.properties.Pop_2015 > 20;
            //     }
            // }).addTo(map);

            // //create a Leaflet GeoJSON layer with popups and add to map
            // L.geoJson(response, {
            //     onEachFeature: onEachFeature
            // }).addTo(map);

            // //create a Leaflet GeoJSON layer with styling and add to map
            // L.geoJson(response, {
            //     pointToLayer: function (feature, latlng){
            //         return L.circleMarker(latlng, geojsonMarkerOptions);
            //     }
            // }).addTo(map);
        }
    });
};

$(document).ready(createMap);





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