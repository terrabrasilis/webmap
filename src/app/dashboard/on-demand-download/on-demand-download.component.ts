import {  Component, 
          OnInit } from '@angular/core';

import {  HttpClient, 
          HttpHeaders, 
          HttpParams } from '@angular/common/http';

import {  ISubscription } from "rxjs/Subscription";

import {  Observable  } from 'rxjs/Observable';

import {  forkJoin  } from "rxjs/observable/forkJoin";

import { DashboardApiProviderService } from '../../services/dashboard-api-provider.service';

import { DeforestationOptionsUtils } from '../../util/deforestation-options-utils';

import { Constants } from '../../util/constants';

import {  ActivatedRoute, 
          Router } from '@angular/router';

import { TranslateService } from '@ngx-translate/core';

import * as d3 from "d3";

import * as FileSaver from 'file-saver';

@Component({
  selector: 'app-on-demand-download',
  templateUrl: './on-demand-download.component.html',
  styleUrls: ['./on-demand-download.component.css']
})
export class OnDemandDownloadComponent implements OnInit {

  states: Array<Object> = new Array();  
  type: string;
  statesObservable: Observable<any>;
  dataObservable: Observable<any>;
  loiNamesObservable: Observable<any>;
  value: string;
  private biomeSubscription: ISubscription;
  private typeSubscription: ISubscription;
  public httpOptions: any;
  
  private dataJson: any;
  private loiNamesJson: any;
  private biome: any;
  private DB_NoContain:any;

  constructor(private route: ActivatedRoute,    
              private router: Router,
              private dashboardApiProviderService: DashboardApiProviderService,
              private _translate: TranslateService,
              private httpClient: HttpClient) {

    this.biomeSubscription = this.route.params.subscribe(params => this.biome = params["biome"].replace("-", " "));
    this.typeSubscription = this.route.params.subscribe(params => this.type = params["type"].replace("-", " "));

    this.DB_NoContain = true;
    
    if (this.biome == "cerrado")
      this.states = Constants.DASHBOARD_CERRADO_STATES;
    else
      if (this.biome == "amazon") {
        this.states = Constants.DASHBOARD_AMAZON_STATES;
        this.biome = "legal_amazon";
        this.DB_NoContain = false;
      }
      else
        if (this.biome == "legal_amazon") 
          this.states = Constants.DASHBOARD_LEGAL_AMAZON_STATES;

    this.httpOptions = { headers: new  HttpHeaders(
      { 'App-Identifier': 'prodes_'+this.biome}
    )};

    if (this.DB_NoContain == false)
      this.biome = "amazon";

    this.dataObservable = this.dashboardApiProviderService.getDeforestation(this.httpOptions);  
    
    this.loiNamesObservable = this.dashboardApiProviderService.getLoinames(this.httpOptions); 
  
          
  }

  ngOnInit() { }

  clickHandler():void {

    forkJoin([this.dataObservable, this.loiNamesObservable]).subscribe(data => {
      this.dataJson = data[0];
      this.loiNamesJson = data[1];
      this.downloadCSV();      
    });
    
  }

  downloadCSV():void {

    // call function inside this
    var checkedValues = $('input:checkbox:checked').map(function():any {
      return $(this).val();
    }).get(); 

    var loiNames = new Map<number, string[]>();
    this.loiNamesJson.lois.filter(
                            (filteredLoi:any) => {
                              return filteredLoi.gid === 2
                          })
                          .map(
                            (loi:any) => { 
                              DeforestationOptionsUtils.setLoiNamesDownload(loi, loiNames, checkedValues);
                          });

    var allFeatures:any[];
    if (this.type == "increments")
      allFeatures = DeforestationOptionsUtils.dataWranglingIncrements(this.dataJson, this.biome);
    else
      allFeatures = DeforestationOptionsUtils.dataWranglingRates(this.dataJson);
    
    var dataCSV = allFeatures.filter(
                                (filteredFeatures:any) => {
                                  return filteredFeatures.loi === 2;
                              })
                              .filter(
                                (filteredFeatures:any) => {     
                                  return filteredFeatures.loiName in loiNames; 
                              })
                              .map(
                                (feature:any) => {                               
                                  return {
                                            year: feature.endDate,
                                            '>1ha': feature.area,
                                            '>6.25ha': feature.filteredArea,
                                            municipality: loiNames[feature.loiName][0],
                                            state: loiNames[feature.loiName][1]
                                          }
                              });
    
    dataCSV.sort(function (a, b) {
      var aMunicipality = a.municipality;
      var bMunicipality = b.municipality;
      var aState = a.state;
      var bState = b.state;
      var aYear = a.year;
      var bYear = b.year;
     
      if(aState == bState) {
        if(aMunicipality == bMunicipality)
        {
            return (aYear < bYear) ? -1 : (aYear > bYear) ? 1 : 0;
        }
        else
        {
            return (aMunicipality < bMunicipality) ? -1 : 1;
        }
      }
      else {
        return (aState < bState) ? -1 : 1;
      }

    });

    let blob = new Blob([d3.csvFormat(dataCSV)], {type: "text/csv;charset=utf-8"}),
    dt = new Date(),
    fileName = dt.getDate() + "_" + dt.getMonth() + "_" + dt.getFullYear() + "_" + dt.getTime();
    FileSaver.saveAs(blob, 'terrabrasilis_'+this.biome+'_'+fileName+'.csv');

  }

}