import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';




import { DeforestationOptionsComponent } from '../dashboard/deforestation/deforestation-options/deforestation-options.component'

@Injectable()
export class DashboardLoiSearchService {

  lois: Array<Object>;
  panelReference: DeforestationOptionsComponent;

  constructor(private deforestationOptionsComponent: DeforestationOptionsComponent) {
    this.panelReference=deforestationOptionsComponent;
  }

  search(terms: Observable<string>) {
    return terms.debounceTime(400)
      .distinctUntilChanged()
      .switchMap(term => this.searchEntries(term));
  }

  searchEntries(term: any) {
    let results:Array<Object>=new Array();
    function searchInMapElements(element: any) {
      if(element.value.indexOf(term.toUpperCase())>=0) {                
        results.push({key:element.key,value:element.value});
        results = results.sort(function(a:any, b:any) {
                    return ('' + a.value).localeCompare(b.value);
                  });        
      }
    }
    this.lois = this.panelReference.getLoiNames();
    this.lois.forEach(searchInMapElements);
    let observable=Observable.merge(results);
    return observable;
  }
}
