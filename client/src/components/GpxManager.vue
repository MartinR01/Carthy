<template>
    <template v-if="npoints">
        Total: {{npoints}} points

        <div v-for="gpx in gpxs" :key="gpx.id">
            {{gpx.name}}
        </div>

        <template v-for="gpx in gpxs" :key="gpx.id">
            <point :id="gpx.id"></point>
        </template>

        <button @click="addPoint">New point</button>
    </template>
    <template v-else>
        <h1>Welcome!</h1>
        <p>start by uploading a gpx file or with blank project?</p>

        <input type="file" id="file" accept=".gpx">
        <button @click="parseFile">Upload file</button>

        <button @click="addPoint">Blank project</button>
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
        },
        npoints() {
            return Object.keys(this.gpxs).length
        }
    },
    methods: {
        addPoint() {
            this.$store.dispatch('add');
        },
        parseFile() {
            let file  = document.getElementById("file");
            const parser = new DOMParser();

            file.files[0].text().then((str) => {
                let dom = parser.parseFromString(str, "application/xml");
                let wpts = dom.getElementsByTagName("wpt");

                for (const wpt of wpts){  // doesnt work with 'in' ?!
                    console.log( wpt.getElementsByTagName("name")[0].innerHTML);
                    this.$store.dispatch('add', {
                        name: wpt.getElementsByTagName("name")[0].innerHTML,
                        lat: wpt.getAttribute("lat"),
                        lon: wpt.getAttribute("lon")
                    });
                }
            });
        }
    }
}
</script>