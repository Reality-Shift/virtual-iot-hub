import { Component, ElementRef, ViewChild } from '@angular/core';
import { OnInit } from '@angular/core/src/metadata/lifecycle_hooks';
import 'babylonjs-gui';
import 'babylonjs-loaders';
import { Vector2, Vector3 } from 'babylonjs-loaders';
import { CustomController } from './models/CustomController';
import { Scene, Engine, SceneLoader } from 'babylonjs';
import { IotDeviceUI } from './models/IotDeviceUI';
import { VRExperienceHelper } from 'babylonjs-materials';
import * as io from 'socket.io-client';
import { IotDevice } from './models/IotDevice';
import { Thermometr } from './devices/Thermometr';
import { IotDeviceData } from './models/IotDeviceData';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  @ViewChild('canva') canvasEl: ElementRef;
  controllerR: CustomController;
  controllerL: CustomController;
  exp: VRExperienceHelper;
  scene: Scene;
  guiRoot: BABYLON.GUI.AdvancedDynamicTexture;

  devices: Map<string, IotDevice> = new Map<string, IotDevice>();

  ngOnInit(): void {
    const canvas = this.canvasEl.nativeElement;
    const engine = new Engine(canvas, true);

    this.scene = new BABYLON.Scene(engine);
    this.guiRoot = BABYLON.GUI.AdvancedDynamicTexture.CreateFullscreenUI('ui');
    // Add a camera to the scene and attach it to the canvas
    const camera = new BABYLON.FreeCamera('Camera', new BABYLON.Vector3(0, 1, -2), this.scene);
    camera.attachControl(canvas, true);

    const socketConnection = io('http://localhost:1337');

    socketConnection.on('connect', () => {
      console.log('connected');
      socketConnection.on('error', errorData => {
        console.log(errorData);
        console.log('Error: ' + errorData.err);
      });

      socketConnection.emit('login', {
        clientType: 'vr',
        room: 'test'
      });

      socketConnection.on('device_created', data => {
        console.log(data);

        if (data != null && data.name != null) {
          const device = new Thermometr(this.scene, this.guiRoot, data.name, data.type);

          if (data.position != null && data.position.x != null && data.position.y != null && data.position.z != null) {
            device.position = new Vector3(data.position.x, data.position.y, data.position.z);
          }

          this.devices.set(device.name, device);
        }
      });

      socketConnection.on('device_data', data => {
        console.log(data);

        if (data != null && data.name != null && data.type != null) {
          const device = this.devices.get(data.name);
          if (device != null) {
            const deviceData = new IotDeviceData();
            deviceData.deviceName = data.name;
            deviceData.type = data.type;
            deviceData.data = data.data;

            device.deviceUI.setDeviceData(deviceData);
          }
        }
      });

      socketConnection.on('device_deleted', data => {
        if (data != null && data.name != null) {
          this.devices.delete(data.name);
        }
      });
    });

    // Add lights to the scene
    const light1 = new BABYLON.HemisphericLight('light1', new BABYLON.Vector3(1, 1, 0), this.scene);
    const light2 = new BABYLON.PointLight('light2', new BABYLON.Vector3(0, 0, 0), this.scene);
    light2.position.y += 4;
    // Add and manipulate meshes in the scene
    const sphere = BABYLON.MeshBuilder.CreateSphere('sphere', { diameter: 2 }, this.scene);
    sphere.position.y += 20;
    const ground = BABYLON.MeshBuilder.CreateGround('ground', { width: 50, height: 50 }, this.scene);

    this.importControllersMeshes();

    const exp = this.scene.createDefaultVRExperience({ controllerMeshes: false });
    this.exp = exp;

    exp.onEnteringVR.add((E, S) => {
      E.webVRCamera.onControllersAttachedObservable.add(ED => {
        this.controllerL.initFromController(E.webVRCamera.leftController);
        this.controllerR.initFromController(E.webVRCamera.rightController);
      });
    });
    // -------------
    engine.runRenderLoop(() => { // Register a render loop to repeatedly render the scene
      if (this.controllerL) {
        this.controllerL.renderForwardLine();
      }
      if (this.controllerR) {
        this.controllerR.renderForwardLine();
      }
      this.scene.render();
      if (this.controllerL) {
        this.controllerL.disposeLines();
      }
      if (this.controllerR) {
        this.controllerR.disposeLines();
      }
      //  this.controllerR.renderForwardLine();
      // light2.position = camera.position.clone();
    });
    window.addEventListener('resize', () => { // Watch for browser/canvas resize events
      engine.resize();
    });
  }

  private importControllersMeshes() {


    // trigger,trigger,track,track,body,body
    SceneLoader.ImportMesh('', './assets/controllers/', 'controllerR.obj', this.scene, sc => {
      this.controllerR = new CustomController(
        sc.filter(s => s.name === 'trigger')[1],
        sc.filter(s => s.name === 'track')[1],
        sc.filter(s => s.name === 'body')[1],
        sc.filter(s => s.name === 'aim')[1],
        this.scene,
        P => {
          // console.log('try to teleport');
          this.exp.currentVRCamera.position.copyFrom(P.add(new BABYLON.Vector3(0, 4, 0)));
        },
        M => true);
      console.log(sc.map(S => S.name));
      this.controllerR.position.y += 10;
      console.log('success');
    }, fail => console.log(fail));

    SceneLoader.ImportMesh('', './assets/controllers/', 'controllerL.obj', this.scene, sc => {
      this.controllerL = new CustomController(
        sc.filter(s => s.name === 'trigger')[1],
        sc.filter(s => s.name === 'track')[1],
        sc.filter(s => s.name === 'body')[1],
        sc.filter(s => s.name === 'aim')[1],
        this.scene,
        P => {
          // console.log('try to teleport');
          this.exp.currentVRCamera.position.copyFrom(P.add(new BABYLON.Vector3(0, 4, 0)));
        },
        M => true);
      this.controllerL.position.y += 5;
      console.log('success');
    }, fail => console.log(fail));
  }
}
