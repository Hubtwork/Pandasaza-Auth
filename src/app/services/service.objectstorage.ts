import { objectstorage } from "../../utils/environments";
import S3 from 'aws-sdk/clients/s3';

import { Request } from 'express'

import multer from 'multer'
import multerS3 from 'multer-s3'



export class ObjectStorageManager {

    private static endpoint: string = String(objectstorage.endpoint)
    private static region: string = String(objectstorage.region)
    private static accessKey: string = String(objectstorage.accessKey)
    private static secretKey: string = String(objectstorage.secretKey)

    public static getObjectStorage(): S3 {
        return new S3({
            endpoint: this.endpoint,
            region: this.region,
            credentials: {
                accessKeyId: this.accessKey,
                secretAccessKey: this.secretKey
            }
        })
    }

}

class Uploadable {
    public name: string
    public url: string

    public result?: any[]

    constructor(name: string, url: string) {
        this.name = name
        this.url = url
    }
}