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
  email: string = 'lerp2192@gmail.com';
  password: string = 'miloreyes';
  // EJg3C1qy8yRFaCICUjrsta3eDtG3
  hide = true;
  loginRequest: any;

  constructor(private router: Router, private firebase: FirebaseService, private location: Location) {
  }


  ngOnInit(): void {
    // this.login()
  }

  login = async () => {
    console.log(window.localStorage.getItem("auth"));
    if (window.localStorage.getItem("auth") != null) {
      this.router.navigate(['main/dashboard']);
    } else {
      const response = await this.firebase.login(this.email, this.password);
      if (!response.code) {
        console.log(response.user.uid);
        const collectionUsers = this.firebase.getCollection().collection('users', ref => ref.where('uid', '==',response.user.uid))
        .valueChanges().subscribe(res=>{
          console.log(res);
          // @ts-ignore
          window.localStorage.setItem("isAdmin", res[0].admin);
        },error=>{});


        window.localStorage.setItem("auth", JSON.stringify(response));
        this.loginRequest = response.message;
        console.log('INGRESASTE', response)
        this.router.navigate(['main/dashboard']);
      }
    }
  }

}
