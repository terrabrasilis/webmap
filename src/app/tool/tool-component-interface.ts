import { Layer } from "../entity/layer";
import { Component } from "@angular/core";

/**
 * https://angular.io/guide/dynamic-component-loader
 */
@Component({
    selector: 'tool-component',
    template: ``
})
export class ToolComponent {
    layer:Layer;
    context: any;
}