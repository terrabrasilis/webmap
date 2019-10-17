import { Component, OnInit, Input, ViewChild, ElementRef, ChangeDetectorRef } from '@angular/core';
import { OnMount } from '../../core-modules/dynamic-html';
import { ToolComponent } from '../tool-component-interface';
import { MatDialog } from '@angular/material';
import { DomSanitizer } from '@angular/platform-browser';
import { TerrabrasilisApiComponent } from '../terrabrasilis-api/terrabrasilis-api.component';
import { Layer } from '../../entity/layer';

/**
 * LayerDownloadToolComponent
 * <app-layer-download-tool  [shared]="layer"></app-layer-download-tool>
 */
@Component({
  selector: 'app-layer-download-tool',
  template: `
              <dfn attr.data-info="{{ 'tools.download' | translate }}" #innerContent>
                <button type="button" class="btn" *ngIf="layer.downloads.length > 0" (click)="download(layer)"><i class="material-icons md-dark">cloud_download</i></button>
                <ng-content></ng-content>
              </dfn>
            `
})
export class LayerDownloadToolComponent extends ToolComponent implements OnInit, OnMount {  
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

  download(layer:Layer) {
    this.terrabrasilisApi.download(layer);
  }
}
