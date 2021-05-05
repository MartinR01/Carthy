<template>
<div id="map"></div>
</template>

<script>
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
require('leaflet/dist/images/marker-shadow.png');  // ensure it is included in webpack build

const icon = new L.Icon.Default();
const iconActive = L.icon({
    iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-orange.png',
    shadowUrl: "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-shadow.png",
    iconSize: [25, 41],
	iconAnchor: [12, 41],
	popupAnchor: [1, -34],
	shadowSize: [41, 41]
});

export default {
    data() {
        return {
            map: null,
            markers: null,
            dragging: false  // safeguard to not fire events while dragging that would lead to unintended behavior (redrawing markers etc.)
        }
    },
    mounted() {
        let osmAttr = '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors';
        let osm = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {attribution: osmAttr});
        let osmcycle = L.tileLayer('https://{s}.tile-cyclosm.openstreetmap.fr/cyclosm/{z}/{x}/{y}.png', {attribution: osmAttr});

        this.markers = L.layerGroup();

        this.map = L.map('map',{
            layers: [osm, this.markers]
        });

        fetch("https://www.geolocation-db.com/json/")
            .then(response => response.json())
            .then(data => this.map.setView([data.latitude, data.longitude], 13));
        
        this.map.on('click', this.addMarker);
        
        let baseLayers = {
            "OSM": osm,
            "OSM cycle": osmcycle
        }

        L.control.layers(baseLayers).addTo(this.map);
    },
    methods: {
        addMarker(event) {
            this.$store.dispatch('add', {
                name: "new point",
                lat: event.latlng.lat,
                lon: event.latlng.lng
            })
        },
        dragStart(event){
            this.dragging = true;
        },
        moveMarker(event) {
            this.dragging = false;
            this.$store.commit('move', {
                id: event.target.id,
                lat: event.target.getLatLng().lat,
                lon: event.target.getLatLng().lng
            });
        },
        mouseOver(event) {
            if(!this.dragging){
                this.$store.commit('setHl', event.target.id);
            }
        },
        mouseOut(event){
            if(!this.dragging){
                this.$store.commit('setHl', null);
            }
        },
        getMarker(id){
            return this.markers.getLayers().find(marker => marker.id === id);
        }
    },
    watch: {
        '$store.state.gpx': {
            handler(points) {
                let newpoints = points.filter(point => !this.getMarker(point.id));
                let rmpoints = this.markers.getLayers().filter(marker => !points.find(point => point.id === marker.id));

                console.log("adding "+newpoints.length+ " markers");
                console.log("removing "+rmpoints.length+" markers");

                for (let point of newpoints){
                    let marker = L.marker([point.lat, point.lon],{
                            draggable: true
                        })
                        .on('dragstart', this.dragStart)
                        .on('dragend', this.moveMarker)
                        .on('mouseover', this.mouseOver)
                        .on('mouseout', this.mouseOut)
                        .bindPopup("<h3>"+point.name+"</h3>")
                        .addTo(this.markers);
                    marker.id = point.id;
                }
                for (let marker of rmpoints){
                    this.markers.removeLayer(marker);
                }
            },
            deep: true  // necessary for array mutations
        },
        '$store.state.highlighted'(id, oldid) {
            if(oldid){
                let marker = this.markers.getLayers().find(marker => marker.id === oldid);
                if(marker){
                    marker.setIcon(icon);
                }
            }
            if(id){
                let marker = this.markers.getLayers().find(marker => marker.id === id);
                if(marker){
                    marker.setIcon(iconActive);
                }
            }
        }
    }
    
}
</script>

<style scoped>
#map { height: 100%; }
</style>