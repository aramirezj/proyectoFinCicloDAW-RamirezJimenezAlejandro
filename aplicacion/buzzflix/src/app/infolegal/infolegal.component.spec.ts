import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { InfolegalComponent } from './infolegal.component';

describe('InfolegalComponent', () => {
  let component: InfolegalComponent;
  let fixture: ComponentFixture<InfolegalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ InfolegalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InfolegalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
