import { async, ComponentFixture, TestBed } from '@angular/core/testing'

import { ChartpanelComponent } from './chartpanel.component'

describe('ChartpanelComponent', () => {
  let component: ChartpanelComponent
  let fixture: ComponentFixture<ChartpanelComponent>

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ChartpanelComponent]
    }).compileComponents()
  }))

  beforeEach(() => {
    fixture = TestBed.createComponent(ChartpanelComponent)
    component = fixture.componentInstance
    fixture.detectChanges()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })
})
