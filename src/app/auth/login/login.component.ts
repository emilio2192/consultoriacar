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
    console.log(window.localStorage.getItem("auth"));
    if (window.localStorage.getItem("auth") != null) {
      this.router.navigate(['main/dashboard']);
    } else {
      const response = await this.firebase.login(this.email, this.password);
      console.log('response   -- ', response);
      if (!response.code) {
        console.log(response.user.uid);
        const collectionUsers = this.firebase.getCollection().collection('users', ref => ref.where('uid', '==',response.user.uid))
        .valueChanges().subscribe(res=>{
          console.log('response',res);
          // @ts-ignore
          window.localStorage.setItem("isAdmin", res[0].admin);
        },error=>{
          console.log('error ',error);
          alert(error);
        });

        window.localStorage.setItem("auth", JSON.stringify(response));
        this.loginRequest = response.message;
        console.log('INGRESASTE', response)
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
