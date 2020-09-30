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
  newCorrelativeFinal = 1;
  searchCorrelative: number;
  asignedClient: string;
  users: Observable<User[]>;
  authUser: any;
  cases = [];
  listUsers = [];
  isAdmin: boolean;
  correlative: any;
  correlativeCollection: any;
  displayedColumns: string[] = ['correlative', 'client', 'status', 'details'];
  dataSource = new MatTableDataSource();
  constructor(private firebaseService: FirebaseService, private formBuilder: FormBuilder) {
    this.authUser = JSON.parse(window.localStorage.getItem('auth'))
    this.users = this.firebaseService.getCollection().collection<User>('users').valueChanges();
    this.users = this.users.pipe(
      map(users => users.filter(user => {
        return true
      }))
    );
  }
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;

  async ngOnInit() {
    await this.firebaseService.getCollection().collection('correlative').doc('1').valueChanges().subscribe(data => {
      console.log('data', data);
      // @ts-ignore
      this.correlative = data.number;
    });
    this.firebaseService.getCollection().collection('correlative').doc('1').valueChanges().subscribe(data => {
      console.log('data', data);
      // @ts-ignore
      this.correlativeCollection = data;
    });
    console.log(`correlative actual`, this.correlative);
    this.isAdmin = (window.localStorage.getItem('isAdmin') == 'false') ? false : true;
    if (!this.isAdmin) {
      this.firebaseService.getCollection().collection('cases', ref => ref.where('client', '==', this.authUser.user.uid).orderBy('correlative') )
        .valueChanges().subscribe(data => {
          data.map(row => {
            // @ts-ignore
            row['clientName'] = this.authUser.user.email;
            this.cases.push(row);
          })
          this.dataSource.data = data;
        });
    } else {
      this.firebaseService.getCollection().collection('cases', ref => ref.orderBy('correlative'))
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
    this.dataSource.paginator = this.paginator;
    const collectionUsersPromise = await this.firebaseService.getCollection().collection('users', ref => ref.where('uid', '==', this.authUser.user.uid)).get().toPromise();
    const user = await this.firebaseService.getCollection().collection('users').doc(collectionUsersPromise.docs[0].id).valueChanges().toPromise();
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
    let initialCorrelative = this.correlative;
    initialCorrelative = parseInt(initialCorrelative);
    let finalCorrelative = this.newCorrelativeFinal;

    if (finalCorrelative > 0) {
      for (let i = 0; i <= finalCorrelative; i++) {
        await this.createCorrelative("" + (parseInt(this.correlativeCollection.number) + 1));
        
      }
      this.newCaseShow = !this.newCaseShow;
      window.location.reload();
    } else {
      this.createCorrelative(initialCorrelative);
    }
  }
  createCorrelative = async (correlative: string) => {
    console.log('correlative to add ', correlative);
    const isExists = await this.firebaseService.getCollection().collection('cases', ref => ref.where('correlative', '==', correlative)).get().toPromise();
    if (!isExists.empty) {
      alert("El Correlativo ya existe.");
      return;
    } else {
      console.log('is exists ', isExists);
      const newCase: NewCase = {
        correlative: correlative,
        client: this.asignedClient,
        isFinish: false,
        files: []
      }
      await this.updateCorrelative(correlative);

      const response = await this.firebaseService.getCollection().collection('cases').add(newCase);
      if (response.id) {
        // window.location.reload();
      }
    }

  }

  listedUsers = async () => {
    return this.users.pipe(
      map(users => users.filter(user => user.admin == true))
    );
  }

  deleteCorrelative = async (correlative) => {
    const id = await this.firebaseService.getCollection().collection('cases', ref => ref.where('correlative', '==', correlative)).get().toPromise();
    const documentId = id.docs[0].id;
    console.log('document id ', documentId);
    const response = await this.firebaseService.getCollection().collection('cases', ref => ref.where('correlative', '==', correlative)).doc(documentId).delete().then(res => {
      console.log('-----> result ', res);
      window.location.reload();
      this.ngOnInit();
    }).catch(error => console.log(`error ${error}`));
    console.log('response delete ', response);

  }

  updateCorrelative = (newCorrelative: any) => {
    //@ts-ignore
    this.correlativeCollection.number = newCorrelative;
    this.firebaseService.getCollection().collection('correlative').doc('1').update(this.correlativeCollection);
  }
}
