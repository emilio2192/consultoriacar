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
  email: string ;
  password: string ;
  hide = true;
  loginRequest: any;
  constructor(private router: Router, private firebase: FirebaseService, private location: Location) {}

  ngOnInit(): void {}

  login = async () => {
    if (window.localStorage.getItem("auth") != null) {
      this.router.navigate(['main/dashboard']);
    } else {
      const response = await this.firebase.login(this.email, this.password);
      if (!response.code) {
        const collectionUsers = this.firebase.getCollection().collection('users', ref => ref.where('uid', '==',response.user.uid))
        .valueChanges().subscribe(res=>{
          // @ts-ignore
          window.localStorage.setItem("isAdmin", res[0].admin);
        },error=>{
          alert(error);
        });

        window.localStorage.setItem("auth", JSON.stringify(response));
        this.loginRequest = response.message;
        this.router.navigate(['main/dashboard']);
      }else{
        if(response.code == 'auth/wrong-password'){
          alert('Credenciales Invalidas, ingrese correctamente.')
        }
        if(response.code == 'auth/user-not-found'){
          alert('El usuario no existe')
        }
      }
    }
  }
  forgot = () => {
    this.router.navigate(['forgotpwd']);
  }

}
