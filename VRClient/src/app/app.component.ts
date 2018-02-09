import { Component, ElementRef, ViewChild } from '@angular/core';
import { OnInit } from '@angular/core/src/metadata/lifecycle_hooks';
import { Engine, Vector2 } from 'babylonjs';
import 'babylonjs-gui';
import { IotDeviceUI } from './models/IotDeviceUI';
import { DeviceValueData } from './models/DeviceValueData';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  @ViewChild('canva') canvasEl: ElementRef;


  ngOnInit(): void {
    const canvas = this.canvasEl.nativeElement;
    const engine = new Engine(canvas, true);

    const scene = new BABYLON.Scene(engine);
    scene.debugLayer.show();

    const guiRoot = BABYLON.GUI.AdvancedDynamicTexture.CreateFullscreenUI('ui');


    // Add a camera to the scene and attach it to the canvas
    const camera = new BABYLON.FreeCamera('Camera', new BABYLON.Vector3(0, 1, -2), scene);
    camera.attachControl(canvas, true);

    // Add lights to the scene
    const light1 = new BABYLON.HemisphericLight('light1', new BABYLON.Vector3(1, 1, 0), scene);
    const light2 = new BABYLON.PointLight('light2', new BABYLON.Vector3(0, 1, -1), scene);


    // Add and manipulate meshes in the scene
    const sphere = BABYLON.MeshBuilder.CreateSphere('sphere', { diameter: 2 }, scene);

    const deviceUI = new IotDeviceUI(guiRoot, sphere);
    deviceUI.name = 'Sphere #1337';
    deviceUI.type = 'Shpere';

    const testValues = new DeviceValueData();
    testValues.type = 'rotation';
    testValues.data = 123;

    deviceUI.setDeviceData(testValues);

    const anotherValues = new DeviceValueData();
    anotherValues.type = 'position';
    anotherValues.data = '1, 2, 0';
    deviceUI.setDeviceData(anotherValues);

    // -------------
    engine.runRenderLoop(function () { // Register a render loop to repeatedly render the scene
      scene.render();
    });
    window.addEventListener('resize', function () { // Watch for browser/canvas resize events
      engine.resize();
    });
  }


}
