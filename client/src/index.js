import { createApp } from 'vue'
import { createStore } from 'vuex'
import App from './App.vue'

const parser = new DOMParser();

const store = createStore({
    state () {
        return {
            gpx: [],
            highlighted: null
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
        }
    },
    actions: {
        add ({commit, state}, payload) {
            let id = Math.floor(Math.random() * 100000);  // todo generate hash
            commit('addnew', {
                id: id,
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