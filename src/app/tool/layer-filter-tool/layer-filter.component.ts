import { Component, OnInit } from '@angular/core';
import { MatDialogRef, MatDialog } from '@angular/material';
import { FormBuilder, FormControl, Validators } from '@angular/forms';
import { DomSanitizer } from '@angular/platform-browser';

import { DialogComponent } from '../../dialog/dialog.component';

@Component({
  selector: 'layer-filter',
  templateUrl: './layer-filter.component.html',
  styleUrls: ['./layer-filter.component.css']
})

export class LayerFilterComponent implements OnInit {

  constructor(
    private dialogRef: MatDialogRef <LayerFilterComponent> , private dom: DomSanitizer, private dialog: MatDialog) {}

  ngOnInit() {}

  sendLayerFilter(value: any): void {
    this.dialogRef.close();
  }

  closeDialog() {
    this.dialogRef.close();
  }

  showDialog(content: string): void {
    const dialogRef = this.dialog.open(DialogComponent, { width: '450px' });
    dialogRef.componentInstance.content = this.dom.bypassSecurityTrustHtml(content);
  }
}
