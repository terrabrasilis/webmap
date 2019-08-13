import { ToolComponent } from "../tool/tool-component-interface";

type ComponentClass = {
    new (): ToolComponent
};

const REGISTRY = new Map<string, Object>();

export function ReturnComponentByName(name: string): any {
    //console.log("Retriving the component: ", name);
    return REGISTRY.get(name);
}

export function RegisterComponent(tc: Object): void {
    let cpc = tc as ComponentClass;
    //console.log("Registering the component: ", cpc);
    REGISTRY.set(cpc.name, cpc);
}