import { Request, Response, NextFunction } from "express";
import { BadRequestError } from "../../core/responses/response.Error";

export default async function (req: Request, res: Response, next: NextFunction) {
    try {
        console.log(`3회차 : ${JSON.stringify(req.body)}`)
        if (
            !req.body ||
            !req.body.accountId ||
            !req.body.profileName ||
            !req.body.profileImage
        ) throw new BadRequestError('Invalid Request Body')
        
        next()
    } catch(error) {
        
        next(error)
    }
}