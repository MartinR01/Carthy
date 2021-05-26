import { createApp } from 'vue'
import { createStore } from 'vuex'
import App from './App.vue'
import ReconnectingWebSocket from 'reconnecting-websocket';
const Connection = require('sharedb/lib/client').Connection


String.prototype.hashCode = function() {
    var hash = 0, i, chr;
    if (this.length === 0) return hash;
    for (i = 0; i < this.length; i++) {
        chr   = this.charCodeAt(i);
        hash  = ((hash << 5) - hash) + chr;
        hash |= 0; // Convert to 32bit integer
    }
    return btoa(hash);  // convert to base64
};

let doc = null;

function generateID(){
    let time = new Date().getTime();
    let json = JSON.stringify(store.state.gpx);
    return (time+json).hashCode();
}

function setupDoc(id){
    let socket = new ReconnectingWebSocket("ws://localhost:3000");
    let connection = new Connection(socket);
    doc = connection.get('gpx', id);
}

function createDoc(){
    let id = generateID();
    console.log("id", id)
    setupDoc(id);
    
    doc.create({gpx: []});
    doc.subscribe(() => {
        store.commit('setDocID', id);
    });
    doc.on('op', (op) => {
        console.log('update ', doc.data.gpx);
    })
}

function joinDoc(id){
    setupDoc(id);
    
    doc.subscribe(() => {
        console.log('loaded', doc.data.gpx);
        store.commit('setDocID', id);
    });
    doc.on('op', (op) => {
        console.log('update ', doc.data.gpx);
    })
}

function leaveDoc(){
    console.log('destroy')
    doc.destroy(() => {
        doc = null;
        store.commit('setDocID', null)
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
            docID: null
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
        setDocID(state, id) {
            state.docID = id;
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