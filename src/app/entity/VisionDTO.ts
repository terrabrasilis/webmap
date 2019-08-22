import { Vision } from './vision';

export class VisionDTO {
    public id: string;
    public root: Vision;
    public visions: Vision[];

    constructor(
        id: string,
        root: Vision,
        visions: Vision[]
    ) {
        this.id = id;
        this.root = root;
        this.visions = visions;
    }
}
