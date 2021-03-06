<template>
    <SidebarHeaderFooter v-if="npoints">
        <template v-slot:header>
            <div class="padded">
            Total: {{npoints}} points
            </div>
        </template>

        <template v-slot:content>
            <point v-for="gpx in gpxs" :key="gpx.id" :id="gpx.id"></point>
        </template>

        <template v-slot:footer>
            <div class="padded">
                <div class="button-panel">
                    <button @click="clear" :disabled="collabActive" :title="collabActive ? 'disabled in collab mode' : ''">Clear</button>
                    <button @click="exportGpx">Export</button>

                    <button @click="leave" v-if="collabActive">Leave</button>
                    <button @click="collab" v-else >Collaborate</button>
                </div>

                <div v-if="collabActive">
                    You are in session with {{ nUsers }} users.
                    <div>
                        <input type="text" id="curDocID" readonly :value="collabActive"/>
                        <button @click="copyLink">Copy</button>
                    </div>
                </div>
            </div>
        </template>
    </SidebarHeaderFooter>
    <div v-else class="padded">
        <h1>Welcome!</h1>
        <p>start by uploading a gpx file or simply by clicking on the map!</p>

        <input type="file" id="file" accept=".gpx" @change="parseFile" multiple>

        <template v-if="collabActive">
            <button @click="leave">Leave</button>
            <div>You are in session <b>{{ collabActive }}</b></div>
        </template>
        <template v-else>
            <input type="text" id="docId"/>
            <button @click="join">Join</button>
        </template>
    </div>
</template>

<script>
import Point from './Point.vue'
import SidebarHeaderFooter from './views/SidebarHeaderFooter.vue'
import {createDoc, joinDoc, leaveDoc} from '../index'

export default {
    components: {
        Point,
        SidebarHeaderFooter
    },
    computed: {
        gpxs () {
            return this.$store.state.gpx
        },
        npoints() {
            return Object.keys(this.gpxs).length
        },
        collabActive() {
            return this.$store.state.docID
        },
        otherUsers() {
            return this.$store.state.users
        },
        nUsers() {
            return Object.keys(this.otherUsers).length
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
        },
        collab() {
            createDoc();
        },
        join() {
            let id  = document.getElementById("docId").value;
            console.log("picked id: ", id)
            joinDoc(id);
        },
        leave() {
            leaveDoc();
        },
        copyLink() {
            console.log(document.getElementById("curDocID"));
            document.getElementById("curDocID").select();
            document.execCommand("copy");
        }
    }
}
</script>

<style scoped>
.button-panel {
    display: flex;
    justify-content: space-between;
    flex-wrap: wrap;
}

.button-panel button {
    height: 2.5em;
}

.padded {
    padding: 1em;
}
</style>