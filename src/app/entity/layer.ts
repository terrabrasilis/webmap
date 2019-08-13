import * as _ from 'lodash';
import { Subdomain } from './subdomain';
import { Tool } from './tool';
import { Datasource, Download } from './datasource';

/**
 * Layer define the parameters to mount automatically the layers (Baselayer and Overlayer)
 */
export class Layer {
    id: string = "";
    name: string = "";
    title: string = "";
    description: string = "";
    attribution: string = "";
    workspace: string = "";
    capabilitiesUrl: string = "";
    opacity: number = 0.9;
    baselayer: boolean = false;
    active: boolean = false;
    enable: boolean = false;
    created: string = "";
    timeDimension: boolean = false;

    datasource: Datasource = null;
    tools: Tool[] = [];
    subdomains: Subdomain[] = [];
    downloads: Download[] = [];
    
    metadata: string = null;
    dashboard: string = null;
    thirdHost: string = "";
    
    /**
     * UI Controllers
     */
    uiOrder: number = 0;
    stackOrder: number = 0;    
    isRemovable: boolean = false;
    hasTranslate: boolean = false;
    isAggregatable: boolean = false;

    constructor(id:string){
        this.id = id;
    }
    
    // addId(id:string) {
    //     this.id = id;
    //     return this;
    // }

    addTitle(title:string) {
        this.title = title;
        return this;
    }

    addName(name:string) {
        this.name = name;
        return this;
    }

    addDescription(description:string) {
        this.description = description;
        return this;
    }

    addAttribution(attribution:string) {
        this.attribution = attribution;
        return this;
    }

    addWorkspace(workspace:string) {
        this.workspace = workspace;
        return this;
    }

    addCapabilitiesUrl(capabilitiesUrl:string) {
        this.capabilitiesUrl = capabilitiesUrl;
        return this;
    }

    addOpacity(opacity:number) {
        this.opacity = opacity;
        return this;
    }

    isBaselayer(baselayer:boolean) {
        this.baselayer = baselayer;
        return this;
    }

    isActive(active:boolean) {
        this.active = active;
        return this;
    }

    isEnable(enable:boolean) {
        this.enable = enable;
        return this;
    }

    addCreated(created:string) {
        this.created = created;
        return this;
    }

    addDatasource(datasource:Datasource) {
        this.datasource = datasource;
        return this;
    }

    addSubdomains(subdomains:Subdomain[]) {
        this.subdomains = subdomains;
        return this;
    }

    addDownloads(downloads:Download[]) {
        this.downloads = downloads;
        return this;
    }

    addTools(tools:Tool[]) {
        this.tools = tools;
        return this;
    }

    addMetadata(metadata:string) {
        this.metadata = metadata;
        return this;
    }

    addDashboardUrl(dashboard:string) {
        this.dashboard = dashboard;
        return this;
    }

    addThirdHost(thirdHost:string) {
        this.thirdHost = thirdHost;
        return this;
    }

    addStackOrder(stackOrder:number) {
        this.stackOrder = stackOrder;
        this.uiOrder = stackOrder;
        return this;
    }

    isTranslatable(hasTranslate:boolean) {
        this.hasTranslate = hasTranslate;
        return this;
    }

    typeOfData(isAggregatable:boolean) {
        this.isAggregatable = isAggregatable;
        return this;
    }

    isTimeDimension(hasTimeDimension:boolean) {
        this.timeDimension = hasTimeDimension;
        return this;
    }

    willRemove(isRemovable: boolean) {
        this.isRemovable = isRemovable;
        return this;
    }

    convertToJson(layer:Layer): string {
        return JSON.stringify(layer);
    } 

    public static of(l: any): Layer {
        return new Layer(l.id)
                    .addName(l.name)
                    .addTitle(l.title)
                    .addWorkspace(l.workspace)
                    .addCapabilitiesUrl(l.capabilitiesUrl)
                    .addOpacity(0.9)
                    .addDatasource(l.datasource)                    
                    .addTools(l.tools)
                    .isBaselayer(l.baselayer)
                    .isActive(l.active)
                    .isEnable(l.enabled)        
                    .isTranslatable(true)
                    .isTimeDimension(l.timeDimension)
                    .typeOfData(l.aggregatable)
                    .addStackOrder(l.stackOrder)
                    .isTranslatable(l.hasTranslate);
    }
}