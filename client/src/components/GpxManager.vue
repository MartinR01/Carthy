<template>
    <div v-for="gpx in gpxs">
        {{gpx.name}}
    </div>
    <template v-for="(gpx, id) in gpxs">
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