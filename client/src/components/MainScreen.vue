<template>
    <div id="mainscreen" @drop.prevent="handleDrop" @dragover.prevent="">
        <div class="map">
            <Map></Map>
            <button id="toggleButton" @click="toggleSidebar">{{ sidebarActive ? '>' : '<' }}</button>
        </div>
        <div class="gpx" :style="{ display: sidebarActive ? 'block' : 'none'}">
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
    data() {
        return {
            sidebarActive: true
        }
    },
    methods: {
        handleDrop(event) {
            let items = event.dataTransfer.items;

            for (let i = 0; i < items.length; i++){
                this.$store.dispatch('parseFile', items[i].getAsFile())
            }
        },
        toggleSidebar(){
            this.sidebarActive = !this.sidebarActive;
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
    display: flex;
    align-items: stretch;
}
.map {
    position: relative;
    width: 75%;
    flex-grow: 1;
}
.gpx {
    width: 25%;
    overflow-y: scroll;
}
#toggleButton {
    position: absolute;
    right: 0px;
    top: 50%;
    z-index: 1000;
}
</style>
