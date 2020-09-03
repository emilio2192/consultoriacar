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
            ContentType: contentType
        };
        return await bucket.upload(params).promise();
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
