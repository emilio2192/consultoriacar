import { Injectable } from '@angular/core';

import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFirestore } from '@angular/fire/firestore';

@Injectable({
  providedIn: 'root'
})
export class FirebaseService {

  constructor(private fAuth: AngularFireAuth, private afs: AngularFirestore) {
  }
  login = async (email, password) => {
    try {
      return await this.fAuth.signInWithEmailAndPassword(email, password);
    } catch (e) {
      return e;
    }
  }

  logout = async () => {
    try {
      return await this.fAuth.signOut();
    } catch (e) {
      return e;
    }
  }
}

