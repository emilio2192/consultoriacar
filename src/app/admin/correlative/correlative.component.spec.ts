import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { CorrelativeComponent } from './correlative.component';

describe('CorrelativeComponent', () => {
  let component: CorrelativeComponent;
  let fixture: ComponentFixture<CorrelativeComponent>;

  beforeEach(waitForAsync(() => {
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
