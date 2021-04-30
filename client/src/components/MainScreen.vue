<template>
    <div class="map" @drop.prevent="handleDrop" @dragover.prevent="">
        <Map></Map>
    </div>
    <div class="gpx">
        <GpxManager></GpxManager>
    </div>
</template>

<script>
import GpxManager from './GpxManager.vue'
import Map from './Map.vue'

export default {
    components: {
        Map, GpxManager
    },
    methods: {
        handleDrop(event) {
            let items = event.dataTransfer.items;

            for (let i = 0; i < items.length; i++){
                this.$store.dispatch('parseFile', items[i].getAsFile())
            }
        }
    }
}

</script>


<style>
html, body {
    height: 100%;
    margin: 0;
}
#app {
    height: 100%;
    display: grid;
    grid-template-columns: 2fr 1fr;
}
.map {
    grid-column: 1 / 1;
}
.gpx {
    grid-column: 2 / 2;
    overflow-y: scroll;
}
</style>
