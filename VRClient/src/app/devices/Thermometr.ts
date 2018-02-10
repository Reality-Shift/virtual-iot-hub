import { IotDevice } from '../models/IotDevice';
import { IotDeviceUI } from '../models/IotDeviceUI';

export class Thermometr extends IotDevice {
    private mesh: BABYLON.AbstractMesh;

    public init() {
        this.mesh = BABYLON.MeshBuilder.CreateBox('test', {size: 1}, this.scene);
        this.mesh.parent = this;

        this.deviceUI = new IotDeviceUI(this.guiRoot, this.mesh);
        this.deviceUI.name = this.name;
        this.deviceUI.type = this.type;
    }
}
