import { Request, Response, NextFunction } from "express"
import { getCustomRepository } from "typeorm"
import { BadRequestError } from "../../core/responses/response.Error"
import { AccountRepository } from "../../database/repository/repository.account"
import { UserProfileRepository } from "../../database/repository/repository.user.profile"


export default async function (req: Request, res: Response, next: NextFunction) {
    try {
        if (
            !req.body ||
            !req.body.accountId
        ) throw new BadRequestError('Invalid Request Body')
        next()
    } catch(error) {
        next(error)
    }
}