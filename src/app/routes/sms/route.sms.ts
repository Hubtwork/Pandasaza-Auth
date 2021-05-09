import express, { Request, Response, NextFunction } from "express";
import { InternalError } from "../../../core/responses/response.Error";
import { SMSResult } from "../../../types/return_types";
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
            next(new InternalError())
        }
    }
)

smsRouter.get('/authenticate/:phone',
    async function (req: Request, res: Response, next: NextFunction) {
        const phone = req.params.phone
        try {
            const searchedAccount = await service.scanAccount(phone)
            if (searchedAccount) { res.redirect(`/sign/logIn/${phone}`) }
            else { res.status(200).json({
                phone: phone,
                registered: 'false'
            }) }
        } catch (error) {
            next(new InternalError())
        }
    }
)

export default smsRouter