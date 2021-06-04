<template>
    <MainScreen @drop.prevent="handleDrop" @dragover.prevent="">
        <template v-slot:main>
            <Map></Map>
        </template>
        <template v-slot:sidebar>
            <GpxManager></GpxManager>
        </template>
    </MainScreen>
</template>

<script>
import MainScreen from './components/views/MainScreen.vue'
import GpxManager from './components/GpxManager.vue'
import Map from './components/Map.vue'

export default {
    components: {
        MainScreen,
        GpxManager,
        Map
    },
    methods: {
        handleDrop(event) {
            let items = event.dataTransfer.items;

            for (let i = 0; i < items.length; i++){
                this.$store.dispatch('parseFile', items[i].getAsFile())
            }
        },
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
</style>