import {
  Component,
  OnInit,
  Input,
  ViewChild,
  ElementRef,
  ChangeDetectorRef
} from '@angular/core'
import { Layer } from '../../entity/layer'
import { RegisterComponent } from '../../util/component-decorator'
import { ToolComponent } from '../tool-component-interface'
import { OnMount } from '../../core-modules/dynamic-html'
import { MatDialog } from '@angular/material'
import { DomSanitizer } from '@angular/platform-browser'
import { LayerFilterComponent } from './layer-filter.component'



/**
 * LayerFilterToolComponent
 * <layer-filter-tool  [shared]="layer"></layer-filter-tool>
 */
@Component({
  selector: 'layer-filter-tool',
  template: `
    <dfn attr.data-info="{{ 'tools.layerFilter' | translate }}" #innerContent>
      <button
        type="button"
        class="btn"
        *ngIf="layer !== null"
        (click)="showDialog(layer)"
      >
        <i class="material-icons md-dark ">filter_list</i>
      </button>
      <ng-content></ng-content>
    </dfn>
  `
})
@RegisterComponent
export class LayerFilterToolComponent extends ToolComponent
  implements OnInit, OnMount {
  layer: Layer

  

  @Input() shared: any
  @ViewChild('innerContent', { static: true }) innerContent: ElementRef

  dynamicOnMount(attr: Map<string, any>, innerHTML: string, el: any) {
    this.innerContent.nativeElement.innerHTML = innerHTML
    this.layer = this.shared
  }

  constructor(
    private dialog: MatDialog,
    private dom: DomSanitizer,
    private cdRef: ChangeDetectorRef
    ) {
    super()
  }

  /**
   * TerraBrasilis
   */

  ngOnInit() {
    this.layer = this.shared
    
  }

  showDialog() {
    this.cdRef.detectChanges()
    this.dialog.open(LayerFilterComponent, {
      width: '450px',
      data: { layer: this.layer }
    });
    
  }

}
