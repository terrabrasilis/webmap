import { Component, OnInit } from '@angular/core';
import { MatDialogRef, MatDialog } from '@angular/material';
import { FormBuilder, FormControl, Validators } from '@angular/forms';
import { DomSanitizer } from '@angular/platform-browser';

import { Contact } from '../entity/contact';
import { ContactService } from '../services/contact.service';
import { DialogComponent } from '../dialog/dialog.component';

@Component({
  selector: 'app-contact',
  templateUrl: './contact.component.html',
  styleUrls: ['./contact.component.css']
})
/**
 * https://angular-templates.io/tutorials/about/angular-forms-and-validations
 */
export class ContactComponent implements OnInit {

  constructor(
    private dialogRef: MatDialogRef<ContactComponent>
    , private fb: FormBuilder
    , private contactService: ContactService
    , private dom: DomSanitizer
    , private dialog: MatDialog) { }

  contactForm = this.fb.group({
      name:         new FormControl(null, Validators.required),
      lastname:     new FormControl(null, Validators.required),
      organization: new FormControl(null),
      email:        new FormControl(null, Validators.compose([
                      Validators.required,
                      Validators.pattern('^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+.[a-zA-Z0-9-.]+$')
                    ])),
      message:      new FormControl(null, Validators.required),
    });

  contact_validation_messages = {
      // 'name': [
      //   { type: 'required', message: 'Username is required' },
      //   { type: 'minlength', message: 'Username must be at least 5 characters long' },
      //   { type: 'maxlength', message: 'Username cannot be more than 25 characters long' },
      //   { type: 'pattern', message: 'Your username must contain only numbers and letters' },
      //   { type: 'validUsername', message: 'Your username has already been taken' }
      // ],
      email: [
        { type: 'required', message: 'Email is required' },
        { type: 'pattern', message: 'Enter a valid email' }
      ]
  };

  ngOnInit() {

  }

  sendContact(value: any): void {
    this.contactService.saveContact(new Contact(
      value.name,
      value.lastname,
      value.organization,
      value.email,
      value.message
    )).subscribe(response => {
      console.log(response);
      // this.showDialog("Inserido com sucesso.");
    }, error => {
      console.log(error);
    });

    this.dialogRef.close();
  }

  closeDialog() {
    this.dialogRef.close();
  }

  showDialog(content: string): void {
    const dialogRef = this.dialog.open(DialogComponent, { width : '450px' });
    dialogRef.componentInstance.content = this.dom.bypassSecurityTrustHtml(content);
  }
}
