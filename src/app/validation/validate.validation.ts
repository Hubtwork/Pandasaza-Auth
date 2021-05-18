import { Request, Response, NextFunction } from "express";
import { BadRequestError } from "../../core/responses/response.Error";

export default function (req: Request, res: Response, next: NextFunction) {
        try {

            console.log(`1회차 : ${JSON.stringify(req.body)}`)
            if (req.headers.authorization == 'test') { }
            else {
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
            }
            next()
        } catch(error) {
            console.log(`Error: ${error}`)
            next(error)
        }
    }