import { createApp } from 'vue'
import { createStore } from 'vuex'
import App from './App.vue'
import ReconnectingWebSocket from 'reconnecting-websocket';
const Connection = require('sharedb/lib/client').Connection

let doc = null;

function setupDoc(id){
    let socket = new ReconnectingWebSocket("ws://localhost:3000");
    let connection = new Connection(socket);
    doc = connection.get('collection', id);
}

function createDoc(){
    setupDoc('id');
    
    doc.create({gpx: []});
    doc.subscribe(() => {
        store.commit('toggleCollab');
    });
    doc.on('op', (op) => {
        console.log('update ', doc.data.gpx);
    })
}

function joinDoc(id){
    setupDoc(id);
    
    doc.subscribe(() => {
        console.log('loaded', doc.data.gpx);
        store.commit('toggleCollab');
    });
    doc.on('op', (op) => {
        console.log('update ', doc.data.gpx);
    })
}

function leaveDoc(){
    console.log('destroy')
    doc.destroy(() => {
        doc = null;
        store.commit('toggleCollab')
    });
}

export {createDoc, joinDoc, leaveDoc}



require('/src/assets/favicon.png')

const parser = new DOMParser();
let curId = 1;  // starting from 0 caused problems due to its likeness to 'false'

const store = createStore({
    state () {
        return {
            gpx: [],
            highlighted: null,
            collabActive: false
        }
    },
    mutations: {
        rename (state, payload) {
            state.gpx.find(wpt => wpt.id === payload.id).name = payload.name;
        },
        move (state, payload) {
            let point = state.gpx.find(wpt => wpt.id === payload.id);
            point.lat = payload.lat;
            point.lon = payload.lon;
        },
        addnew (state, payload) {
            state.gpx.push({
                id: payload.id,
                name: payload.name,
                lat: payload.lat,
                lon: payload.lon
            });
            if (doc){
                doc.submitOp([{p: ['gpx', 0], li: {name: payload.name, lat: payload.lat}}]);
            }
        },
        remove (state, payload) {
            state.gpx.splice(
                state.gpx.findIndex((wpt) => wpt.id === payload.id), 
                1
            );
        },
        clear (state) {
            state.gpx.splice(0, state.gpx.length);
        },
        setHl(state, id){
            state.highlighted = id;
        },
        toggleCollab(state) {
            state.collabActive = !state.collabActive;
        }
    },
    actions: {
        add ({commit, state}, payload) {
            commit('addnew', {
                id: curId++,
                name: payload ? payload.name : "",
                lat: payload ? payload.lat : 0,
                lon: payload ? payload.lon : 0
            });
        },
        parseFile({dispatch}, file) {
            file.text().then((str) => {
                let dom = parser.parseFromString(str, "application/xml");
                let wpts = dom.getElementsByTagName("wpt");

                for (const wpt of wpts){  // doesnt work with 'in' ?!
                    dispatch('add', {
                        name: wpt.getElementsByTagName("name")[0].innerHTML,
                        lat: wpt.getAttribute("lat"),
                        lon: wpt.getAttribute("lon")
                    });
                }
            });
        }
    }
});

const app = createApp(App);
app.use(store);

app.mount('#app');