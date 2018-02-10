import 'babylonjs';
import { IotDeviceData } from './IotDeviceData';


export class IotDeviceUI {
    private contentContainer: BABYLON.GUI.Rectangle;
    private titleContainer: BABYLON.GUI.Rectangle;
    private valuesContainer: BABYLON.GUI.Rectangle;

    private nameText: BABYLON.GUI.TextBlock;
    private typeText: BABYLON.GUI.TextBlock;

    private deviceName: string;
    private deviceType: string;

    private size: BABYLON.Vector2 = new BABYLON.Vector2(200, 150);
    private offset: BABYLON.Vector2 = new BABYLON.Vector2(0, 0);

    private values: Map<string, IotDeviceData> = new Map<string, IotDeviceData>();

    public set name(name: string) {
        this.deviceName = name;
        this.nameText.text = this.deviceName;
    }
    public get name() {
        return this.deviceName;
    }

    public set type(type: string) {
        this.deviceType = type;
        this.typeText.text = 'Device: ' + this.deviceType;
    }
    public get type() {
        return this.deviceType;
    }

    public constructor(private guiRoot: BABYLON.GUI.AdvancedDynamicTexture, private mesh: BABYLON.AbstractMesh) {
        this.init();
        this.updateLayout();
    }

    public setDeviceData(deviceData: IotDeviceData) {
        this.values.set(deviceData.type, deviceData);
        this.updateLayout();
    }

    private init() {
        // init main container
        this.contentContainer = new BABYLON.GUI.Rectangle();
        this.contentContainer.color = 'black';
        this.contentContainer.background = new BABYLON.Color4(0, 0, 0, 0.5).toHexString();
        this.contentContainer.width = this.size.x + 'px';
        this.contentContainer.height = this.size.y + 'px';
        this.contentContainer.thickness = 0;
        this.guiRoot.addControl(this.contentContainer);
        this.contentContainer.linkWithMesh(this.mesh);

        // init title container
        this.titleContainer = new BABYLON.GUI.Rectangle();
        this.titleContainer.background = new BABYLON.Color4(255, 255, 255, 0.5).toHexString();
        this.titleContainer.width = 1;
        this.titleContainer.height = '20px';
        this.titleContainer.thickness = 0;
        this.titleContainer.verticalAlignment = BABYLON.GUI.Control.VERTICAL_ALIGNMENT_TOP;
        this.contentContainer.addControl(this.titleContainer);

        // add name to the title container
        this.nameText = this.createTextBox('');
        this.nameText.horizontalAlignment = BABYLON.GUI.Control.HORIZONTAL_ALIGNMENT_CENTER;
        this.nameText.left = '2px';
        this.titleContainer.addControl(this.nameText);

        // add type to the main container
        this.typeText = this.createTextBox('');
        this.typeText.top = '20px';
        this.typeText.left = '5px';
        this.contentContainer.addControl(this.typeText);

        // init values container
        this.valuesContainer = new BABYLON.GUI.Rectangle();
        this.valuesContainer.thickness = 0;
        // this.valuesContainer.alpha = 0;
        this.contentContainer.addControl(this.valuesContainer);
    }

    private updateLayout() {
        // clear values controlls
        this.valuesContainer.children.forEach(child => {
            this.valuesContainer.removeControl(child);
        });

        // add values controlls
        let topOffset = 40;
        this.values.forEach(value => {
            this.contentContainer.addControl(this.createLine(topOffset));

            const dataTypeText = this.createTextBox('Type: ' + value.type);
            dataTypeText.top = topOffset + 'px';
            dataTypeText.left = '5px';
            this.valuesContainer.addControl(dataTypeText);

            const dataValueText = this.createTextBox('Value: ' + value.data);
            dataValueText.top = topOffset + 20 + 'px';
            dataValueText.left = '5px';
            this.valuesContainer.addControl(dataValueText);

            topOffset += 40;
        });

        this.size.y = topOffset;
        this.contentContainer.height = this.size.y + 'px';

        this.contentContainer.linkOffsetX = this.offset.x;
        this.contentContainer.linkOffsetY = this.offset.y;
    }

    private createTextBox(text: string): BABYLON.GUI.TextBlock {
        const dataTypeText = new BABYLON.GUI.TextBlock();
        dataTypeText.color = 'white';
        dataTypeText.fontSize = 14;
        dataTypeText.text = text;
        dataTypeText.resizeToFit = true;
        dataTypeText.fontFamily = 'Segoe UI';
        dataTypeText.height = '20px';
        dataTypeText.verticalAlignment = BABYLON.GUI.Control.VERTICAL_ALIGNMENT_TOP;
        dataTypeText.horizontalAlignment = BABYLON.GUI.Control.HORIZONTAL_ALIGNMENT_LEFT;

        return dataTypeText;
    }

    private createLine(top: number): BABYLON.GUI.Rectangle {
        const lineRect = new BABYLON.GUI.Rectangle();
        lineRect.width = 1;
        lineRect.height = '1px';
        lineRect.background = 'white';
        lineRect.thickness = 0;
        lineRect.top = top + 'px';
        lineRect.verticalAlignment = BABYLON.GUI.Control.VERTICAL_ALIGNMENT_TOP;
        return lineRect;
    }
}
