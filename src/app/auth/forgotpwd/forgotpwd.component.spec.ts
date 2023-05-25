import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { ForgotpwdComponent } from './forgotpwd.component';

describe('ForgotpwdComponent', () => {
  let component: ForgotpwdComponent;
  let fixture: ComponentFixture<ForgotpwdComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ ForgotpwdComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ForgotpwdComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
