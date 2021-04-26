<template>
<div class="point">
    <input type="text" v-model="name"/>
    <button @click="remove">Delete</button>
    <div>{{lat}}, {{lon}}</div>
</div> 
</template>

<script>
export default {
    props: ['id'],
    computed: {
        name: {
            get: function(){
                return this.$store.state.gpx.find((wpt) => wpt.id === this.id).name
            },
            set: function(newName){
                this.$store.commit('rename', {id: this.id, name: newName})
            }
        },
        lat: {
            get: function(){
                return this.$store.state.gpx.find((wpt) => wpt.id === this.id).lat
            },
            set: function(newLat){
                this.$store.commit('rename', {id: this.id, lat: newLat})
            }
        },
        lon: {
            get: function(){
                return this.$store.state.gpx.find((wpt) => wpt.id === this.id).lon
            },
            set: function(newLon){
                this.$store.commit('rename', {id: this.id, lon: newLon})
            }
        },
    },
    methods: {
        remove() {
            this.$store.commit('remove', {id: this.id});
        }
    }
}
</script>