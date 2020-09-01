import { Injectable } from '@angular/core';
import * as AWS from 'aws-sdk/global';
import * as S3 from 'aws-sdk/clients/s3';
import { environment } from '../../environments/environment';

@Injectable({
    providedIn: 'root'
})
export class UploadService {

    constructor() { }

    fileUpload = async (file, correlative) => {
        const contentType = file.type;
        console.log(`Region ${AWS.config.region}`);
        const bucket = new S3(
            {
                accessKeyId: environment.amazon.accessKey,
                secretAccessKey: environment.amazon.secretKey,
                region: 'us-east-2',

            }
        );
        const filename = `${correlative}-${this.randomString()}`;
        const params = {
            Bucket: 'consultoriacar',
            Key: filename,
            Body: file,
            ACL: 'public-read',
            ContentType: contentType
        };
        let response;
        return await bucket.upload(params).promise();
        // , function (err, data) {
        //     if (err) {
        //         console.log('EROOR: ', JSON.stringify(err));
        //         return Promise.reject(false);
        //     }
        //     console.log('File Uploaded.', data);
        //     response = data;
        //     Promise.resolve(data);
        // });
        // return response;
    }
    randomString = () => {
        let text = '';
        const patter = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890abcdfghijklmnopqrstuvwxyz';
        for (let i = 0; i < 15; i++) {
            text += patter.charAt(Math.floor(Math.random() * patter.length));
        }
        return text;
    }
}
