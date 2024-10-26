import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewEmployeeLinkComponent } from './view-employee-link.component';

describe('ViewEmployeeLinkComponent', () => {
  let component: ViewEmployeeLinkComponent;
  let fixture: ComponentFixture<ViewEmployeeLinkComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ViewEmployeeLinkComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewEmployeeLinkComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
