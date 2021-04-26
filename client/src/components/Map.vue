<template>
<div id="map"></div>
</template>

<script>
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

export default {
    data() {
        return {
            map: null,
            markers: null
        }
            
    },
    mounted() {
        this.map = L.map('map');
        this.markers = L.layerGroup().addTo(this.map);

        fetch("https://www.geolocation-db.com/json/")
            .then(response => response.json())
            .then(data => this.map.setView([data.latitude, data.longitude], 13));
        
        this.map.on('click', this.addMarker);
        L.tileLayer(
            'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', 
            {
                attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            }
        ).addTo(this.map);



    },
    methods: {
        addMarker(event) {
            this.$store.dispatch('add', {
                name: "new point",
                lat: event.latlng.lat,
                lon: event.latlng.lng
            })
        }
    },
    watch: {
        '$store.state.gpx': {
            handler(points, oldpoints) {
                // todo delta update map layers
                this.markers.clearLayers();
                for (let point of points){
                    L.marker([point.lat, point.lon]).addTo(this.markers);
                }
            },
            deep: true  // necessary for array mutations
        }
    }
    
}
</script>

<style scoped>
#map { height: 100%; }
</style>