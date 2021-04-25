import { createApp } from 'vue'
import { createStore } from 'vuex'
import App from './App.vue'

const store = createStore({
    state () {
        return {
            gpx: {
                id1: {
                    name: "point1"
                },
                id2: {
                    name: "point2"
                }
            }
        }
    },
    mutations: {
        rename (state, payload) {
            state.gpx[payload.id].name = payload.name;
        },
        addnew (state, payload) {
            let id = Date.now();
            state.gpx[id] = {name: ""};
        },
        remove (state, payload) {
            delete state.gpx[payload.id];
        }
    }
});

const app = createApp(App);
app.use(store);

app.mount('#app');