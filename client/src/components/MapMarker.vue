<script>
import L from 'leaflet';
import {endDragging, startDragging} from '../index'

const icon = new L.Icon.Default();
const iconActive = L.icon({
    iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-orange.png',
    shadowUrl: "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-shadow.png",
    iconSize: [25, 41],
	iconAnchor: [12, 41],
	popupAnchor: [1, -34],
	shadowSize: [41, 41]
});
const iconDisabled = L.icon({
    iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-grey.png',
    shadowUrl: "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-shadow.png",
    iconSize: [25, 41],
	iconAnchor: [12, 41],
	popupAnchor: [1, -34],
	shadowSize: [41, 41]
});

export default {
    props: ['id', 'markers', "latlon", "name"],
    data(){
        return {
            marker: null,
            dragging: false
        }
    },
    computed: {
        isHighlighted() {
            return this.$store.state.highlighted === this.id
        },
        usedBy() {
            return this.$store.getters.lockedMarkers[this.id]
        }
    },
    watch: {
        name(val, oldVal) {
            this.marker.getPopup().setContent(this.name)
        },
        isHighlighted(val, oldVal) {
            if (!this.dragging){
                this.marker.setIcon(val ? iconActive : icon)
            }
        },
        latlon(val, oldVal) {
            this.marker.setLatLng(val)
        },
        usedBy(val, oldVal){
            if(val){
                this.marker.dragging.disable()
                this.marker.setIcon(iconDisabled)
            } else {
                this.marker.dragging.enable()
                this.marker.setIcon(icon)
            }
        }
    },
    methods: {
        dragStart(event){
            startDragging(this.id)
            this.dragging = true;
        },
        moveMarker(event) {
            this.$store.commit('move', {
                id: event.target.id,
                lat: event.target.getLatLng().lat,
                lon: event.target.getLatLng().lng
            });
            endDragging()
            this.dragging = false;
        },
        mouseOver(event) {
            if(this.$store.state.highlighted === null){
                this.$store.commit('setHl', this.id);
            }
        },
        mouseOut(event){
            if(!this.dragging && this.$store.state.highlighted === this.id){
                this.$store.commit('setHl', null);
            }
        },
    },
    mounted() {
        this.marker = L.marker(this.latlon,{
                draggable: true
            })
            .bindPopup(this.name)
            .on('dragstart', this.dragStart)
            .on('dragend', this.moveMarker)
            .on('mouseover', this.mouseOver)
            .on('mouseout', this.mouseOut)
            .addTo(this.markers);
        this.marker.id = this.id;
    },
    unmounted() {
        this.markers.removeLayer(this.marker);
    }
}
</script>