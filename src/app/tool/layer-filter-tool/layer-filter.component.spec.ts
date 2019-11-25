/* import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ChangeDetectorRef } from '@angular/core';
import { MatDialogRef } from '@angular/material';
import { MatDialog } from '@angular/material';
import { DomSanitizer } from '@angular/platform-browser';
import { Store } from '@ngrx/store';
import { LayerFilterComponent } from './layer-filter.component';
describe('LayerFilterComponent', () => {
  let component: LayerFilterComponent;
  let fixture: ComponentFixture<LayerFilterComponent>;
  beforeEach(() => {
    const changeDetectorRefStub = {};
    const matDialogRefStub = { close: () => ({}) };
    const matDialogStub = {
      open: (dialogComponent, object) => ({
        componentInstance: { content: {} }
      })
    };
    const domSanitizerStub = { bypassSecurityTrustHtml: content => ({}) };
    const storeStub = {
      pipe: arg => ({ subscribe: () => ({}) }),
      dispatch: setInitialDateAction => ({})
    };
    TestBed.configureTestingModule({
      schemas: [NO_ERRORS_SCHEMA],
      declarations: [LayerFilterComponent],
      providers: [
        { provide: ChangeDetectorRef, useValue: changeDetectorRefStub },
        { provide: MatDialogRef, useValue: matDialogRefStub },
        { provide: MatDialog, useValue: matDialogStub },
        { provide: DomSanitizer, useValue: domSanitizerStub },
        { provide: Store, useValue: storeStub }
      ]
    });
    fixture = TestBed.createComponent(LayerFilterComponent);
    component = fixture.componentInstance;
  });
  it('can load instance', () => {
    expect(component).toBeTruthy();
  });
  describe('closeDialog', () => {
    it('makes expected calls', () => {
      const matDialogRefStub: MatDialogRef = fixture.debugElement.injector.get(
        MatDialogRef
      );
      spyOn(matDialogRefStub, 'close').and.callThrough();
      component.closeDialog();
      expect(matDialogRefStub.close).toHaveBeenCalled();
    });
  });
  describe('applyFilter', () => {
    it('makes expected calls', () => {
      const storeStub: Store = fixture.debugElement.injector.get(Store);
      spyOn(storeStub, 'dispatch').and.callThrough();
      component.applyFilter();
      expect(storeStub.dispatch).toHaveBeenCalled();
    });
  });
});
 */