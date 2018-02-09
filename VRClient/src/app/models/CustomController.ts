import { AbstractMesh } from 'babylonjs';
import { Mesh, MeshBuilder, Vector3, WebVRController, Vector2, LinesMesh } from 'babylonjs-loaders';

export class CustomController {

    public attacher: Mesh;
    private lines: LinesMesh;

    constructor(
        private trigger: AbstractMesh,
        private track: AbstractMesh,
        private body: AbstractMesh,
        private aim: AbstractMesh
    ) {
        this.attacher = MeshBuilder.CreateBox('attacher', { size: 0.1 });
        body.parent = this.attacher;
        track.parent = this.attacher;
        trigger.parent = this.attacher;
        setTimeout(() => {
            this.scale(0.003);
            // this.attacher.rotate(Vector3.Forward(), Math.PI);
        }, 500);
        this.lines = BABYLON.MeshBuilder.CreateLines('lines', {
            points: [Vector3.Zero(), Vector3.Up()],
            updatable: true, instance: this.lines
        });
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
    }

    renderForwardLine(): void {
        // this.lines = BABYLON.MeshBuilder.CreateLines('lines', {
        //     points: [this., Vector3.Up()],
        //     updatable: true, instance: this.lines
        // });
    }
}
