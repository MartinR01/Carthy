const express = require('express');
const http = require('http');
const app = express();
const port = process.env.PORT || 3000;

const websock = require('ws');
const sockstream = require('websocket-stream');

const server = http.createServer(app);
const websockServer = new websock.Server({server: server});

websockServer.on('connection', (webSocket) => {
    console.log('connected');
    let stream = new sockstream(webSocket);
    console.log('done');
})

app.use(express.static(__dirname + '/public'));

// fallback option for invalid paths
app.get(/.*/, (req, res) => {
    res.sendFile(__dirname + '/public/index.html');
})

server.listen(port, () => console.log(`listening at port ${port}`));
