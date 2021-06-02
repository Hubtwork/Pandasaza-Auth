import express, { Request, Response, NextFunction } from "express";
import { getCustomRepository } from "typeorm";
import { SuccessResponse } from "../../../core/responses/response.API";
import { AccountRepository } from "../../../database/repository/repository.account";
import { UserProfileRepository } from "../../../database/repository/repository.user.profile";
import validateChangeProfile from "../../validation/validate.changeProfile";

import _ from 'lodash'
import validateShowProfile from "../../validation/validate.showProfile";
import { NotFoundError } from "../../../core/responses/response.Error";
import { uploadProfileImage } from "../../services/service.upload.image";
import { ProfileDTO } from "../../../interfaces/interface.DTO.user";


const profileRouter = express.Router()

profileRouter.get('/public/id/:id',
    validateShowProfile,
    async function (req: Request, res: Response, next: NextFunction) {
        const account = await getCustomRepository(AccountRepository).getAccountByAccountId(req.params.id)
        if (!account) next(new NotFoundError('User Not Found'))
        const profile = account!.user!.profile
        new SuccessResponse('success', _.pick(profile, ['profileName', 'profileImage'])).send(res)
    }
)

profileRouter.get('/my', 
    async function (req: Request, res: Response, next: NextFunction) {
        console.log(req.body)
        const account = await getCustomRepository(AccountRepository).getAccountByAccountId(req.body.accountId)
        const profile = account!.user!.profile
        new SuccessResponse('success', _.pick(profile, ['profileName', 'profileImage'])).send(res)
    }
)

export default profileRouter