import { Request, Response, NextFunction } from "express"
import { BadRequestError } from "../../core/responses/response.Error"


export default async function (req: Request, res: Response, next: NextFunction) {
    try {
        if (!req.headers.authorization) throw new BadRequestError('Authorization Needed')
        if (!req.body || !req.body.refreshToken) throw new BadRequestError('RefreshToken Needed')
        next()
    } catch(error) {
        next(error)
    }
}