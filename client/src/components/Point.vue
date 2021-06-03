<template>
<div class="point" :class="{active:isActive}" @mouseover="mouseOver" @mouseout="mouseOut">
    <template v-if="opened">
        <input type="text" v-model="name"/>
        <input type="number" step="0.1" v-model="lat"/>
        <input type="number" step="0.1" v-model="lon"/>
        <button @click="toggle">Done</button>
    </template>
    <template v-else>
        <input type="text" v-model="name"/>

        <div>
            <button @click="remove">Delete</button>
            <button @click="toggle">Edit</button>
        </div>
    </template>
</div> 
</template>

<script>
export default {
    props: ['id'],
    data() {
        return {
            opened: false
        }
    },
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
                this.$store.commit('move', {id: this.id, lat: newLat, lon: this.lon})
            }
        },
        lon: {
            get: function(){
                return this.$store.state.gpx.find((wpt) => wpt.id === this.id).lon
            },
            set: function(newLon){
                this.$store.commit('move', {id: this.id, lat: this.lat, lon: newLon})
            }
        },
        isActive() {
            return this.$store.state.highlighted === this.id;
        }
    },
    methods: {
        remove() {
            this.$store.commit('remove', {id: this.id});
        }, 
        toggle() {
            this.opened = !this.opened;
        },
        mouseOver(event){
            this.$store.commit('setHl', this.id);
        },
        mouseOut(event){
            this.$store.commit('setHl', null);
        }
    }
}
</script>

<style scoped>
.point{
    border: 1px dashed black;
    border-radius: 0.5em;

    padding: 0.5em;
    /* todo: add to flexbox */
}
.point input {
    width: 90%;
}
.active{
    background-color: lightsteelblue;
}
</style>