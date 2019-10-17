import { Component, OnInit, ChangeDetectorRef, ViewContainerRef, ViewChild, Input, ElementRef } from '@angular/core';
import { ToolComponent } from '../tool-component-interface';
import { RegisterComponent } from '../../util/component-decorator';
import { TerrabrasilisApiComponent } from '../terrabrasilis-api/terrabrasilis-api.component';
import { MatDialog } from '@angular/material';
import { DomSanitizer } from '@angular/platform-browser';
import { Layer } from '../../entity/layer';
import { OnMount } from '../../core-modules/dynamic-html';

/**
 * TransparencyToolComponent
 * <app-transparency-tool  [shared]="layer"></app-transparency-tool>
 */
@Component({
  selector: 'app-transparency-tool',
  template: 
            `
            <dfn attr.data-info="{{ 'tools.transparency' | translate }}" #innerContent>    
                <button class="btn" type="button" data-toggle="collapse" attr.href="#{{(layer.name | cleanWhiteSpace) + '_opacity'}}" 
                    role="button" aria-expanded="false" attr.aria-controls="{{(layer.name | cleanWhiteSpace) + '_opacity'}}">
                        <i class="material-icons md-dark">brightness_6</i>
                </button>
            </dfn>             
            <!-- opacity -->          
            <div class="collapse" id="{{(layer.name | cleanWhiteSpace) + '_opacity'}}">                    
                <div class="card card-body card-opacity">
                    <div class="budget-wrap">                        
                        <mat-slider color="primary" pressed thumbLabel tickInterval="0.1" [max]="max" [min]="min" [step]="step" value="{{layer.opacity}}" (input)="layerOpacity(layer, $event)"></mat-slider>
                    </div>
                </div>                    
            </div>  
            <ng-content></ng-content> 
            <!-- end -->  
            `
})
@RegisterComponent
export class TransparencyToolComponent extends ToolComponent implements OnInit, OnMount {  
    layer:Layer;
    
    @Input() shared: any;  
    @ViewChild('innerContent', {static: true}) innerContent: ElementRef;
    
    dynamicOnMount(attr: Map<string, any>, innerHTML: string, el: any) {
        this.innerContent.nativeElement.innerHTML = innerHTML;    
        this.layer = this.shared;           
    }
    
    /**
     * Slider value
     */
    public value: number = 0.1;
    public max = 1;
    public min = 0;
    public step = 0.1;
    
    constructor(private dialog: MatDialog, private dom: DomSanitizer, private cdRef: ChangeDetectorRef) {   
        super();
    }

    /**
     * TerraBrasilis
     */    
    private terrabrasilisApi: TerrabrasilisApiComponent = new TerrabrasilisApiComponent(this.dialog, this.dom, this.cdRef, null);

    ngOnInit() {
        this.layer = this.shared;
        //console.log("TransparencyToolComponent OnInit", this.layer);
    }

    layerOpacity(layerObject:any, event:any) {        
        this.terrabrasilisApi.layerOpacity(layerObject, event);
    }
}
