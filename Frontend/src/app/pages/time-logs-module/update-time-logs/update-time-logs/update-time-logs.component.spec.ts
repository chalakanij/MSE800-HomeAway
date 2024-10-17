import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UpdateTimeLogsComponent } from './update-time-logs.component';

describe('UpdateTimeLogsComponent', () => {
  let component: UpdateTimeLogsComponent;
  let fixture: ComponentFixture<UpdateTimeLogsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UpdateTimeLogsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(UpdateTimeLogsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
