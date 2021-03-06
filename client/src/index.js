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
    setupDoc(id);
    
    doc.create({gpx: store.state.gpx});
    doc.subscribe(() => {
        store.commit('setDocID', id);
    });
    doc.on('op', (op, source) => {
        if (!source){
            store.commit('applyOperation', op)
        }
    })
}

function joinDoc(id){
    setupDoc(id);
    
    doc.subscribe(() => {
        store.commit('setDocID', id);
        store.commit('clear');
        for (const point of doc.data.gpx){
            store.commit('addnew', point);
        }
    });
    doc.on('op', (op, source) => {
        if (!source){
            store.commit('applyOperation', op)
        }
    })
}

function leaveDoc(){
    doc.destroy(() => {
        doc = null;
        store.commit('setDocID', null)
    });
    localPresence.presence.destroy();
    localPresence = null;
    store.commit('leaveDoc')
}

function startDragging(markerID){
    if(localPresence){
        localPresence.submit({drag: markerID})
    }
}

function endDragging(){
    if(localPresence){
        localPresence.submit({drag: null})
    }
}

export {createDoc, joinDoc, leaveDoc, startDragging, endDragging}



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
    getters: {
        lockedMarkers(state){
            let ret = {}
            state.gpx.forEach(gpx => {
                ret[gpx.id] = null
            })
            Object.keys(state.users).forEach(key => {
                if(state.users[key].drag){
                    ret[state.users[key].drag] = key
                }
            })
            return ret
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
        },
        leaveDoc(state){
            state.docID = null
            state.users = {}
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