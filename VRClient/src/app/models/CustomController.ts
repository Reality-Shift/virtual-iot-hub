import { AbstractMesh } from 'babylonjs';
import { Mesh, MeshBuilder, Vector3 } from 'babylonjs-loaders';

export class CustomController {

    public attacher: Mesh;

    constructor(
        private body: AbstractMesh,
        private track: AbstractMesh,
        private trigger: AbstractMesh
    ) {
        this.attacher = MeshBuilder.CreateBox('attacher', { size: 0.1 });
        body.parent = this.attacher;
        track.parent = this.attacher;
        trigger.parent = this.attacher;
        setTimeout(() => {
            this.scale(0.003);
            // this.attacher.rotate(Vector3.Forward(), Math.PI);
        }, 500);
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
}
