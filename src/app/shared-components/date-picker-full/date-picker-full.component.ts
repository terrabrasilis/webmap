import { Component } from "@angular/core";

/** @title Datepicker with min & max validation */
@Component({
  selector: "app-date-picker-full",
  templateUrl: "./date-picker-full.component.html",
  styleUrls: ["./date-picker-full.component.css"]
})

export class DatePickerFullComponent {
  minDate = new Date(2000, 0, 1);
  maxDate = new Date(2020, 0, 1);
}
