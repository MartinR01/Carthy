<template>
    <div v-for="(gpx, id) in gpxs" :key="id">
        {{gpx.name}}
    </div>
    <template v-for="(gpx, id) in gpxs" :key="id">
        <point :id="id"></point>
    </template>
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
        }
    }
}
</script>