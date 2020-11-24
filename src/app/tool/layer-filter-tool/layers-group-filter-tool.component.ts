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
import { Vision } from 'src/app/entity/vision'



/**
 * LayersGroupFilterToolComponent
 * <layer-group-filter-tool  [shared]="project"></layer-filter-tool>
 */
@Component({
  selector: 'layers-group-filter-tool',
  template: `
  <dfn attr.data-info="{{ 'tools.layersGroupFilter' | translate }}">
    <button
      type="button"
      class="group-filter-button"
      id="filter-button-{{ project.id }}"
      (click)="showGroupFilterDialog()">
      <i class="material-icons md-white group-filter">filter_list</i>
    </button>
  </dfn>
  `
})
@RegisterComponent
export class LayersGroupFilterToolComponent extends ToolComponent
  implements OnInit, OnMount {
    

  @Input() project: Vision
  @ViewChild('innerContent', { static: true }) innerContent: ElementRef

  dynamicOnMount(attr: Map<string, any>, innerHTML: string, el: any) {
    this.innerContent.nativeElement.innerHTML = innerHTML
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
    
  }

  showGroupFilterDialog() {
    
    this.cdRef.detectChanges()
    this.dialog.open(LayerFilterComponent, {
      width: '450px',
      data: { layers: this.project.layers }
    });
    
  }

}
