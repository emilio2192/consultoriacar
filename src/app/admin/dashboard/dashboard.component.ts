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
  cases=[];


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
          data.map(row=>{
            // @ts-ignore
            this.firebaseService.getCollection().collection('users', ref => ref.where('uid', '==', row.client)).valueChanges().subscribe(clients =>{
              clients.map(client=>{
                // @ts-ignore
                row['clientName'] = client.name;
              })
            })
            this.cases.push(row);
          });
          this.dataSource.data = this.cases;
          console.log(data);
          console.log(this.dataSource.data);
        });
    }
  }
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;

  ngOnInit(): void {
    this.dataSource.paginator = this.paginator;

    console.log('localstorage', this.authUser.user.uid);
    console.log("data ", this.cases);
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
