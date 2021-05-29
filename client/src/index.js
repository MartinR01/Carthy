import { createApp } from 'vue'
import { createStore } from 'vuex'
import App from './App.vue'
import ReconnectingWebSocket from 'reconnecting-websocket';
const Connection = require('sharedb/lib/client').Connection
const json0 = require('ot-json0/lib/json0')

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
let localPresence = null;

function generateID(){
    let time = new Date().getTime();
    let json = JSON.stringify(store.state.gpx);
    return (time+json).hashCode();
}

function setupDoc(id){
    let host = PRODUCTION ? location.origin.replace(/^http/, 'ws') : "ws://localhost:3000";
    let socket = new ReconnectingWebSocket(host);
    let connection = new Connection(socket);
    doc = connection.get('gpx', id);

    const presence = connection.getPresence(id)
    presence.subscribe()
    presence.on('receive', (presenceId, payload) => {
        console.log("pres", presenceId);
        console.log("payload", payload);

        if (!payload) {
            store.commit('removeUser', presenceId);
        } else{
            store.commit('updateUser', {id: presenceId, value: payload})
        }
    });

    localPresence = presence.create()
    localPresence.submit({})
}

function createDoc(){
    let id = generateID();
    console.log("id", id)
    setupDoc(id);
    
    doc.create({gpx: store.state.gpx});
    doc.subscribe(() => {
        store.commit('setDocID', id);
    });
    doc.on('op', (op, source) => {
        console.log("op", op)
        console.log('src', source)
        if (!source){
            store.commit('applyOperation', op)
        }
        console.log('update ', doc.data.gpx);
    })
}

function joinDoc(id){
    setupDoc(id);
    
    doc.subscribe(() => {
        console.log('loaded', doc.data.gpx);
        store.commit('setDocID', id);
        store.commit('clear');
        for (const point of doc.data.gpx){
            store.commit('addnew', point);
        }
    });
    doc.on('op', (op, source) => {
        console.log("op", op)
        console.log('src', source)
        console.log('update ', doc.data.gpx);
        if (!source){
            store.commit('applyOperation', op)
        }
    })
}

function leaveDoc(){
    console.log('destroy')
    doc.destroy(() => {
        doc = null;
        store.commit('setDocID', null)
    });
    localPresence.presence.destroy();
    localPresence = null;
}

export {createDoc, joinDoc, leaveDoc}



require('/src/assets/favicon.png')

const parser = new DOMParser();

const store = createStore({
    state () {
        return {
            gpx: [],
            highlighted: null,
            docID: null,
            users: {}
        }
    },
    mutations: {
        rename (state, payload) {
            let pos = state.gpx.findIndex(wpt => wpt.id === payload.id);
            if(doc){
                doc.submitOp([
                    {p: ['gpx', pos, 'name'], od:state.gpx[pos].name, oi:payload.name}
                ])
            }
            state.gpx[pos].name = payload.name;
        },
        move (state, payload) {
            console.log(payload.lat)
            let pos = state.gpx.findIndex(wpt => wpt.id === payload.id);
            if(doc){
                doc.submitOp([
                    {p: ['gpx', pos, 'lat'], od:state.gpx[pos].lat, oi:payload.lat},
                    {p: ['gpx', pos, 'lon'], od:state.gpx[pos].lon, oi:payload.lon}
                ])
            }
            state.gpx[pos].lat = payload.lat;
            state.gpx[pos].lon = payload.lon;
        },
        addnew (state, payload) {
            state.gpx.push({
                id: payload.id,
                name: payload.name,
                lat: payload.lat,
                lon: payload.lon
            });
        },
        remove (state, payload) {
            let pos = state.gpx.findIndex((wpt) => wpt.id === payload.id);
            if (doc){
                doc.submitOp([{p: ['gpx', pos], ld: state.gpx[pos]}])
            }
            state.gpx.splice(pos, 1);
        },
        clear (state) {
            state.gpx.splice(0, state.gpx.length);
        },
        setHl(state, id){
            state.highlighted = id;
        },
        setDocID(state, id) {
            state.docID = id;
        },
        applyOperation(state, op){
            console.log("operation ", op)
            json0.apply(state, op)
        },
        updateUser(state, {id, value}){
            state.users[id] = value;
        },
        removeUser(state, id){
            delete state.users[id];
        }
    },
    actions: {
        add ({commit, state}, payload) {
            let point = {
                id: (new Date().getTime() + payload.lat + payload.lon).toString().hashCode(),
                name: payload ? payload.name : "",
                lat: payload ? payload.lat : 0,
                lon: payload ? payload.lon : 0
            };
            commit('addnew', point);
            if (doc){
                doc.submitOp([{p: ['gpx', doc.data.gpx.length], li: point}]);
                localPresence.submit({id: point.id})
            }
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