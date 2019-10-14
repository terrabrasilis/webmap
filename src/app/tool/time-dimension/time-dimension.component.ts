import { Component, OnInit, Input, ViewChild, ElementRef, ChangeDetectorRef } from '@angular/core';
import { Layer } from '../../entity/layer';
import { RegisterComponent } from '../../util/component-decorator';
import { ToolComponent } from '../tool-component-interface';
import { OnMount } from '../../core-modules/dynamic-html';
import { MatDialog } from '@angular/material';
import { DomSanitizer } from '@angular/platform-browser';
import { TerrabrasilisApiComponent } from '../terrabrasilis-api/terrabrasilis-api.component';

/**
 * TimeDimensionComponent
 * <app-time-dimension  [shared]="layer"></app-time-dimension>
 */
@Component({
  selector: 'app-time-dimension',
  template: `
            <dfn attr.data-info="{{ 'tools.timeDimension' | translate }}">
                <button type="button" class="btn" role="button" *ngIf="layer.active && layer.timeDimension" (click)="onOffTimeDimension(layer)">
                  <i class="material-icons md-dark">timer</i>
                </button>
                <ng-content></ng-content>
            </dfn>
            `
})
@RegisterComponent
export class TimeDimensionComponent extends ToolComponent implements OnInit, OnMount {
  layer:Layer;

  @Input() shared: any;  
  @ViewChild('innerContent', {static: true}) innerContent: ElementRef;
  
  dynamicOnMount(attr: Map<string, any>, innerHTML: string, el: any) {
    this.innerContent.nativeElement.innerHTML = innerHTML;    
    this.layer = this.shared;
  }
  
  constructor(private dialog: MatDialog, private dom: DomSanitizer, private cdRef: ChangeDetectorRef) { 
    super();        
  }

  /**
   * TerraBrasilis
   */    
  private terrabrasilisApi: TerrabrasilisApiComponent = new TerrabrasilisApiComponent(this.dialog, this.dom, this.cdRef, null);

  ngOnInit() {    
    this.layer = this.shared;
    //console.log("TimeDimensionComponent OnInit", this.layer);
  }

  /**
   * Enable or disable TimeDimension tool for one layer.
   * @param layer A layer with time dimension available.
   */
  onOffTimeDimension(layer: Layer) {
      // verify if layer is raster or vector type and use it to set aggregate times value.
      this.terrabrasilisApi.onOffTimeDimension(layer);
  }
}