
import multer, { Multer } from 'multer'
import multerS3 from 'multer-s3'
import { objectstorage } from '../../utils/environments'
import { ObjectStorageManager } from './service.objectstorage'





export const uploadProfileImage: Multer = multer({
    limits: {
        // 100 mb
        fileSize: 1024 * 1024 * 100
    },
    storage: multerS3({
        s3: ObjectStorageManager.getObjectStorage(),
        bucket: String(objectstorage.imageBucket),
        contentType: multerS3.AUTO_CONTENT_TYPE,
        acl: 'public-read',
        metadata: (req, file, cb) => {
            cb(null, { fieldName: file.fieldname })
        },
        key: (req, file, cb) => {
            cb(
                null, 
                "profile/" + Date.now().toString() + "_" + file.originalname
            )
        }
    })
})

export const uploadProductImages: Multer = multer({
    limits: {
        // 100 mb
        fileSize: 1024 * 1024 * 100
    },
    storage: multerS3({
        s3: ObjectStorageManager.getObjectStorage(),
        bucket: String(objectstorage.imageBucket),
        contentType: multerS3.AUTO_CONTENT_TYPE,
        acl: 'public-read',
        metadata: (req, file, cb) => {
            cb(null, { fieldName: file.fieldname })
        },
        key: (req, file, cb) => {
            cb(
                null, 
                "products/" + Date.now().toString() + "_" + file.originalname
            )
        }
    })
})