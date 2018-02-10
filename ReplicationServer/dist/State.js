"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const fs = require("fs");
class State {
    constructor(server, name) {
        this.server = server;
        this.name = name;
        this.vrClients = new Map();
        this.devices = new Map();
    }
    addVrClient(vrClient) {
        this.vrClients.set(vrClient.id, vrClient);
        vrClient.on('disconnect', () => {
            console.log(vrClient.id + ' disconnected (VR)');
            this.vrClients.delete(vrClient.id);
        });
        console.log(vrClient.id + ' connected (VR)');
        this.devices.forEach(device => {
            console.log(device);
            vrClient.emit('device_created', device);
        });
        fs.readFile('./room-' + this.name, (err, data) => {
            if (err != null) {
                console.log(err);
            }
            else {
                vrClient.emit('map', data);
            }
        });
    }
    addArClient(arClient) {
        this.arClient = arClient;
        arClient.on('device_created', data => {
            if (typeof (data) === typeof ("")) {
                data = JSON.parse(data);
            }
            if (data.name == null) {
                return;
            }
            this.devices.set(data.name, data);
            this.vrClients.forEach(vrClient => {
                vrClient.emit('device_created', data);
            });
        });
        arClient.on('device_deleted', data => {
            if (typeof (data) === typeof ("")) {
                data = JSON.parse(data);
            }
            if (data.name == null) {
                return;
            }
            this.devices.delete(data.name);
            this.vrClients.forEach(vrClient => {
                vrClient.emit('device_deleted', data);
            });
        });
        arClient.on('device_data', data => {
            if (typeof (data) === typeof ("")) {
                data = JSON.parse(data);
            }
            this.vrClients.forEach(vrClient => {
                vrClient.emit('device_data', data);
            });
        });
        arClient.on('map', data => {
            fs.writeFile('./room-' + this.name, data, (err) => {
                if (err != null) {
                    console.log(err);
                }
                else {
                    console.log('created file ./room-' + this.name);
                }
            });
            this.vrClients.forEach(vrClient => {
                console.log('emit map for ' + data.id);
                vrClient.emit('map', data);
            });
        });
        arClient.on('disconnect', () => {
            console.log(this.arClient.id + ' disconnected (AR)');
            this.arClient = null;
        });
        console.log(arClient.id + ' connected (AR)');
    }
}
exports.State = State;
//# sourceMappingURL=State.js.map