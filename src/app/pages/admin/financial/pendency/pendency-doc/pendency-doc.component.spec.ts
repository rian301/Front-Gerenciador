/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { PendencyDocComponent } from './pendency-doc.component';

describe('PendencyDocComponent', () => {
  let component: PendencyDocComponent;
  let fixture: ComponentFixture<PendencyDocComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PendencyDocComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PendencyDocComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
