import { Request, Response, NextFunction } from "express";
import { BadRequestError } from "../../core/responses/response.Error";

export default async function (req: Request, res: Response, next: NextFunction) {
        try {
            // if accessToken missed
            if ( 
                !req.headers ||
                !req.headers.authorization
            ) throw new BadRequestError()
            const authorization = req.headers.authorization
            // if No bearer, No AccessToken paresed
            if (
                !authorization.startsWith('Bearer ') || 
                !authorization.split(' ')[1]
            ) throw new BadRequestError()
            next()
        } catch(error) {
            next(error)
        }
    }