import { async, ComponentFixture, TestBed } from '@angular/core/testing'

import { DatePickerFullComponent } from './date-picker-full.component'

describe('DatePickerFullComponent', () => {
  let component: DatePickerFullComponent
  let fixture: ComponentFixture<DatePickerFullComponent>

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [DatePickerFullComponent]
    }).compileComponents()
  }))

  beforeEach(() => {
    fixture = TestBed.createComponent(DatePickerFullComponent)
    component = fixture.componentInstance
    fixture.detectChanges()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })
})
