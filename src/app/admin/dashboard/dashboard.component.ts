import { Component, OnInit, ViewChild } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import NewCase from '../../interfaces/new.case.interface';
import { FirebaseService } from '../../services/firebase.service';
import { FormBuilder } from '@angular/forms';
import { User } from '../../interfaces/user.interface';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';



export interface PeriodicElement {
  name: string;
  position: number;
  weight: number;
  symbol: string;
}

const ELEMENT_DATA: PeriodicElement[] = [
  { position: 1, name: 'Hydrogen', weight: 1.0079, symbol: 'H' },
  { position: 2, name: 'Helium', weight: 4.0026, symbol: 'He' },
  { position: 3, name: 'Lithium', weight: 6.941, symbol: 'Li' },
  { position: 4, name: 'Beryllium', weight: 9.0122, symbol: 'Be' },
  { position: 5, name: 'Boron', weight: 10.811, symbol: 'B' },
  { position: 6, name: 'Carbon', weight: 12.0107, symbol: 'C' },
  { position: 7, name: 'Nitrogen', weight: 14.0067, symbol: 'N' },
  { position: 8, name: 'Oxygen', weight: 15.9994, symbol: 'O' },
  { position: 9, name: 'Fluorine', weight: 18.9984, symbol: 'F' },
  { position: 10, name: 'Neon', weight: 20.1797, symbol: 'Ne' },
];

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  newCaseShow = false;
  newCorrelative: string;
  searchCorrelative: number;
  asignedClient: string;
  users: Observable<User[]>;
  authUser: any;
  cases: Observable<any>;


  displayedColumns: string[] = ['correlative', 'client', 'status', 'details'];
  dataSource = new MatTableDataSource();

  constructor(private firebaseService: FirebaseService, private formBuilder: FormBuilder) {
    this.authUser = JSON.parse(window.localStorage.getItem('auth'))
    this.users = this.firebaseService.getCollection().collection<User>('users').valueChanges();
    this.users = this.users.pipe(
      map(users => users.filter(user => {
        user.admin == false;
      }))
    );
    const isAdmin = window.localStorage.getItem('isAdmin');
    if (!isAdmin) {
      this.firebaseService.getCollection().collection('cases', ref => ref.where('uid', '==', this.authUser.user.uid))
        .snapshotChanges().subscribe(data => {
          this.dataSource.data = data;
          console.log(data);
        });

    } else {
      this.firebaseService.getCollection().collection('cases')
        .valueChanges().subscribe(data => {
          // data.map(item => {})
          this.dataSource.data = data;
          console.log(data);
          console.log(this.dataSource.data);
        });
    }
    console.log('is admin?', isAdmin);
    // this.cases = this.firebaseService.getCollection().collection<NewCase>('cases').snapshotChanges().;

  }
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;

  ngOnInit(): void {
    this.dataSource.paginator = this.paginator;

    console.log('localstorage', this.authUser.user.uid);
    // guatemalagps MsQB9pNzYsQPaABIgT9452BHyu83

  }

  toggleNewCase = () => {
    this.newCaseShow = !this.newCaseShow;
  }
  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }
  createNewCase = async () => {
    const newCase: NewCase = {
      correlative: this.newCorrelative,
      client: this.asignedClient,
      isFinish: false,
      files: []
    }
    const response = await this.firebaseService.getCollection().collection('cases').add(newCase);
    if (response.id) {
      window.location.reload();
    }

  }

  listedUsers = async () => {
    return this.users.pipe(
      map(users => users.filter(user => user.admin == true))
    );
  }
}
