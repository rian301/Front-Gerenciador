/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { PendencyComponent } from './pendency.component';

describe('PendencyComponent', () => {
  let component: PendencyComponent;
  let fixture: ComponentFixture<PendencyComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PendencyComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PendencyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
