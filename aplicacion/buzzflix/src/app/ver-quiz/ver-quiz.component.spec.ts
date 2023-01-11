import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { VerQuizComponent } from './ver-quiz.component';

describe('VerQuizComponent', () => {
  let component: VerQuizComponent;
  let fixture: ComponentFixture<VerQuizComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ VerQuizComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(VerQuizComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
