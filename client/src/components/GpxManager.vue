<template>
    <template v-if="npoints">
        Total: {{npoints}} points

        <template v-for="gpx in gpxs" :key="gpx.id">
            <point :id="gpx.id"></point>
        </template>

        <button @click="addPoint">New point</button>
        <button @click="this.$store.commit('clear')">Clear</button>
        <button @click="exportGpx">Export</button>
    </template>
    <template v-else>
        <h1>Welcome!</h1>
        <p>start by uploading a gpx file or with blank project?</p>

        <input type="file" id="file" accept=".gpx" @change="parseFile">

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
                let dom = parser.parseFromString(str, "application/gpx+xml");
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
        },
        exportGpx() {
            const FileSaver = require('file-saver');

            let gpx = '<?xml version="1.0" encoding="utf-8"?>\n<gpx version="1.1" creator="gpx-editor">\n';
            this.$store.state.gpx.forEach(point => {
                // template literals
                gpx += `\t<wpt lat="${point.lat}" lon="${point.lon}">\n\t\t<name>${point.name}</name>\n\t</wpt>\n`;
            });
            gpx += '</gpx>';

            let blob = new Blob([gpx], {type: "application/gpx+xml;charset=utf-8"});
            FileSaver.saveAs(blob, "gpxeditor-"+Date.now()+".gpx");
        }
    }
}
</script>