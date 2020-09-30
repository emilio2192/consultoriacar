import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';
import { FormBuilder, FormGroup, FormControl, FormArray } from '@angular/forms';
import { UploadService } from '../../services/upload.service';
import { FirebaseService } from '../../services/firebase.service';
import { MatTableDataSource } from '@angular/material/table';
import { EmailService } from '../../services/email.service';


@Component({
  selector: 'app-case-detail',
  templateUrl: './case-detail.component.html',
  styleUrls: ['./case-detail.component.css']
})


export class CaseDetailComponent implements OnInit {
  @ViewChild('inputFile', { static: false })
  myFileInput: ElementRef;

  case: string;
  file: File = null;
  form: FormGroup;
  caseCollection: any;
  documentId: any;
  documents: any;
  inputFile: any;
  isAdmin: boolean;

  displayedColumns: string[] = ['filename', 'link'];
  dataSource = new MatTableDataSource();
  constructor(private router: Router, private firebaseService: FirebaseService, 
    private route: ActivatedRoute, private _fb: FormBuilder, 
    private uploadService: UploadService, private emailService: EmailService) {
    this.case = this.route.snapshot.paramMap.get('correlative');
    this.form = this._fb.group({
      inputFile: [""],
      items: this._fb.array([])
    });
  }

  async ngOnInit() {
    console.log('holaaaa'); 
    this.isAdmin = (window.localStorage.getItem('isAdmin') == 'false') ? false : true;
    console.log(`is admin??? ${this.isAdmin}`);
    await this.firebaseService.getCollection().collection('cases')
      .valueChanges().subscribe(data => {
        data.map(row => {
          // @ts-ignore
          this.firebaseService.getCollection().collection('cases', ref => ref.where('correlative', '==', this.case)).valueChanges()
            .subscribe(caseItem => {

              caseItem.map(caseElement => {
                this.caseCollection = caseElement;
              })
            })
        });
      });
    const id = await this.firebaseService.getCollection().collection('cases', ref => ref.where('correlative', '==', this.case)).get().toPromise();
    this.documentId = id.docs[0].id;
    const user = JSON.parse( await window.localStorage.getItem('auth'));
    setTimeout(() => {
      if (this.caseCollection) {
        console.log('******* ', user.user.uid, this.caseCollection.client);
        if (!this.isAdmin && user.user.uid !== this.caseCollection.client) {
          this.router.navigate(['main/dashboard']);
        }
      }
    }, 2000);
    await this.getDocuments();
  }
  createItem(data): FormGroup {
    return this._fb.group(data);
  }
  get files(): FormArray {
    return this.form.get('items') as FormArray;
  };
  handleFileInput(event) {
    let files = event.target.files;
    if (files) {
      for (let file of files) {
        let reader = new FileReader();
        reader.onload = (e: any) => {
          this.files.push(this.createItem({
            file,
            url: e.target.result  //Base64 string for preview image
          }));
        }
        reader.readAsDataURL(file);
      }
    }
  }
  upload = async () => {
    const result = await this.uploadService.fileUpload(this.files.at(0).value.file, this.case);
    if (result) {
      this.caseCollection.files.push({
        url: result.Location,
        key: result.Key
      });
      this.firebaseService.getCollection().collection('cases').doc(this.documentId).update(this.caseCollection);
      this.form.get("inputFile").patchValue("");
    }

  }

  getDocuments = async () => {
    this.firebaseService.getCollection().collection('cases', ref => ref.where('correlative', '==', this.case)).valueChanges().subscribe(data => {
      data.map(item => {
        this.dataSource = new MatTableDataSource();
        // @ts-ignore
        this.dataSource.data = item.files;
      })
    });
  }

  finishCase = () => {
    console.log('------');
    this.emailService.sendEmail(this.case);
    this.caseCollection.isFinish = true;
    this.firebaseService.getCollection().collection('cases').doc(this.documentId).update(this.caseCollection);
  }

  reOpenCase = () => {
    this.caseCollection.isFinish = false;
    this.firebaseService.getCollection().collection('cases').doc(this.documentId).update(this.caseCollection);
  }
}
