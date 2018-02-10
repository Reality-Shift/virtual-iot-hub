"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const http_1 = require("http");
const express = require("express");
const io = require("socket.io");
const State_1 = require("./State");
const app = express();
const server = http_1.createServer(app);
const port = process.env.PORT || 1337;
server.listen(port, () => {
    console.log('Running server on port %s', port);
});
console.log('Server running at %d', port);
var socketConnection = io(server);
const states = new Map();
socketConnection.on('connect', socket => {
    socket.on('login', loginData => {
        if (typeof (loginData) === typeof ("")) {
            loginData = JSON.parse(loginData);
        }
        if (loginData != null && loginData.room != null) {
            var state;
            if (loginData.clientType != null) {
                if (states.has(loginData.room)) {
                    state = states.get(loginData.room);
                }
                else {
                    state = new State_1.State(socketConnection);
                    states.set(loginData.room, state);
                }
                if (loginData.clientType == 'ar') {
                    state.addArClient(socket);
                }
                else if (loginData.clientType == 'vr') {
                    state.addVrClient(socket);
                }
            }
            else {
                socket.emit('error', { err: 'unable to login, client type must be specified' });
            }
        }
        else {
            socket.emit('error', { err: 'unable to login' });
        }
    });
});
//# sourceMappingURL=server.js.map