import express, { Request, Response, NextFunction } from "express";
import { SuccessResponse } from "../../../core/responses/response.API";
import { ApiError, InternalError, NotFoundError } from "../../../core/responses/response.Error";
import { SMSResult } from "../../../types/return_types";
import { SmsService } from "../../services/service.sms";

import cache from 'memory-cache'


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
            new SuccessResponse('SMS validation sent', smsResult).send(res)
        } catch (error) {
            next(new InternalError())
        }
    }
)

smsRouter.get('/authenticate',
    async function (req: Request, res: Response, next: NextFunction) {
        const phone = req.body.phone
        const validationCode = req.body.code
        // Check In-memory Cache about code
        const cachedValidationCode = cache.get(phone)
        if (validationCode !== cachedValidationCode) ApiError.handle(new NotFoundError('cache doesn\'t exists'), res)
        
        try {
            const searchedAccount = await service.scanAccount(phone)
            if (searchedAccount) { new SuccessResponse('authenticated success', { phone: phone, registered: true }).send(res) }
            else { new SuccessResponse('authenticated success', { phone: phone, registered: false }).send(res) }
        } catch (error) {
            next(new InternalError())
        }
    }
)

export default smsRouter