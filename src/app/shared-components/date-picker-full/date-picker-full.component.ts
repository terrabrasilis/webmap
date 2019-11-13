import { Component, OnInit, Input } from '@angular/core'

@Component({
  selector: 'app-date-picker-full',
  templateUrl: './date-picker-full.component.html',
  styleUrls: ['./date-picker-full.component.css']
})
export class DatePickerFullComponent implements OnInit {
  @Input() minDate: Date
  @Input() maxDate: Date
  @Input() dateValue: string

  constructor () {}

  ngOnInit () {
    console.log('====================================')
    console.log(this.minDate, this.maxDate, this.dateValue)
    console.log('====================================')
  }
}
