import { Router, Request, Response, NextFunction } from "express";
import Controller from "../../interfaces/controller";
import { SmsService } from "../services/service.sms";
import { SMSResult } from "../../types/return_types";
import { Logger } from "../../utils/logger";



export default class SmsController implements Controller {
    private logger: Logger
    private service: SmsService

    public path = '/sms'
    public router = Router()

    constructor() {
        this.service = new SmsService()
        this.logger = new Logger()
        this.constructRouters()
    }

    private constructRouters() {
        this.router.get(`${this.path}/validate/:phone`, this.launchSMSAuthentification)
        this.router.get(`${this.path}/scan/:phone`, this.checkSMSAuthentification)
    }

    private launchSMSAuthentification = async (request: Request, response: Response, next: NextFunction) => {
        const targetPhoneNumber = request.params.phone
        const smsResult: SMSResult = await this.service.callExternalSmsService(targetPhoneNumber)
        if (smsResult.isSuccess) {
            this.logger.info(` Send validation code [ ${smsResult.validationCode!} ] to [ ${targetPhoneNumber} ] successfully`)
        } else {
            this.logger.error(` Sebd validation code to [ ${targetPhoneNumber} ] failed.\nReason : ${smsResult.errorMessage!}`)
        }
        response.send(smsResult)
    }

    private checkSMSAuthentification = async (request: Request, response: Response, next: NextFunction) => {
        const validatedPhoneNumber = request.params.phone
        const searchedAccount = await this.service.scanAccount(validatedPhoneNumber)
        if (searchedAccount) { response.redirect(`/auth/signIn/${validatedPhoneNumber}`) }
        else { response.redirect(`/auth/register/${validatedPhoneNumber}`) }
    }
}