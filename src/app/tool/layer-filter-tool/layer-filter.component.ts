import {
  Component,
  OnInit,
  Optional,
  Inject,
  ChangeDetectorRef
} from "@angular/core";
import { MatDialogRef, MatDialog, MAT_DIALOG_DATA } from "@angular/material";
import { FormBuilder, FormControl, Validators } from "@angular/forms";
import { DomSanitizer } from "@angular/platform-browser";
import { DialogComponent } from "../../dialog/dialog.component";
import { TerrabrasilisApiComponent } from "../terrabrasilis-api/terrabrasilis-api.component";
import { Layer } from "../../entity/layer";
import { head, last } from "lodash";

import { MomentDateAdapter } from "@angular/material-moment-adapter";
import {
  DateAdapter,
  MAT_DATE_FORMATS,
  MAT_DATE_LOCALE
} from "@angular/material/core";
import { MatDatepicker } from "@angular/material/datepicker";

// Depending on whether rollup is used, moment needs to be imported differently.
// Since Moment.js doesn't have a default export, we normally need to import using the `* as`
// syntax. However, rollup creates a synthetic default module and we thus need to import it using
// the `default as` syntax.
import * as _moment from "moment";
// tslint:disable-next-line:no-duplicate-imports
import { default as _rollupMoment, Moment } from "moment";

const moment = _rollupMoment || _moment;

// See the Moment.js docs for the meaning of these formats:
// https://momentjs.com/docs/#/displaying/format/
export const MY_FORMATS = {
  parse: {
    dateInput: "MM/YYYY"
  },
  display: {
    dateInput: "MM/YYYY",
    monthYearLabel: "MMM YYYY",
    dateA11yLabel: "LL",
    monthYearA11yLabel: "MMMM YYYY"
  }
};

@Component({
  selector: "layer-filter",
  templateUrl: "./layer-filter.component.html",
  styleUrls: ["./layer-filter.component.css"],
  providers: [
    // `MomentDateAdapter` can be automatically provided by importing `MomentDateModule` in your
    // application's root module. We provide it at the component level here, due to limitations of
    // our example generation script.
    {
      provide: DateAdapter,
      useClass: MomentDateAdapter,
      deps: [MAT_DATE_LOCALE]
    },

    { provide: MAT_DATE_FORMATS, useValue: MY_FORMATS }
  ]
})
export class LayerFilterComponent implements OnInit {
  initialDate = new FormControl(moment());
  endDate = new FormControl(moment());
  minDate = new Date(1900, 0, 1);
  maxDate = new Date(2050, 0, 1);

  layer: Layer;

  constructor(
    private dialogRef: MatDialogRef<LayerFilterComponent>,
    private dom: DomSanitizer,
    private dialog: MatDialog,
    private cdRef: ChangeDetectorRef,
    @Optional() @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.layer = data.layer;
  }

  private terrabrasilisApi: TerrabrasilisApiComponent = new TerrabrasilisApiComponent(
    this.dialog,
    this.dom,
    this.cdRef,
    null
  );

  ngOnInit() {}

  chosenYearHandlerInitialDate(normalizedYear: Moment) {
    const ctrlValue = this.initialDate.value;
    ctrlValue.year(normalizedYear.year());
    this.initialDate.setValue(ctrlValue);
  }

  chosenMonthHandlerInitialDate(
    normalizedMonth: Moment,
    datepicker: MatDatepicker<Moment>
  ) {
    const ctrlValue = this.initialDate.value;
    ctrlValue.month(normalizedMonth.month());
    this.initialDate.setValue(ctrlValue);
    datepicker.close();
  }

  chosenYearHandlerEndDate(normalizedYear: Moment) {
    const ctrlValue = this.endDate.value;
    ctrlValue.year(normalizedYear.year());
    this.endDate.setValue(ctrlValue);
  }

  chosenMonthHandlerEndDate(
    normalizedMonth: Moment,
    datepicker: MatDatepicker<Moment>
  ) {
    const ctrlValue = this.endDate.value;
    ctrlValue.month(normalizedMonth.month());
    this.initialDate.setValue(ctrlValue);
    datepicker.close();
  }

  sendLayerFilter(value: any): void {
    this.dialogRef.close();
  }

  closeDialog() {
    this.dialogRef.close();
  }

  showDialog(content: string): void {
    const dialogRef = this.dialog.open(DialogComponent, { width: "450px" });
    dialogRef.componentInstance.content = this.dom.bypassSecurityTrustHtml(
      content
    );
  }

  getDimensions() {
    const self = this;
    this.terrabrasilisApi
      .getDimensions(this.layer)
      .then(results => {
        self.handleResult(results);
      })
      .catch(console.error);
  }

  setRangeDate(results) {
    this.minDate = head(results);
    this.maxDate = last(results);
  }

  handleResult(results) {
    this.setRangeDate(results);
  }
}
