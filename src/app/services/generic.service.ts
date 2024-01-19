
import {throwError as observableThrowError,  Observable, of } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { Injectable } from '@angular/core';
import { HttpHeaders, HttpClient } from '@angular/common/http';
import { Constants } from '../util/constants';

import { VisionService } from './vision.service';
import { Layer } from '../entity/layer';
import { Vision } from '../entity/vision';

import { LocalStorage } from '@ngx-pwa/local-storage';
import { LocalStorageService } from './local-storage.service';
import { Filter } from '../entity/filter';


@Injectable()
export class GenericService 
{

  constructor(  
  ) { }

  /**
   * Check if URL is relative and complete with current location.
   * @param url 
   * @returns 
   */
  public static completeRelativeURLWithBaseURL(url: string)
  {
      if(url && url.includes("http"))
      {
          console.debug("Layer Adjust Complete: " + url);
          return url;
      }
     
      let completeURL=Constants.BASE_URL+url;
      console.debug("Layer Adjust From: " + url + " to: " + completeURL);
      return completeURL;        
  }
}
