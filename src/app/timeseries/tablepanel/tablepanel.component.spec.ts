import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TablepanelComponent } from './tablepanel.component';

describe('TablepanelComponent', () => {
  let component: TablepanelComponent;
  let fixture: ComponentFixture<TablepanelComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TablepanelComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TablepanelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
