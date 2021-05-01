<template>
    <div id="mainscreen" @drop.prevent="handleDrop" @dragover.prevent="">
        <div class="map">
            <Map></Map>
        </div>
        <div class="gpx">
            <GpxManager></GpxManager>
        </div>
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
}
#mainscreen {
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
