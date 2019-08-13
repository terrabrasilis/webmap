import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material';

@Component({
  selector: 'app-about',
  templateUrl: './about.component.html',
  styleUrls: ['./about.component.css']
})
export class AboutComponent implements OnInit {

  imgPath:string=( process.env.ENV === 'production' )?('/app/'):('');

  constructor(private dialogRef: MatDialogRef<AboutComponent>) { }

  ngOnInit() {
  }

  closeDialog() {
    this.dialogRef.close();
  }
}
