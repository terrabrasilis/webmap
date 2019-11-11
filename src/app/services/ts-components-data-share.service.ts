import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

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
  }

  changeLoading(endLoading: boolean) {
    this.chartLoadingCrtl.next(endLoading);
  }
  
}