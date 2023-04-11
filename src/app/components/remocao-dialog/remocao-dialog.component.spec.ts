import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { RemocaoDialogComponent } from './remocao-dialog.component';

describe('RemocaoDialogComponent', () => {
  let component: RemocaoDialogComponent;
  let fixture: ComponentFixture<RemocaoDialogComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ RemocaoDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RemocaoDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
