import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ExploradorComponent } from './explorador.component';

describe('ExploradorComponent', () => {
  let component: ExploradorComponent;
  let fixture: ComponentFixture<ExploradorComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ExploradorComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ExploradorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
