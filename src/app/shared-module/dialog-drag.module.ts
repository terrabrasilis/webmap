import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DialogDragDirective } from './dialog-drag.directive';

@NgModule({
  imports: [
    CommonModule
  ],
  declarations: [
    DialogDragDirective
  ],
  exports: [
    DialogDragDirective
  ]
})
export class DialogDragModule { }
