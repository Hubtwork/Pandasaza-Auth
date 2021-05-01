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

    private constructRouters() {
        this.router.get(`${this.path}/validate/:phone`, this.launchSMSAuthentification)
    }

    private launchSMSAuthentification = async (request: Request, response: Response) => {
        const targetPhoneNumber = request.params.phone
        const smsResult: SMSResult = await this.service.callExternalSmsService(targetPhoneNumber)
        if (smsResult.isSuccess) {
            this.logger.info(` Send validation code [ ${smsResult.validationCode!} ] to [ ${targetPhoneNumber} ] successfully`)
        } else {
            this.logger.error(` Sebd validation code to [ ${targetPhoneNumber} ] failed.\nReason : ${smsResult.errorMessage!}`)
        }
        response.send(smsResult)
    }

    private checkSMSAuthentification = async (request: Request, response: Response) => {
        const validatedPhoneNumber = request.params.phone
        
    }
}