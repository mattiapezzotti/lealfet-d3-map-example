var map = L.map("map").setView([45.6374, 10.0430], 13);

L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
    attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a>',
    maxZoom: 19,
}).addTo(map);

L.svg().addTo(map);

const searchbar = document.getElementById("searchbar");
const submit = document.getElementById("submit");
const log = document.getElementById("log");

var layerGroup = new L.LayerGroup();
layerGroup.addTo(map);

submit.addEventListener("click", geocode);

function drawCircle(lat, long){
    d3.selectAll("circle").remove();
    var coord = [ {lat: lat, long: long }]
    map.setView([coord[0].lat, coord[0].long], 13);

    d3.select("#map")
    .select("svg")
    .selectAll("circles")
    .data(coord)
    .enter()
    .append("circle")
        .attr("cx", function(d){ return map.latLngToLayerPoint([d.lat, d.long]).x })
        .attr("cy", function(d){ return map.latLngToLayerPoint([d.lat, d.long]).y })
        .attr("r", 20)
        .style("fill", "blue")
        .attr("stroke", "blue")
        .attr("stroke-width", 2)
        .attr("fill-opacity", .2)
}

function update() {
d3.selectAll("circle")
    .attr("cx", function(d){ return map.latLngToLayerPoint([d.lat, d.long]).x })
    .attr("cy", function(d){ return map.latLngToLayerPoint([d.lat, d.long]).y })
}

map.on("moveend", update)

function geocode(){
    layerGroup.clearLayers();
    const location = searchbar.value;
    const apiUrl = 'https://nominatim.openstreetmap.org/search?q=' + location + '&format=jsonv2&limit=1&polygon_geojson=1';
    
    fetch(apiUrl).then(response => {
        if (!response.ok) {
            throw new Error('Network error');
        }
        return response.json();
    }).then(data => {
        drawCircle(data[0].lat, data[0].lon);
        L.geoJSON(data[0].geojson).addTo(layerGroup);
    }).catch(error => {
        console.error('Error:', error);
    });
}