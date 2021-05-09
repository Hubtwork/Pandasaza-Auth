import { Request, Response, NextFunction } from "express"
import { BadRequestError } from "../../core/responses/response.Error"
import UserDTO from "../../interfaces/interface.DTO.user"
import { validateUserDTO } from "../utils/validateUtils"

export default async function (req: Request, res: Response, next: NextFunction) {
    try {
        if (Object.keys(req.body).length > 5) throw new BadRequestError('Invalid Request Body')
        const userDTO = req.body as UserDTO
        if ( !validateUserDTO(userDTO) ) throw new BadRequestError('Invalid Request Body')
        req.body = userDTO
        next()
    } catch(error) {
        next(error)
    }
}