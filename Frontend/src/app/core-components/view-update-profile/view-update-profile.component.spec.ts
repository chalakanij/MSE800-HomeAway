import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewUpdateProfileComponent } from './view-update-profile.component';

describe('ViewUpdateProfileComponent', () => {
  let component: ViewUpdateProfileComponent;
  let fixture: ComponentFixture<ViewUpdateProfileComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ViewUpdateProfileComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewUpdateProfileComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
