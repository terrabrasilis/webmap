import { async, ComponentFixture, TestBed } from '@angular/core/testing'

import { DatePickerYearComponent } from './date-picker-year.component'

describe('DatePickerYearComponent', () => {
  let component: DatePickerYearComponent
  let fixture: ComponentFixture<DatePickerYearComponent>

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [DatePickerYearComponent]
    }).compileComponents()
  }))

  beforeEach(() => {
    fixture = TestBed.createComponent(DatePickerYearComponent)
    component = fixture.componentInstance
    fixture.detectChanges()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })
})
