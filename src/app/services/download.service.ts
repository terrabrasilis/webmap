import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

const httpOptions = {
  headers: new HttpHeaders({
    'Content-Type': 'application/zip'
    , 'Accept': 'application/zip'    
  })
};

@Injectable()
export class DownloadService {

  constructor(private http: HttpClient) { }

  download(link:string): Observable<any> {
    return this.http.get(link, httpOptions);
  }
}
