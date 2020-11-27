
import { Injectable } from '@angular/core';

import { LocalStorageService } from './local-storage.service';
import { Filter } from '../entity/filter';
import { Observable } from 'rxjs';

@Injectable()
export class FilterService 
{
  private layerFilterStorageKey = "layersFilters";

  constructor(
    private localStorageService: LocalStorageService
  ) { }

  public saveLayersFilters(projectId: string, filters: Filter[]) : Observable<any>
  {
    let storageKey = this.getProjectFilterKey(projectId);
    return this.localStorageService.setValue(storageKey, filters);
  }
  public getLayersFilters(projectId: string) : Observable<Filter[]>
  {
    let storageKey = this.getProjectFilterKey(projectId);
    return this.localStorageService.getValue(storageKey);
  }

  private getProjectFilterKey(projectId: string) : string
  {
    let key = projectId + "_" + this.layerFilterStorageKey;
    return key;
  }


  public getFilterListFromJSON(filterListJson: string) : Array<Filter>
  {
    let filterListObj = JSON.parse(filterListJson);

    let filterList = new Array<Filter>();

    filterListObj.value.forEach(filterJSON => {
      let filter = new Filter();
      filter.fromObject(filterJSON);

      filterList.push(filter);
    });
    return filterList;    
  }
}
