import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, retry } from 'rxjs/operators';
import * as AWS from 'aws-sdk/global';
import * as SES from 'aws-sdk/clients/ses';
import { environment } from '../../environments/environment';


@Injectable({
  providedIn: 'root'
})
export class EmailService {

  constructor(private http: HttpClient) {


  }

  sendEmail = async (correlative:string) => {
    // AWS.config.update({region: AWS.config.region});
    const ses = new SES( {
      accessKeyId: environment.amazon.accessKey,
      secretAccessKey: environment.amazon.secretKey,
      region: 'us-east-2',
  });
    const params = {
      Destination: {
    
       ToAddresses: [
          "consultoriacar.gt@gmail.com"
       ]
      }, 
      Message: {
       Body: {
        Html: {
         Charset: "UTF-8", 
         Data: `Se ha finalizado el correlativo: ${correlative}. Puedes ver el detalle <a href='consultoriacar.com/main/detail/${correlative}' >aqui </a>. `
        }
       }, 
       Subject: {
        Charset: "UTF-8", 
        Data: "Correlativo finalizado"
       }
      },
      Source: "Consultoria car <consultoriacar.gt@gmail.com>", 
     };
    ses.sendEmail(params, (err, data) => {
      if(err) console.log(err);
      if(data) console.log(data);
    })
  }
}
