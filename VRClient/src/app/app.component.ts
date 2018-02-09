import { Component, ElementRef, ViewChild } from '@angular/core';
import { OnInit } from '@angular/core/src/metadata/lifecycle_hooks';
import 'babylonjs-loaders';
import { Engine, FreeCamera, Vector3, Scene, SceneLoader } from 'babylonjs';
import { Vector2 } from 'babylonjs-loaders';
import { CustomController } from './models/CustomController';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  @ViewChild('canva') canvasEl: ElementRef;
  controllerR: CustomController;
  controllerL: CustomController;

  scene: Scene;

  ngOnInit(): void {
    const canvas = this.canvasEl.nativeElement;
    const engine = new Engine(canvas, true);

    const scene = new BABYLON.Scene(engine);
    this.scene = scene;
    // Add a camera to the scene and attach it to the canvas
    const camera = new FreeCamera('Camera', new Vector3(0, 5, 0), scene);
    camera.attachControl(canvas, true);

    // Add lights to the scene
    const light1 = new BABYLON.HemisphericLight('light1', new BABYLON.Vector3(1, 1, 0), scene);
    const light2 = new BABYLON.PointLight('light2', new BABYLON.Vector3(0, 0, 0), scene);
    light2.position.y += 4;
    // Add and manipulate meshes in the scene
    const sphere = BABYLON.MeshBuilder.CreateSphere('sphere', { diameter: 2 }, scene);
    const ground = BABYLON.MeshBuilder.CreateGround('ground', { width: 50, height: 50 }, scene);


    this.importControllersMeshes();

    const exp = scene.createDefaultVRExperience({ controllerMeshes: false });
    // exp.enterVR();
    exp.onEnteringVR.add((E, S) => {
      E.webVRCamera.onControllersAttachedObservable.add(ED => {
        this.controllerL.initFromController(E.webVRCamera.leftController);
        this.controllerR.initFromController(E.webVRCamera.rightController);
      });
    });
    // -------------
    engine.runRenderLoop(function () { // Register a render loop to repeatedly render the scene
      scene.render();
      // light2.position = camera.position.clone();
    });
    window.addEventListener('resize', function () { // Watch for browser/canvas resize events
      engine.resize();
    });
  }

  private importControllersMeshes() {
    SceneLoader.ImportMesh('', './assets/controllers/', 'controllerR.obj', this.scene, sc => {
      this.controllerR = new CustomController(sc[1], sc[3], sc[5]);
      console.log(sc.map(S => S.name));
      this.controllerR.position.y += 10;
      console.log('success');
    }, fail => console.log(fail));

    SceneLoader.ImportMesh('', './assets/controllers/', 'controllerL.obj', this.scene, sc => {
      this.controllerL = new CustomController(sc[1], sc[3], sc[5]);
      this.controllerL.position.y += 5;
      console.log('success');
    }, fail => console.log(fail));
  }
}
