export class Tool {
    public id: string;
	public name: string;
	public description: string;
	public tag: string;
	public target: string;
	public enabled: boolean;
    public created: string;

    public toolInstance: any;

    constructor() {}

    addTarget(target: string) {
        this.target = target;
        return this;
    }

    // createComponent(layer:Layer): void {
    //     //console.log(this.vc);
    //     const factory = this.resolver.resolveComponentFactory(ReturnComponentByName(this.tag));
    //     console.log(factory);
    //     const componentRef = this.vc.createComponent(factory);
    //     (<ToolComponent>componentRef.instance).layer = layer;
    //     componentRef.changeDetectorRef.detectChanges();

    //     console.log(componentRef.instance);
    // }
}
