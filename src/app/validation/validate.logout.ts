import { Request, Response, NextFunction } from "express"
import { BadRequestError } from "../../core/responses/response.Error"

export default async function (req: Request, res: Response, next: NextFunction) {
    try {
        if (
            Object.keys(req.body).length != 1 ||
            !req.body ||
            !req.body.phone
        ) throw new BadRequestError('Invalid Request Body ')
        next()
    } catch(error) {
        next(error)
    }
}