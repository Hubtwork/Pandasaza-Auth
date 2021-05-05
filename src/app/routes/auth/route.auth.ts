import express, { Request, Response, NextFunction } from "express";
import InternalServerException from "../../exceptions/network/InternalServerException";

import { AuthentificationService } from '../../services/service.auth'


/*
    Auth 

    routing source :: /auth

*/

const authRouter = express.Router()

const service = new AuthentificationService()

authRouter.get('/signIn/:phone',
    async function (req: Request, res: Response, next: NextFunction) {
        const phone = req.params.phone
        res.status(200).json({
            user: phone,
            currectRoute: 'SignIN'
        })
    }
)

authRouter.get('/register/:phone',
    async function (req: Request, res: Response, next: NextFunction) {
        const phone = req.params.phone
        res.status(200).json({
            user: phone,
            currectRoute: 'Register'
        })
    }
)

export default authRouter