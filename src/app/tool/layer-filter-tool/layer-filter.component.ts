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

@Component({
  selector: "layer-filter",
  templateUrl: "./layer-filter.component.html",
  styleUrls: ["./layer-filter.component.css"]
})
export class LayerFilterComponent implements OnInit {
  dateValue = new Date(2016, 0, 1);
  minDate = new Date(2016, 0, 1);
  maxDate = new Date(2018, 0, 1);

  layer: Layer;

  filters: Observable<fromLayerFilterReducer.Filter[]>;
  initialDate: Observable<Date>;
  finalDate: Observable<Date>;

  constructor(
    private dialogRef: MatDialogRef<LayerFilterComponent>,
    private dom: DomSanitizer,
    private dialog: MatDialog,
    private cdRef: ChangeDetectorRef,
    private store: Store<fromLayerFilterReducer.State>,
    @Optional() @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.layer = data.layer;
    this.store.pipe(select((state: any) => state.layerFilter.filters)).subscribe((changedFilters) => {
      this.filters = changedFilters;
    });
  }

  private terrabrasilisApi: TerrabrasilisApiComponent = new TerrabrasilisApiComponent(
    this.dialog,
    this.dom,
    this.cdRef,
    null
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

  applyFilter () {
    const obj = {
      id: 123,
      initialDate: new Date(2016, 0, 1)
    } as fromLayerFilterReducer.Filter;
    const setInitialDateAction = fromLayerFilterReducer.actions.setFilterPropsForObject(
      obj
    );
    this.store.dispatch(setInitialDateAction);
  }
}
