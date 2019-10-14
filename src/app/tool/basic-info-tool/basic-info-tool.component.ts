import { Component, OnInit, ChangeDetectorRef, Input, ViewChild, ElementRef } from '@angular/core';
import { ToolComponent } from '../tool-component-interface';
import { RegisterComponent } from '../../util/component-decorator';
import { TerrabrasilisApiComponent } from '../terrabrasilis-api/terrabrasilis-api.component';
import { MatDialog } from '@angular/material';
import { DomSanitizer } from '@angular/platform-browser';
import { OnMount } from '../../core-modules/dynamic-html';

/**
 * BasicInfoToolComponent
 * <app-basic-info-tool [shared]="layer"></app-basic-info-tool>
 */
@Component({
  selector: 'app-basic-info-tool',
  template: 
            `
            <dfn attr.data-info="{{ 'tools.basicInfo' | translate }}">
              <button type="button" class="btn" (click)="getBasicLayerInfo(layer)">
                <i class="material-icons md-dark">info</i>
              </button>
            </dfn>
            `  
})
@RegisterComponent
export class BasicInfoToolComponent extends ToolComponent implements OnInit, OnMount {  
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
    //console.log("BasicInfoToolComponent OnInit", this.layer);
  }

  getBasicLayerInfo(layer:any) {
    this.terrabrasilisApi.getBasicLayerInfo(layer);
  }
}
