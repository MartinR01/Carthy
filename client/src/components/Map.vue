<template>
<div id="map" ref="map">
    <map-marker v-for="marker in gpxs" :key="marker.id" 
        :id="marker.id" :markers="markers" :name="marker.name"
        :latlon="[marker.lat, marker.lon]"></map-marker>
</div>
</template>

<script>
import L from 'leaflet';
import MapMarker from './MapMarker.vue'
import 'leaflet/dist/leaflet.css';
require('leaflet/dist/images/marker-shadow.png');  // ensure it is included in webpack build


export default {
    components: { 
        MapMarker 
    },
    data() {
        return {
            map: null,
            markers: null,
            dragging: false  // safeguard to not fire events while dragging that would lead to unintended behavior (redrawing markers etc.)
        }
    },
    computed: {
        gpxs() {
            return this.$store.state.gpx
        }
    },
    mounted() {
        let osmAttr = '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors';
        let osm = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {attribution: osmAttr, noWrap: true});
        let osmcycle = L.tileLayer('https://{s}.tile-cyclosm.openstreetmap.fr/cyclosm/{z}/{x}/{y}.png', {attribution: osmAttr, noWrap: true});

        this.markers = L.layerGroup();

        this.map = L.map('map',{
            layers: [osm, this.markers],
            minZoom: 3,
            maxBoundsViscosity: 0.8,
            maxBounds: [[-180, 180], [180, -180]]
        });

        this.map.locate({
            setView: true,
            maxZoom: 13,
            enableHighAccuracy: true
        });
        
        this.map.on('click', this.addMarker);
        
        let baseLayers = {
            "OSM": osm,
            "OSM cycle": osmcycle
        }

        L.control.layers(baseLayers).addTo(this.map);
        L.control.scale().addTo(this.map);

        const resizeObserver = new ResizeObserver(entries => {
            this.map.invalidateSize({pan: false});
        });
        resizeObserver.observe(this.$refs.map);
    },
    methods: {
        addMarker(event) {
            console.log("clicked", event)
            this.$store.dispatch('add', {
                name: "new point",
                lat: event.latlng.lat,
                lon: event.latlng.lng
            })
        },
        getMarker(id){
            return this.markers.getLayers().find(marker => marker.id === id);
        }
    },
    watch: {
        '$store.state.users': {
            handler(users) {
                for (let userid in users){
                    let marker = this.markers.getLayers().find(marker => marker.id === users[userid].drag)

                    if (marker){
                        marker.dragging.disable()
                    }
                }
            },
            deep: true
        }
    }
    
}
</script>

<style scoped>
#map { height: 100%; }
</style>