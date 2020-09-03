import { Component, OnInit, ViewChild } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import NewCase from '../../interfaces/new.case.interface';
import { FirebaseService } from '../../services/firebase.service';
import { FormBuilder } from '@angular/forms';
import { User } from '../../interfaces/user.interface';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

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
  cases = [];
  listUsers = [];
  isAdmin: boolean;
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
    this.isAdmin = (window.localStorage.getItem('isAdmin') == 'false') ? false : true;
    if (!this.isAdmin) {
      this.firebaseService.getCollection().collection('cases', ref => ref.where('client', '==', this.authUser.user.uid))
        .valueChanges().subscribe(data => {
          data.map(row => {
            // @ts-ignore
            row['clientName'] = this.authUser.user.email;
            this.cases.push(row);
          })
          this.dataSource.data = data;
        });
    } else {
      this.firebaseService.getCollection().collection('cases')
        .valueChanges().subscribe(data => {
          data.map(row => {
            // @ts-ignore
            this.firebaseService.getCollection().collection('users', ref => ref.where('uid', '==', row.client)).valueChanges().subscribe(clients => {
              clients.map(client => {
                // @ts-ignore
                row['clientName'] = client.name;
              })
            })
            this.cases.push(row);
          });
          this.dataSource.data = this.cases;
        });
    }
  }
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;

  async ngOnInit() {
    this.dataSource.paginator = this.paginator;
    this.users = await this.firebaseService.getCollection().collection<User>('users', ref => ref.where('admin', '==', false)).valueChanges();
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
