import { Component, ElementRef, ViewChild } from '@angular/core';
import { OnInit } from '@angular/core/src/metadata/lifecycle_hooks';
import 'babylonjs-gui';
import 'babylonjs-loaders';
import { CustomController } from './models/CustomController';
import { Scene, Engine, SceneLoader } from 'babylonjs';
import { IotDeviceUI } from './models/IotDeviceUI';
import { Vector3, VRExperienceHelper } from 'babylonjs-materials';

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

  ngOnInit(): void {
    const canvas = this.canvasEl.nativeElement;
    const engine = new Engine(canvas, true);

    this.scene = new BABYLON.Scene(engine);
    // this.scene.debugLayer.show();
    const guiRoot = BABYLON.GUI.AdvancedDynamicTexture.CreateFullscreenUI('ui');
    // Add a camera to the scene and attach it to the canvas
    const camera = new BABYLON.FreeCamera('Camera', new BABYLON.Vector3(0, 1, -2), this.scene);
    camera.attachControl(canvas, true);

    // Add lights to the scene
    const light1 = new BABYLON.HemisphericLight('light1', new BABYLON.Vector3(1, 1, 0), this.scene);
    const light2 = new BABYLON.PointLight('light2', new BABYLON.Vector3(0, 0, 0), this.scene);
    light2.position.y += 4;
    // Add and manipulate meshes in the scene
    const sphere = BABYLON.MeshBuilder.CreateSphere('sphere', { diameter: 2 }, this.scene);
    sphere.position.y += 20;
    const ground = BABYLON.MeshBuilder.CreateGround('ground', { width: 50, height: 50 }, this.scene);

    const deviceUI = new IotDeviceUI(guiRoot, sphere);
    deviceUI.name = 'Sphere #1337';
    deviceUI.type = 'Shpere';

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
