import { AbstractMesh, CustomMaterial, Scene, Color3, Ray } from 'babylonjs';
import { Mesh, MeshBuilder, Vector3, WebVRController, Vector2, LinesMesh } from 'babylonjs-loaders';
import 'babylonjs-materials';
import { PickingInfo } from 'babylonjs-materials';

export class CustomController {

    public attacher: Mesh;
    private lines: LinesMesh;
    private raySph: Mesh;
    private raySph2: Mesh;
    private pressed = false;
    constructor(
        private trigger: AbstractMesh,
        private track: AbstractMesh,
        private body: AbstractMesh,
        private aim: AbstractMesh,
        private scene: Scene,
        private teleportFunc: any
    ) {
        this.attacher = MeshBuilder.CreateBox('attacher', { size: 0.1 });
        body.parent = this.attacher;
        track.parent = this.attacher;
        trigger.parent = this.attacher;
        aim.parent = this.attacher;
        setTimeout(() => {
            this.scale(0.003);
            // this.attacher.rotate(Vector3.Forward(), Math.PI);
        }, 500);
        this.lines = BABYLON.MeshBuilder.CreateLines('lines', {
            points: [Vector3.Zero(), Vector3.Up()],
            updatable: true, instance: this.lines
        });
        this.lines.color = Color3.Red();

        // ---------

        const sph = MeshBuilder.CreateSphere('reycastSph', { segments: 10, diameter: 5 }, scene);
        const raySph2 = MeshBuilder.CreateSphere('reycastSph', { segments: 10, diameter: 5 }, scene);
        sph.parent = this.attacher;
        raySph2.parent = this.attacher;
        sph.position.z -= 25;
        raySph2.position.z -= 40;
        this.raySph = sph;
        this.raySph2 = raySph2;
    }
    public scale(scale: number): void {
        this.attacher.scaling = this.attacher.scaling.scale(scale);
    }

    public get position(): Vector3 {
        return this.attacher.position;
    }

    public set position(position: Vector3) {
        this.attacher.position = position;
    }

    public initFromController(controller: WebVRController): void {
        controller.attachToMesh(this.attacher);
        controller.onTriggerStateChangedObservable.add((ED, ES) => {
            this.trigger.position.z = ED.value * 5;
        });
        controller.onButtonStateChange((CI, BI, State) => {
            if (BI === 4 && State.pressed) {
                this.pressed = true;
            }
            if (BI === 4 && !State.pressed && this.pressed) {
                this.pressed = false;
                this.teleport();
            }
        });
    }

    teleport() {
        const hit = this.getHit();
        if (hit.hit) {
            this.teleportFunc(hit.pickedPoint);
        }
    }
    getHit(): PickingInfo {
        const direction = this.raySph2.absolutePosition.subtract(this.raySph.absolutePosition);
        const ray = new Ray(this.raySph2.absolutePosition, direction);
        return this.scene.pickWithRay(ray, m => m.name !== 'reycastSph');
    }
    renderForwardLine(): void {
        if (!this.pressed) {
            this.lines = BABYLON.MeshBuilder.CreateLines('lines', {
                points: [this.raySph.absolutePosition, this.raySph2.absolutePosition],
                updatable: true, instance: this.lines
            });
            return;
        }
        const hit = this.getHit();
        if (hit.hit) {
            this.lines = BABYLON.MeshBuilder.CreateLines('lines', {
                points: [this.raySph.absolutePosition, hit.pickedPoint],
                updatable: true, instance: this.lines
            });
        } else {
            this.lines = BABYLON.MeshBuilder.CreateLines('lines', {
                points: [this.raySph.absolutePosition, this.raySph2.absolutePosition],
                updatable: true, instance: this.lines
            });
        }
    }
}
