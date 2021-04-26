<template>
<div id="map"></div>
</template>

<script>
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

export default {
    data() {
        return {
        }
            
    },
    mounted() {
        let mymap = L.map('map');
        L.tileLayer(
            'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', 
            {
                attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            }
        ).addTo(mymap);
        let marker = L.marker([51.5, -0.09]).addTo(mymap);

        fetch("https://www.geolocation-db.com/json/")
            .then(response => response.json())
            .then(data => mymap.setView([data.latitude, data.longitude], 13));
    }
    
}
</script>

<style scoped>
#map { height: 100%; }
</style>