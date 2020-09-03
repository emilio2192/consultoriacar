import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.css']
})
export class MainComponent implements OnInit {
  showFiller = false;
  isAdmin = false;
  constructor() { 
    this.isAdmin = (window.localStorage.getItem('isAdmin') == 'false') ? false : true;
    console.log('role', this.isAdmin);
  }

  ngOnInit(): void {
  }

}
