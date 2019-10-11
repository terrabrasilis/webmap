import { Component, OnInit, ChangeDetectorRef, Input, ViewChild, ElementRef } from '@angular/core';
import { ToolComponent } from '../tool-component-interface';
import { OnMount } from '../../core-modules/dynamic-html';
import { TerrabrasilisApiComponent } from '../terrabrasilis-api/terrabrasilis-api.component';
import { MatDialog } from '@angular/material';
import { DomSanitizer } from '@angular/platform-browser';
import { Layer } from '../../entity/layer';

/**
 * LayerLegendToolComponent
 * <app-layer-legend-tool  [shared]="layer"></app-layer-legend-tool>
 */
@Component({
  selector: 'app-layer-legend-tool',
  template: `
                <dfn attr.data-info="{{ 'tools.legend' | translate }}" #innerContent>
                  <button type="button" class="btn" (click)="showDialog(layer)"><i class="material-icons md-dark ">image</i></button>
                  <ng-content></ng-content>
                </dfn> 
               `
})
export class LayerLegendToolComponent extends ToolComponent implements OnInit, OnMount {
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
  }

  showDialog(layer:Layer): void {
    this.terrabrasilisApi.getLegend(layer, true).then((imgTag)=> {
      this.terrabrasilisApi.showDialog(imgTag)
    })
  }
}
