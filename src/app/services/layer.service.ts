
import {throwError as observableThrowError,  Observable, of } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { Injectable } from '@angular/core';
import { HttpHeaders, HttpClient } from '@angular/common/http';
import { Constants } from '../util/constants';

import { VisionService } from '../services/vision.service';
import { Layer } from '../entity/layer';
import { Vision } from '../entity/vision';

import { LocalStorage } from '@ngx-pwa/local-storage';
import { LocalStorageService } from './local-storage.service';
import { Filter } from '../entity/filter';

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
    private visionService: VisionService,
    private localStorageService: LocalStorageService
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

  public static getLayerBaseURL(layer:Layer)
  {
    //Fill with workspace on URL
    let url = layer.datasource.host;
    if(layer.datasource.host.includes(layer.workspace))
    {
      url = url.replace(layer.workspace+"/", "");
    }    
    if(layer.datasource.host.includes(layer.name))
    {      
      url = url.replace(layer.name+"/", "");
    }
    else
    {
      url = url.replace('ows', layer.workspace + '/' + layer.name + '/ows');
      return url;
    }
  }

    /**
   * Get only layers with time dimension
   */
  public static getLayersWithTimeDimension(layers: Array<Layer>): Array<Layer> {
    let dimensionLayers = new Array<Layer>();
    layers.forEach(layer => {
      if(layer.timeDimension)
      {
        dimensionLayers.push(layer);
      }
    });
    return dimensionLayers;
  }



}
