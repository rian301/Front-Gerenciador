/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { PendencyListComponent } from './pendency-list.component';

describe('PendencyListComponent', () => {
  let component: PendencyListComponent;
  let fixture: ComponentFixture<PendencyListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PendencyListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PendencyListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
