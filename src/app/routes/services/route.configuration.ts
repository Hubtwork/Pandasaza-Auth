import express, { Request, Response, NextFunction } from "express";
import { getCustomRepository } from "typeorm";
import { SuccessResponse } from "../../../core/responses/response.API";
import { AccountRepository } from "../../../database/repository/repository.account";
import { UserProfileRepository } from "../../../database/repository/repository.user.profile";
import { uploadProfileImage } from "../../services/service.upload.image";

import authAuthentication from "../../validation/validate.authentication";
import authValidation from "../../validation/validate.validation";


import _ from 'lodash'
import { ProfileDTO } from "../../../interfaces/interface.DTO.user";


const configurationRouter = express.Router()

configurationRouter.put('/imageUploadTest',
    uploadProfileImage.single('profile'),
    function (req: Request, res: Response, next: NextFunction) {
        const image = req.file as Express.MulterS3.File
        console.log(image)
        const profile = req.body as ProfileDTO
        console.log(`AccessToken: ${req.headers.authorization}`)
        console.log(profile)
        new SuccessResponse('success', { message: 'success for uploading image', imageUrl: image.location}).send(res)
    }
)

configurationRouter.put('/change/profile', 
    uploadProfileImage.single('profileImage'),
    authValidation, 
    authAuthentication,
    async function (req: Request, res: Response, next: NextFunction) {
        // parse profile Image Url
        const profileImage = (req.file as Express.MulterS3.File).location
        console.log(req.body)
        const account = await getCustomRepository(AccountRepository).getAccountByAccountId(req.body.accountId)
        const profileId = account!.user!.profile.profileId
        const profileName = req.body.profileName

        const profile = await getCustomRepository(UserProfileRepository).updateUserProfile(profileId, profileName, profileImage)
        new SuccessResponse('success', _.pick(profile, ['profileName', 'profileImage'])).send(res)
    }
)

export default configurationRouter