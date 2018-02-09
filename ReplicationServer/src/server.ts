import { createServer, Server } from 'http';
import * as express from 'express';
import * as io from 'socket.io'
import { State } from './State';

const app = express();
const server = createServer(app);

const port = process.env.PORT || 1337;
server.listen(port, () => {
    console.log('Running server on port %s', port);
});

console.log('Server running at %d', port);

var socketConnection = io(server);

const states = new Map<string, State>();

socketConnection.on('connect', socket => {
    socket.on('login', loginData => {
        console.log(loginData);
        if (loginData !== null && loginData.room !== null) {
            var state: State;

            if (loginData.clientType !== null) {
                if (states.has(loginData.room)) {
                    state = states.get(loginData.room);
                }
                else {
                    state = new State(socketConnection);
                }

                if (loginData.clientType == 'ar') {
                    state.addArClient(socket);
                }
                else if (loginData.clientType == 'vr') {
                    state.addVrClient(socket);
                }
            }
            else {
                socket.emit('error', {err: 'unable to login, client type must be specified'});
            }
        }
        else {
            socket.emit('error', {err: 'unable to login'});
        }
    });
})
