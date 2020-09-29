import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CorrelativeComponent } from './correlative.component';

describe('CorrelativeComponent', () => {
  let component: CorrelativeComponent;
  let fixture: ComponentFixture<CorrelativeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CorrelativeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CorrelativeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
