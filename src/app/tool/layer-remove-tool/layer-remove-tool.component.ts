import { Component, OnInit, Input, ViewChild, ElementRef, ChangeDetectorRef } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { MatDialog } from '@angular/material';
import { TerrabrasilisApiComponent } from '../terrabrasilis-api/terrabrasilis-api.component';
import { OnMount } from '../../core-modules/dynamic-html';
import { ToolComponent } from '../tool-component-interface';
import { Layer } from '../../entity/layer';

/**
 * LayerRemoveToolComponent
 * <app-layer-remove-tool  [shared]="layer"></app-layer-remove-tool>
 */
@Component({
  selector: 'app-layer-remove-tool',
  template: `
              <dfn attr.data-info="{{ 'tools.removeLayer' | translate }}" #innerContent>
                <button type="button" class="btn" *ngIf="layer.isRemovable" (click)="removeLayer(layer, project)"><i class="material-icons md-dark">delete</i></button>
                <ng-content></ng-content>
              </dfn>  
            `
})
export class LayerRemoveToolComponent extends ToolComponent implements OnInit, OnMount {

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
  public project:any;

  ngOnInit() {    
    this.layer = this.shared;
  }

  removeLayer(layer: Layer, project:any) {
    console.log("Removing: ", layer);
  }
}
