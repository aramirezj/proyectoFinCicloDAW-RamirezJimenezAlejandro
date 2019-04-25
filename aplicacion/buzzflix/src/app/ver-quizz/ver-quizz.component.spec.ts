import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { VerQuizzComponent } from './ver-quizz.component';

describe('VerQuizzComponent', () => {
  let component: VerQuizzComponent;
  let fixture: ComponentFixture<VerQuizzComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ VerQuizzComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(VerQuizzComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
