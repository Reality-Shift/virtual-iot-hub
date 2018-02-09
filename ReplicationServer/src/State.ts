export class State {
    public arClient: SocketIO.Socket;
    public vrClients: Map<string, SocketIO.Socket>;

    constructor(private server: SocketIO.Server) {
    }

    public addVrClient(vrClient: SocketIO.Socket) {
        this.vrClients.set(vrClient.id, vrClient);

        vrClient.on('disconnect', () => {
            this.vrClients.delete(vrClient.id);
        });
    }

    public addArClient(arClient: SocketIO.Socket) {
        this.arClient = arClient;

        arClient.on('device_created', deviceData => {
            this.vrClients.forEach(vrClient => {
                vrClient.emit('device_created', deviceData);
            });
        });

        arClient.on('device_data', deviceValuesData => {
            this.vrClients.forEach(vrClient => {
                vrClient.emit('device_data', deviceValuesData);
            });
        });

        arClient.on('map', mapData => {
            this.vrClients.forEach(vrClient => {
                vrClient.emit('map', mapData);
            });
        });
        
        arClient.on('disconnect', () => {
            this.arClient = null;
        });
    }
}
