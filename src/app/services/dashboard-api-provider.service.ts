import { Injectable } from '@angular/core';

import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';

import { Observable } from 'rxjs';

import { Constants } from '../util/constants';

@Injectable()
export class DashboardApiProviderService {

  private dashboardAPIHost: string;

  /* main resources json */
  private loisResource = 'config/lois';
  private loinamesResource = 'config/loinames';
  private queryableLoinamesResource = 'config/query/loinames';
  private classesResource = 'config/classes';
  private periodsResource = 'config/periods';

  /* local of interests json */
  private biomesResource = 'config/bioma';
  private ufResource = 'config/uf';
  private munResource = 'config/mun';
  private consunitResource = 'config/consunit';
  private indiResource = 'config/indi';
  private pathrowResource = 'config/pathrow';

  /* deforestation all */
  private deforestation = 'data/deforestation/all';
  private deforestation_rates = 'data/deforestation_rates/all';

  constructor(private http: HttpClient) {
    this.dashboardAPIHost = Constants.DASHBOARD_API_HOST;
  }

  getLois(httpOptions: any) {
    return this.http.get(this.dashboardAPIHost + this.loisResource, httpOptions);
  }

  getLoinames(httpOptions: any) {
    return this.http.get(this.dashboardAPIHost + this.loinamesResource, httpOptions);
  }

  getLoinamesbyLoi(params: any, headers: any) {
    return this.http.get(this.dashboardAPIHost + this.queryableLoinamesResource, { headers, params });
  }

  getClasses(httpOptions: any) {
    return this.http.get(this.dashboardAPIHost + this.classesResource, httpOptions);
  }

  getPeriods(httpOptions: any) {
    return this.http.get(this.dashboardAPIHost + this.periodsResource, httpOptions);
  }

  getBiomes(httpOptions: any) {
    return this.http.get(this.dashboardAPIHost + this.biomesResource, httpOptions);
  }

  getUF(httpOptions: any) {
    return this.http.get(this.dashboardAPIHost + this.ufResource, httpOptions);
  }

  getMun(httpOptions: any) {
    return this.http.get(this.dashboardAPIHost + this.munResource, httpOptions);
  }

  getConsUnit(httpOptions: any) {
    return this.http.get(this.dashboardAPIHost + this.consunitResource, httpOptions);
  }

  getIndi(httpOptions: any) {
    return this.http.get(this.dashboardAPIHost + this.indiResource, httpOptions);
  }

  getPathRow(httpOptions: any) {
    return this.http.get(this.dashboardAPIHost + this.pathrowResource, httpOptions);
  }

  getDeforestation(httpOptions: any) {
    return this.http.get(this.dashboardAPIHost + this.deforestation, httpOptions);
  }

  getDeforestationRates(httpOptions: any) {
    return this.http.get(this.dashboardAPIHost + this.deforestation_rates, httpOptions);
  }

}
