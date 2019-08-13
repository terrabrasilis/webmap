import { Component, OnInit, Input, ViewChild, ElementRef } from '@angular/core';
import { ToolComponent } from '../tool-component-interface';
import { OnMount } from '../../core-modules/dynamic-html';
import { OpenUrl } from '../../util/open-url';

/**
 * LayerMetadataToolComponent
 * <app-layer-metadata-tool  [shared]="layer"></app-layer-metadata-tool>
 */
@Component({
  selector: 'app-layer-metadata-tool',
  template: `
              <dfn attr.data-info="{{ 'tools.metadata' | translate }}" #innerContent>
                <button type="button" class="btn" *ngIf="layer.metadata != null" (click)="goTo(layer.metadata)"><i class="material-icons md-dark ">assignment</i></button>
                <ng-content></ng-content>
              </dfn>
            `
})
export class LayerMetadataToolComponent extends ToolComponent implements OnInit, OnMount, OpenUrl {
  @Input() shared: any;  
  @ViewChild('innerContent', {static: true}) innerContent: ElementRef;

  dynamicOnMount(attr: Map<string, any>, innerHTML: string, el: any) {
    this.innerContent.nativeElement.innerHTML = innerHTML;    
    this.layer = this.shared;           
  }

  constructor() { 
    super();
  }

  ngOnInit() {
    this.layer = this.shared;
  }

  goTo(url:string) {        
    window.open(url, "_blank");
  }
}
