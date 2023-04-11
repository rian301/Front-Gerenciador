import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AlertCustomDialogComponent } from './alert-custom-dialog.component';

describe('AlertCustomDialogComponent', () => {
  let component: AlertCustomDialogComponent;
  let fixture: ComponentFixture<AlertCustomDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AlertCustomDialogComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AlertCustomDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
