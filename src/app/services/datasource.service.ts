
import {throwError as observableThrowError,  Observable ,  of } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

import { Constants } from '../util/constants';
import { Datasource } from '../entity/datasource';

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};

@Injectable()
export class DatasourceService {
  private hostApi = Constants.TERRABRASILIS_BUSINESS_API_HOST;

  constructor(
    private http: HttpClient
  ) { }

  /**
   * API: GET datasource/all
   */
  public getAllDatasource(): Observable<Datasource[]> {
    return this.http.get<Datasource[]>(this.hostApi + 'datasource/all')
                    .pipe(
                        map(res => res),
                        catchError(err => observableThrowError(err.message))
                    );
  }

  /**
   * API: GET datasource/{type}/type
   * @param type
   */
  public getAllDatasourceByType(type: string): Observable<Datasource[]> {
    return this.http.get<Datasource[]>(this.hostApi + 'datasource/' + type.toUpperCase() + '/type')
                    .pipe(
                        map(res => res),
                        catchError(err => observableThrowError(err.message))
                    );
  }
}
