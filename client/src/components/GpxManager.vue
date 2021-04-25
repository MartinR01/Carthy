<template>
    Total: {{npoints}} files

    <div v-for="(gpx, id) in gpxs" :key="id">
        {{gpx.name}}
    </div>

    <template v-for="(_, id) in gpxs" :key="id">
        <point :id="id"></point>
    </template>

    <button @click="addPoint">New point</button>
</template>

<script>
import Point from './Point.vue'

export default {
    components: {
        Point
    },
    computed: {
        gpxs () {
            return this.$store.state.gpx
        },
        npoints() {
            return Object.keys(this.gpxs).length
        }
    },
    methods: {
        addPoint() {
            this.$store.commit('addnew');
        }
    }
}
</script>