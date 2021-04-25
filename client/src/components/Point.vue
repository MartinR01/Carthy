<template>
<div class="point">
    <input type="text" v-model="name"/>
</div>
    
</template>

<script>
module.exports = {
    props: ['id'],
    computed: {
        name: {
            get: function(){
                return this.$store.state.gpx[this.id].name
            },
            set: function(newName){
                this.$store.commit('rename', {id: this.id, name: newName})
            }
        }
    }
}
</script>