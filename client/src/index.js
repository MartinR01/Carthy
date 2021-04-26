import { createApp } from 'vue'
import { createStore } from 'vuex'
import App from './App.vue'

const store = createStore({
    state () {
        return {
            gpx: []
        }
    },
    mutations: {
        rename (state, payload) {
            state.gpx.find(wpt => wpt.id === payload.id).name = payload.name;
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
            
        }
    }
});

const app = createApp(App);
app.use(store);

app.mount('#app');