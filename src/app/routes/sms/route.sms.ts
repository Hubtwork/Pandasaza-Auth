import express, { Request, Response, NextFunction } from "express";
import { SMSResult } from "../../../types/return_types";
import InternalServerException from "../../exceptions/network/InternalServerException";
import { SmsService } from "../../services/service.sms";



/*
    SMS 

    routing source :: /sms

*/

const smsRouter = express.Router()

const service = new SmsService()

smsRouter.get('/validate/:phone',
    async function (req: Request, res: Response, next: NextFunction) {
        const phone = req.params.phone
        try {
            const smsResult: SMSResult = await service.callExternalSmsService(phone)
            res.status(200).json(smsResult)
        } catch (error) {
            next(new InternalServerException())
        }
    }
)

smsRouter.get('/authenticate/:phone',
    async function (req: Request, res: Response, next: NextFunction) {
        const phone = req.params.phone
        try {
            const searchedAccount = await service.scanAccount(phone)
            if (searchedAccount) { res.redirect(`/auth/signIn/${phone}`) }
            else { res.redirect(`/auth/register/${phone}`) }
        } catch (error) {
            next(new InternalServerException())
        }
    }
)

export default smsRouter