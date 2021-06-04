<template>
    <div id="wrapper">
        <div id="header">
            <slot name="header"></slot>
        </div>
        <div id="content">
            <slot name="content"></slot>
        </div>
        <div id="footer">
            <slot name="footer"></slot>
        </div>
    </div>
</template>

<style scoped>
#wrapper{
    display: flex;
    flex-direction: column;
    height: 100%;
}

#content {
    flex-grow: 1;
    overflow-y: scroll;
}

#header, #footer {
    z-index: 1;
    box-shadow: 0 0 16px rgba(0, 0, 0, 0.5);
}
</style>