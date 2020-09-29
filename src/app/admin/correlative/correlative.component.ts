import { Component, OnInit } from '@angular/core';
import { FirebaseService } from '../../services/firebase.service';

@Component({
  selector: 'app-correlative',
  templateUrl: './correlative.component.html',
  styleUrls: ['./correlative.component.css']
})
export class CorrelativeComponent implements OnInit {
  correlative: number;
  numberCorrelative:any;
  constructor(private firebaseService: FirebaseService) { }

  ngOnInit(): void {
    this.firebaseService.getCollection().collection('correlative').doc('1').valueChanges().subscribe(data => {
      console.log('data', data);
      // @ts-ignore
      this.correlative = data;
      // @ts-ignore
      this.numberCorrelative = data.number;
    });

  }
  update = () => {
    //@ts-ignore
    this.correlative.number = this.numberCorrelative;
    this.firebaseService.getCollection().collection('correlative').doc('1').update(this.correlative);
  }

}
