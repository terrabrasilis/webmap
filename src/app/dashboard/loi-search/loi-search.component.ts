import { Component, OnInit } from '@angular/core';
import { DashboardLoiSearchService } from '../../services/dashboard-loi-search.service';
import { Subject } from 'rxjs';
import { DeforestationOptionsComponent } from '../deforestation/deforestation-options/deforestation-options.component'

/* Translate */
import { TranslateService } from '@ngx-translate/core';
import { LocalStorageService } from '../../services/local-storage.service';

@Component({
  selector: 'app-loi-search',
  templateUrl: './loi-search.component.html',
  styleUrls: ['./loi-search.component.css'],
  providers: [ DashboardLoiSearchService ]
})

export class LoiSearchComponent implements OnInit {

  results: Array<Object> = new Array();
  searchTerm$: Subject<string> = new Subject<string>();
  panelReference: DeforestationOptionsComponent;
  

  /* Variável que recebe o valor da função handleFilterChange */
  private filterString: Subject<string> = new Subject<string>();
  private searchSubscription: any;
  public loi:any;
  private languageKey: string = "translate";
  
  constructor(private deforestationOptionsComponent: DeforestationOptionsComponent,
    private searchService: DashboardLoiSearchService,
    private _translate: TranslateService,
    private localStorageService: LocalStorageService) {

    this.panelReference=deforestationOptionsComponent;
    
  }

  
  /**
   * Called when new term is typed.
   * Term is putting into Subject.
   * The result is cleaned. 
   * In first time we subscribe the search service.
   * 
   * @param term The typed term.
   */
  handleFilterChange(term: string) {
    this.results = new Array();
    if(!this.searchSubscription || this.searchSubscription.closed){
    
      this.searchSubscription=this.searchService.search(this.filterString)
        .subscribe(results => {
          this.results.push(results);
        });
    }
    this.filterString.next(term);
  }
  
  ngOnInit() {
  }

  /**
   * Apply the filter on enabled charts.
   * @param key The selected item on the list of found LOIs
   */
  filterByLoi(key:number) {    
    if(!$('#'+key+'_item').hasClass('active')){
      $('#'+key+'_item').addClass('active');
    }else{
      $('#'+key+'_item').removeClass('active');
    }

    this.panelReference.filterByLoi(key);
  }

  updateLoi() {
    this.loi = this.panelReference.selectedLoi;
  }

  changeLanguage(value:string) {
    this.localStorageService.setValue(this.languageKey, value);      
    this._translate.use(value);    
  }

}
