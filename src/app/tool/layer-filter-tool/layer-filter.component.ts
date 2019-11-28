import {
  Component,
  OnInit,
  Optional,
  Inject,
  ChangeDetectorRef
} from "@angular/core";
import { MatDialogRef, MatDialog, MAT_DIALOG_DATA } from "@angular/material";
import { DomSanitizer } from "@angular/platform-browser";
import { DialogComponent } from "../../dialog/dialog.component";
import { TerrabrasilisApiComponent } from "../terrabrasilis-api/terrabrasilis-api.component";
import { Layer } from "../../entity/layer";
import { head, last } from "lodash";

import { Store, select } from "@ngrx/store";
import * as fromLayerFilterReducer from "../../redux/reducers/layer-filter-reducer";
import { Observable } from "rxjs";
import moment from 'moment'

@Component({
  selector: "layer-filter",
  templateUrl: "./layer-filter.component.html",
  styleUrls: ["./layer-filter.component.css"]
})
export class LayerFilterComponent implements OnInit {
  startDateValue = new Date(2016, 0, 1);
  endDateValue = new Date(2016, 0, 1);

  minDate = new Date(2016, 0, 1);
  maxDate = new Date(2018, 0, 1);

  layer: Layer;
  filters: Observable<fromLayerFilterReducer.Filter[]>;

  isOnlyYearDate: boolean = false;
  isOnlyMonthDate: boolean = true;
  isFullDate: boolean = false;

  constructor(
    private dialogRef: MatDialogRef<LayerFilterComponent>,
    private dom: DomSanitizer,
    private dialog: MatDialog,
    private cdRef: ChangeDetectorRef,
    private store: Store<fromLayerFilterReducer.State>,
    @Optional() @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.layer = data.layer;
    this.getDimensions()
    this.store
      .pipe(select((state: any) => state.layerFilter.filters))
      .subscribe((refreshedFilter) => {
        this.filters = refreshedFilter;
      });
  }

  private terrabrasilisApi: TerrabrasilisApiComponent = new TerrabrasilisApiComponent(
    this.dialog,
    this.dom,
    this.cdRef,
    null,
    null,
    this.store
  );

  ngOnInit () { }

  sendLayerFilter (value: any): void {
    this.dialogRef.close();
  }

  closeDialog () {
    this.dialogRef.close();
  }

  showDialog (content: string): void {
    const dialogRef = this.dialog.open(DialogComponent, { width: "450px" });
    dialogRef.componentInstance.content = this.dom.bypassSecurityTrustHtml(
      content
    );
  }

  getDimensions () {
    const self = this;
    this.terrabrasilisApi
      .getDimensions(this.layer)
      .then(results => {
        self.handleResult(results);
      })
      .catch(console.error);
  }

  setRangeDate (results) {
    this.minDate = head(results);
    this.maxDate = last(results);
  }

  handleResult (results) {
    this.setRangeDate(results);
  }

  setStartDateValue (selectedStartDate) {
    this.startDateValue = selectedStartDate
  }

  setEndDateValue (selectedEndDate) {
    this.endDateValue = selectedEndDate
  }

  buildTimeFilter () {
    const initialDate = this.startDateValue
    const finalDate = this.endDateValue

    // TODO: Verificar quando a data for null, ou se a data é só ano por exemplo...
    // Acho que o geoserver funciona de qualquer forma...
    const time = `${moment(initialDate).format('YYYY-MM-DD')}/${moment(finalDate).format('YYYY-MM-DD')}`
    return { time, initialDate, finalDate }
  }

  dispatchFilterActionToStore (currentLayerFilterObject) {
    const setInitialDateAction = fromLayerFilterReducer.actions.setFilterPropsForObject(
      currentLayerFilterObject
    );
    this.store.dispatch(setInitialDateAction);
  }

  applyFilter () {
    const { time, initialDate, finalDate } = this.buildTimeFilter()

    const currentLayerFilterObject = {
      id: this.layer.id,
      name: this.layer.name,
      initialDate,
      finalDate,
      time
    } as fromLayerFilterReducer.Filter;

    this.dispatchFilterActionToStore(currentLayerFilterObject)
    this.closeDialog()
  }
}
