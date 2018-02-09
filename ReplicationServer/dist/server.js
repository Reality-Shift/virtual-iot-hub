"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const http_1 = require("http");
const express = require("express");
const io = require("socket.io");
const app = express();
const server = http_1.createServer(app);
const port = process.env.PORT || 1337;
server.listen(port, () => {
    console.log('Running server on port %s', port);
});
console.log('Server running at %d', port);
var socketConnection = io(server);
socketConnection.on('connect', socket => {
    socket.emit('test', { test: 'daat' });
});
//# sourceMappingURL=server.js.map