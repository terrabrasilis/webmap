
import {throwError as observableThrowError,  Observable } from 'rxjs';
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';



import { Contact } from "../entity/contact";
import { Constants } from '../util/constants';

const httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json', 'Cache-Control': 'no-cache' })
};

@Injectable()
export class ContactService {

  constructor(private http: HttpClient) { }

  saveContact(contact: Contact): Observable<Contact> {
    console.log(JSON.stringify(contact));
    return this.http.post(Constants.TERRABRASILIS_API_HOST + "contact", JSON.stringify(contact), httpOptions)
      .map(this.extractData)
      .catch(this.handleErrorObservable);
  }

  private extractData(res: Response): any {
    let body = res.json();
    return body || {};
  }
  
  private handleErrorObservable (error: Response | any): any {
    console.error(error.message || error);
    return observableThrowError(error.message || error);
  }
  
}
