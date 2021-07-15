import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { delay, filter, startWith } from 'rxjs/operators';

@Injectable()
export class TsComponentsDataShareService {

  private dataSource = new BehaviorSubject<any>({});
  currentData = this.dataSource.asObservable();

  private tableSource = new BehaviorSubject<any>({});
  tableData = this.tableSource.asObservable();
  
  private chartLoadingCrtl = new BehaviorSubject<any>({});
  chartLoading = this.chartLoadingCrtl.asObservable();

  constructor() { }

  changeData(data: any) {
    this.dataSource.next(data);
  }

  changeTable(data: any) {
    this.tableSource.next(data);
    //console.log('changeTableShared: ', data)
  }

  changeTableShp(data: any) {
    this.tableSource.next({...data});
    //console.log('changeTableSharedComplete: ', data)
  }

  changeLoading(endLoading: boolean) {
    this.chartLoadingCrtl.next(endLoading);
  }
  
}