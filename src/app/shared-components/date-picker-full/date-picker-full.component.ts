import { Component, Input, Output, EventEmitter } from '@angular/core'
import { FormControl } from '@angular/forms'
import {
  MomentDateAdapter,
  MAT_MOMENT_DATE_ADAPTER_OPTIONS
} from '@angular/material-moment-adapter'
import {
  DateAdapter,
  MAT_DATE_FORMATS,
  MAT_DATE_LOCALE
} from '@angular/material/core'
import { MatDatepicker } from '@angular/material/datepicker'

// Depending on whether rollup is used, moment needs to be imported differently.
// Since Moment.js doesn't have a default export, we normally need to import using the `* as`
// syntax. However, rollup creates a synthetic default module and we thus need to import it using
// the `default as` syntax.
import * as _moment from 'moment'
// tslint:disable-next-line:no-duplicate-imports
import { default as _rollupMoment, Moment } from 'moment'

const moment = _rollupMoment || _moment

// See the Moment.js docs for the meaning of these formats:
// https://momentjs.com/docs/#/displaying/format/
export const MY_FORMATS = {
  parse: {
    dateInput: 'DD/MM/YYYY'
  },
  display: {
    dateInput: 'DD/MM/YYYY',
    monthYearLabel: 'MMM YYYY',
    dateA11yLabel: 'LL',
    monthYearA11yLabel: 'MMMM YYYY'
  }
}

/** @title Datepicker with min & max validation */
@Component({
  selector: "app-date-picker-full",
  templateUrl: "./date-picker-full.component.html",
  styleUrls: ["./date-picker-full.component.css"],
  providers: [
    {
      provide: DateAdapter,
      useClass: MomentDateAdapter,
      deps: [MAT_DATE_LOCALE, MAT_MOMENT_DATE_ADAPTER_OPTIONS]
    },

    { provide: MAT_DATE_FORMATS, useValue: MY_FORMATS }
  ]
})

export class DatePickerFullComponent {
  date = new FormControl(moment())
  @Output() setDateOutput = new EventEmitter();
  @Input() minDate: Date;
  @Input() maxDate: Date;
  @Input() initialDate: Date;

  ngOnInit()
  {
    this.setDate(moment(this.initialDate));
    this.onChanges();
  }

  onChanges(): void {
    this.date.valueChanges.subscribe(val => {
     this.setDate(val);
    });
  }

  setDate(normalizedDate: Moment)
  {
    const ctrlValue = this.date.value;
    ctrlValue.year(normalizedDate.year());
    ctrlValue.month(normalizedDate.month());
    ctrlValue.date(normalizedDate.date());
    this.date.setValue(ctrlValue);
    this.setDateOutput.emit(normalizedDate.toDate())    
  }
}
