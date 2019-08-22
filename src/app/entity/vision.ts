import * as _ from 'lodash';
import { Tool } from './tool';
import { Layer } from './layer';
import { Download } from './datasource';

export class Vision {
    public id = '';
    public name = '';
    public description = '';
    public enabled = false;
    public created = '';
    public hasTranslate = false;
    /**
     * Tools of Vision
     */
    public tools: Tool[] = [];
    /**
     * Layers of Vision
     */
    public layers: Layer[] = [];
    /**
     *  Downloads of Vision
     */
    public downloads: Download[] = [];

    /**
     * UI parameters
     */
    public stackOrder = 0;
    public isOpened = false;

    /**
     *
     * @param {number} stackOrder The project stackOrder is used to compose the layer stackOrder. See notes on updateStackOrder method.
     * @param {boolean} isOpened It is used to control legend display.
     *
     */
    constructor(
        id: string,
        name: string,
        description: string = '',
        enabled: boolean,
        created: string = '',
        tools: Tool[] = [],
        layers: Layer[] = [],
        downloads: Download[] = [],
        hasTranslate: boolean = false,
        stackOrder: number,
        isOpened: boolean = false
    ) {
        // this.id = _.uniqueId();
        this.id = id;
        this.name = name;
        this.description = description;
        this.enabled = enabled;
        this.created = created;
        this.tools = tools;
        this.downloads = downloads;
        this.layers = layers;
        this.stackOrder = stackOrder;
        this.isOpened = isOpened;
        this.hasTranslate = hasTranslate;

        this.sortLayers();
        this.updateStackOrder();
    }

    /**
     * Add one new layer into the list of Layers for the Project.
     * @param layer The new input Layer.
     */
    addLayer(layer: Layer): void {
        layer.stackOrder = this.getNextStackOrderLayer();
        // layer.isRemovable=true;
        // layer.hasTranslate=false;
        this.layers.unshift(layer); // put new layer into first position
        // set new uiorder for all layers based in new position in array
        this.layers.forEach( (l, i) => {
            l.uiOrder = i;
        });
    }

    /**
     * Calculate the next stack order number available.
     */
    getNextStackOrderLayer(): number {
        // Get biggest stack order number
        let biggest = 0;
        this.layers.forEach(layer => {
            if (biggest < layer.stackOrder) {
                biggest = layer.stackOrder;
            }
        });
        // and return the next available
        return (biggest) ? (++biggest) : (this.stackOrder * 100);
    }

    /**
     * Warning: Used only Project is instantiate
     *
     * To sort Layers to display on LayerTreeView.
     * Put the bigger uiOrder values first.
     */
    private sortLayers() {
        this.layers.sort(function(a, b) {
            if (b.uiOrder > a.uiOrder) { return 1; } else { return -1; }
        });
    }

    /**
     * Warning: Used only Project is instantiate
     *
     * Notes about the layer stackOrder values:
     * The stackOrder is used to set the zIndex for each layer when added in Leaflet Map,
     * so the smallest values is displayed below and the biggest values is displayed above of the stacked layers in the Map.
     */
    private updateStackOrder() {
        const self = this;
        this.layers.forEach(function(l) {
            l.stackOrder = Math.abs((self.stackOrder * 100) + (self.layers.length - l.uiOrder));
        });
    }
}
