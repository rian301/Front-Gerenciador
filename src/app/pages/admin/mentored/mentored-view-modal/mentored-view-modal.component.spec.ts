import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MentoredViewModalComponent } from './mentored-view-modal.component';

describe('MentoredViewModalComponent', () => {
  let component: MentoredViewModalComponent;
  let fixture: ComponentFixture<MentoredViewModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MentoredViewModalComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MentoredViewModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
