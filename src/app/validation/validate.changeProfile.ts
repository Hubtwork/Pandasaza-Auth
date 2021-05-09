import { Request, Response, NextFunction } from "express";
import { BadRequestError } from "../../core/responses/response.Error";

export default async function (req: Request, res: Response, next: NextFunction) {
    try {
        if (
            !req.body ||
            !req.body.profileId ||
            !req.body.profileName ||
            !req.body.profileImage
        ) throw new BadRequestError('Invalid Request Body')
        
        next()
    } catch(error) {
        next(error)
    }
}