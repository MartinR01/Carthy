<template>
    <div id="gpx-manager">
        <template v-if="npoints">
            Total: {{npoints}} points

            <template v-for="gpx in gpxs" :key="gpx.id">
                <point :id="gpx.id"></point>
            </template>

            <button @click="clear">Clear</button>
            <button @click="exportGpx">Export</button>
        </template>
        <template v-else>
            <h1>Welcome!</h1>
            <p>start by uploading a gpx file or with blank project?</p>

            <input type="file" id="file" accept=".gpx" @change="parseFile" multiple>

            <button @click="addPoint">Blank project</button>
        </template>
    </div>
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
            let filePicker  = document.getElementById("file");

            for(let i = 0; i < filePicker.files.length; i++){
                this.$store.dispatch('parseFile', filePicker.files[i]);
            }
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
        },
        clear() {
            this.$store.commit('clear');
        }
    }
}
</script>

<style scoped>
#gpx-manager{
    padding: 1em;
}
</style>