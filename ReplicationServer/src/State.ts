export class State {
    public arClient: SocketIO.Socket;
    public vrClients: Map<string, SocketIO.Socket> = new Map<string, SocketIO.Socket>();

    private devices: Map<string, any> = new Map<string, any>();

    constructor(private server: SocketIO.Server) {
    }

    public addVrClient(vrClient: SocketIO.Socket) {
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
    }

    public addArClient(arClient: SocketIO.Socket) {
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
            this.vrClients.forEach(vrClient => {
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
