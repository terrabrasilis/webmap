
import {throwError as observableThrowError,  Observable, of } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { Injectable } from '@angular/core';
import { HttpHeaders, HttpClient } from '@angular/common/http';
import { Constants } from '../util/constants';

import { VisionService } from '../services/vision.service';
import { Layer } from '../entity/layer';
import { Vision } from '../entity/vision';

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};

@Injectable()
export class LayerService {
  private hostApi = Constants.TERRABRASILIS_BUSINESS_API_HOST;
  private baselayers: Array<Layer> = new Array();
  private overlayers: Array<Vision> = new Array();

  constructor(
    private http:HttpClient,
    private visionService: VisionService  
  ) { }

  /**
   * GET: get info to layer from infoUrl
   * @param infoUrl 
   */
  public getLayerInfo(infoUrl: string): Observable<any> {
    return of(this.http.get(infoUrl));
  }

  /**
   * GET: get the legend image from legend service to layer from legendUrl
   * @param legendUrl 
   */
  public getLegend(legendUrl: string): Observable<Blob> {
      return this.http.get(legendUrl, { responseType: 'blob' });
  }

  /**
   * API: GET layer/all
   */
   public getLayers(): Observable<any> {
    return this.http.get(this.hostApi + "layer/all")
    .pipe(                    
      map(res => res),
      catchError(err=> observableThrowError(err.message))
    )
  }

  public getAllVisionLayersAndBaselayers(name: string): Observable<any> {
    return this.getVisionAndAllRelationshipmentByName(name);
  }

  private getVisionAndAllRelationshipmentByName(name:string): Observable<any> {
    return this.visionService.getVisionAndAllRelationshipmentByName(name);      
  }
}
