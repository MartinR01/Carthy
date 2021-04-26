<template>
<div id="map"></div>
</template>

<script>
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

export default {
    mounted() {
        var mymap = L.map('map').setView([51.505, -0.09], 13);
        L.tileLayer(
            'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', 
            {
                attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            }
        ).addTo(mymap);

    }
    
}
</script>

<style scoped>
#map { height: 100%; }
</style>