import express, { Request, Response, NextFunction } from "express";

import { uploadProductImages, uploadProfileImage } from "../../services/service.upload.image";

const imageRouter = express.Router()

imageRouter.put(
    '/profileImage', 
    uploadProfileImage.single('profile'),
    function (req: Request, res: Response, next: NextFunction) {
        const image = req.file as Express.MulterS3.File
        console.log(image)
        if (!image) res.status(400).json('Image Undefined')
        else res.status(200).json(
            {
                message: 'success for uploading image',
                imageUrl: image.location
            }
        )
    }
)

imageRouter.put(
    '/productImage', 
    uploadProductImages.array('product', 10),
    function (req: Request, res: Response, next: NextFunction) {
        const images = req.files as Express.MulterS3.File[]
        console.log(images.map(it => it.location))
        if (!images || images.length == 0) res.status(400).json('Image Undefined')
        else res.status(200).json(
            {
                message: 'success for uploading image',
                imageUrl: images.map(it => it.location)
            }
        )
    }
)

export default imageRouter