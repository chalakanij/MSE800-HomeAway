import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddTimeLogsComponent } from './add-time-logs.component';

describe('AddTimeLogsComponent', () => {
  let component: AddTimeLogsComponent;
  let fixture: ComponentFixture<AddTimeLogsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddTimeLogsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AddTimeLogsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
