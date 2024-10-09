import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DeleteTimeLogsComponent } from './delete-time-logs.component';

describe('DeleteTimeLogsComponent', () => {
  let component: DeleteTimeLogsComponent;
  let fixture: ComponentFixture<DeleteTimeLogsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DeleteTimeLogsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DeleteTimeLogsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
