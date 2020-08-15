import { Component, OnInit } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { FirebaseService } from '../../services/firebase.service';
import { Location } from '@angular/common';
import { first } from 'rxjs/operators';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  // email = new FormControl('', [Validators.required, Validators.email]);
  email: string = 'lreyes@guatemalagps.com';
  password: string = 'miloreyes';
  hide = true;
  loginRequest: any;

  constructor(private router: Router, private firebase: FirebaseService, private location: Location) {
  }


  ngOnInit(): void {
    this.login()
  }

  login = async () => {
    console.log(window.localStorage.getItem("auth"));
    if (window.localStorage.getItem("auth") != null) {
      window.location.href = `//${window.location.host}/main`;
      return;
    } else {
      const response = await this.firebase.login(this.email, this.password);
      if (!response.code) {
        window.localStorage.setItem("auth", JSON.stringify(response));
        this.loginRequest = response.message;
        console.log('INGRESASTE', response)
        // window.location.href = `//${window.location.host}/main`;
      }
    }
  }

}
