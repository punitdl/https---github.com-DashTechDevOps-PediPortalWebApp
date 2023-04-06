import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OnboardtaskweekComponent } from './onboardtaskweek.component';

describe('OnboardtaskweekComponent', () => {
  let component: OnboardtaskweekComponent;
  let fixture: ComponentFixture<OnboardtaskweekComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OnboardtaskweekComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OnboardtaskweekComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
