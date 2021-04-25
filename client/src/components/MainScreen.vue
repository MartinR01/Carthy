<template>
    <div class="map">
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
}
</style>
