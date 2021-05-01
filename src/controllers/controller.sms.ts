import { Router, Request, Response } from "express";
import Controller from "../interfaces/controller";
import { SmsService } from "../services/service.sms";
import { SMSResult } from "../types/return_types";
import { Logger } from "../utils/logger";



class SmsController implements Controller {
    private logger: Logger
    private service: SmsService
    public path = '/sms'
    public router = Router()

    constructor() {
        this.service = new SmsService()
        this.logger = new Logger()
    }

    private launchSMSAuthentification = async (request: Request, response: Response) => {
        const targetPhone = request.params.phone
        const smsResult: SMSResult = await this.service.callExternalSmsService(targetPhone)
        if (smsResult.isSuccess) {
            this.logger.info(` Send validation code [ ${smsResult.validationCode!} ] to [ ${targetPhone} ] successfully`)
        } else {
            this.logger.error(` Sebd validation code to [ ${targetPhone} ] failed.\nReason : ${smsResult.errorMessage!}`)
        }
        response.send(smsResult)
    }
}