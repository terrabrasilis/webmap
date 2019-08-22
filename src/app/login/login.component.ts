import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material';

import { DialogComponent } from '../dialog/dialog.component';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  constructor(private router: Router, public dialog: MatDialog) { }

  username = '';
  password = '';

  ngOnInit() {
  }

  login(): void {
    if (this.username == 'user' && this.password == 'user') {
      this.router.navigate(['user']);
    } else {
      this.dialog.open(DialogComponent, {
        data: { message: 'Invalid Credentials!' }, width : '450px'
      });
    }
  }

  goHome() {
    this.router.navigate(['']);
  }

}
