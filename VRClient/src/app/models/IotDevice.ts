import { IotDeviceUI } from './IotDeviceUI';
import { TransformNode } from 'babylonjs';

export abstract class IotDevice extends TransformNode {
    public deviceUI: IotDeviceUI;

    constructor(protected scene: BABYLON.Scene, protected guiRoot: BABYLON.GUI.AdvancedDynamicTexture,
        public name: string, public type: string) {
        super(name, scene);
        this.init();
    }

    public abstract init();
}
