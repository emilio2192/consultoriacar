import { Component, OnInit } from '@angular/core';
import { FirebaseService } from '../../services/firebase.service';

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.css']
})
export class UsersComponent implements OnInit {
  email:string;
  password:string;
  name: string;
  hide=false;
  constructor(private firebaseService: FirebaseService) { }

  ngOnInit(): void {
  }

  createUser = () =>{
    if(this.email.length > 0 && this.password.length>0){
      
      this.firebaseService.getAuth().createUserWithEmailAndPassword(this.email, this.password).then(result =>{
        console.log(result.user.uid);
        // this.firebaseService.getAuth().sendPasswordResetEmail(result.user.email);
        this.firebaseService.getCollection().collection('users').add({
          uid: result.user.uid,
          name: this.name,
          email: result.user.email,
        });
        this.ngOnInit();
      }).catch(error =>{});
    }
    // console.log(this.firebaseService.createUser(this.email, this.password)); 
  }

}
