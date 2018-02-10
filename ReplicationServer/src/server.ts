import { State } from "./State";

var io = require('socket.io')({
	transports: ['websocket'],
});

io.attach(1337);

const states = new Map<string, State>();

io.on('connection', socket => {
    console.log('connected');
    socket.on('login', loginData => {
        if (typeof (loginData) === typeof ("")) {
            loginData = JSON.parse(loginData);
        }
        
        if (loginData != null && loginData.room != null) {
            var state: State;

            if (loginData.clientType != null) {
                if (states.has(loginData.room)) {
                    state = states.get(loginData.room);
                }
                else {
                    state = new State(io, loginData.room);
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
})
