import { Injectable } from '@angular/core';
import { Response } from '@angular/http';
import { HttpClient } from '@angular/common/http';


import { catchError, map } from 'rxjs/operators';
import { Observable ,  of } from 'rxjs';

import { Constants } from '../util/constants';

@Injectable()
export class WmsCapabilitiesProviderService {

  private proxy: string;

  constructor(private http: HttpClient) {
    this.proxy = Constants.PROXY_OGC;
  }

  getCapabilities(base_url: string) {
    let url = base_url + '?REQUEST=GetCapabilities&SERVICE=WMS&VERSION=1.3.0';
    url = this.proxy + encodeURIComponent(url);

    // console.log(url);

    return this.http.get(url, {
      observe: 'response',
      responseType: 'text'
     }).pipe(
        map(response => response),
        catchError(this.handleError())
      );
  }

  /**
   * Handle Http operation that failed.
   * Let the app continue.
   * @param operation - name of the operation that failed
   * @param result - optional value to return as the observable result
   */
  private handleError<T>() {
    return (error: any): Observable<any> => {
      // Let the app keep running by returning an empty result.
      // return of(result as T);
      return of(error as any);
    };
  }

}
