const express = require('express');
const http = require('http');
const app = express();
const port = process.env.PORT || 3000;

const websock = require('ws');
const sockstream = require('@teamwork/websocket-json-stream');
const ShareDB = require('sharedb');

const server = http.createServer(app);
const websockServer = new websock.Server({server: server});


let backend = new ShareDB({
    presence: true
});

websockServer.on('connection', (webSocket) => {
    let stream = new sockstream(webSocket);
    backend.listen(stream);
})

app.use(express.static(__dirname + '/public'));

// fallback option for invalid paths
app.get(/.*/, (req, res) => {
    res.sendFile(__dirname + '/public/index.html');
})

server.listen(port, () => console.log(`listening at port ${port}`));
