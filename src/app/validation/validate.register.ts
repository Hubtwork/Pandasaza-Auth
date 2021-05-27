import { Request, Response, NextFunction } from "express"
import { BadRequestError } from "../../core/responses/response.Error"
import UserDTO from "../../interfaces/interface.DTO.user"
import { validateUserDTO } from "../utils/validateUtils"

export default async function (req: Request, res: Response, next: NextFunction) {
    try {
        const profileImage = (req.file as Express.MulterS3.File).location
        req.body.profileImage = profileImage
        console.log(req.body)
        if (Object.keys(req.body).length > 5) throw new BadRequestError('Invalid Request Body')
        const userDTO = req.body as UserDTO
        if ( !validateUserDTO(userDTO) ) throw new BadRequestError('Invalid Request Body')
        req.body = userDTO
        next()
    } catch(error) {
        next(error)
    }
}