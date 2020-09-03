import { Component, OnInit } from '@angular/core';
import {FirebaseService} from '../../services/firebase.service';

@Component({
  selector: 'app-forgotpwd',
  templateUrl: './forgotpwd.component.html',
  styleUrls: ['./forgotpwd.component.css']
})
export class ForgotpwdComponent implements OnInit {
  email: string;
  constructor(private firebaseService : FirebaseService) { }

  ngOnInit(): void {
  }

  sendResetPassword = () =>{
    if(this.email.length>2){
      this.firebaseService.getAuth().sendPasswordResetEmail(this.email).then(response =>{
        console.log(response);
      }).catch(error => {
        alert(error);
      })
    }
  }

}
