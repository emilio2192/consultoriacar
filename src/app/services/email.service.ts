import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, retry } from 'rxjs/operators';


@Injectable({
  providedIn: 'root'
})
export class EmailService {

  constructor(private http: HttpClient) {


  }

  sendEmail = async () => {
    console.log('holaaaa')
    const data = {
      from: 'Consultoria Car <consultoriacar.gt@gmail.com>',
      to: 'lerp2192@gmail.com',
      subject: 'Hello',
      text: 'test'
    };

    const body = new FormData();
    body.append('from', 'Excited User <consultoriacar.gt@gmail.com>');
    body.append('to', 'lerp2192@gmail.com');
    body.append('subject', 'Hello');
    body.append('text', 'test send email');

    // @ts-ignore
    // const grouped = Array.from(body).reduce( (m, e) => ((([g, k, v] = [...e[0].split(':'), e[1]]) =>(m[g] = Object.assign({}, m[g]))[k] = v)(), m) , {});
    // body.set('from=consultoriacar.gt@gmail.com; to=lerp2192@gmail.com; subject=Hello; text=hola es un test;')
    
    const headers = new HttpHeaders({
      'Authorization': "Basic YXBpOjQzNzU5MGI0OTgzYWYyYTNjMmQwZDllZDQ1YmYzOTYzLTBmNDcyNzk1LTI1MjVlM2Vi",
      
      'token': 'YXBpOjQzNzU5MGI0OTgzYWYyYTNjMmQwZDllZDQ1YmYzOTYzLTBmNDcyNzk1LTI1MjVlM2Vi'
    });
    const response = await this.http.post('https://api.mailgun.net/v3/sandbox12d6e9d16d014230aacd5af7310b5dd9.mailgun.org/messages', body, { headers }).toPromise();
    console.log('respuesta ', response);
  }
}
