<template>
    <div id="mainscreen">
        <div class="main">
            <slot name="main"></slot>
            <button id="toggleButton" @click="toggleSidebar">{{ sidebarActive ? '>' : '<' }}</button>
        </div>
        <div class="sidebar" :style="{ display: sidebarActive ? 'block' : 'none'}">
            <slot name="sidebar"></slot>
        </div>
    </div>
</template>

<script>

export default {
    data() {
        return {
            sidebarActive: true
        }
    },
    methods: {
        toggleSidebar(){
            this.sidebarActive = !this.sidebarActive;
        }
    }
}

</script>


<style scoped>
#mainscreen {
    height: 100%;
    display: flex;
    align-items: stretch;
}
.main {
    position: relative;
    width: 75%;
    flex-grow: 1;
}
.sidebar {
    overflow: hidden;
    width: 25%;
    max-width: 18em;
    height: 100%;
    box-shadow: 0 0 16px rgba(0, 0, 0, 0.4);
    z-index: 900;
}
#toggleButton {
    height: 4em;
    width: 1.5em;
    padding: inherit;
    position: absolute;
    right: 0px;
    top: calc(50% - 2em);
    z-index: 1000;
}
</style>
