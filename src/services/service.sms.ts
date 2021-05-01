import { SENS, SMS } from 'ncp-client'
import { NCPAuthKeyType, SMSserviceAuthType } from '../types/auth.types'
import { SMSResult } from '../types/return_types'
import { ncp_auth, sens } from '../utils/environments'


export class SmsService {

    private smsClient: SMS
    private validationMessage = (code: string): string => {
        return `[ PandaSaza ]\nValidation Code : ${code}`
    }

    constructor() {
        this.smsClient = this.loadAuthentications()
    }

    private loadAuthentications() {
        const ncpAuth: NCPAuthKeyType = { 
            accessKey: ncp_auth.accessKey!,
            secretKey: ncp_auth.secretKey!
        }
        const smsAuth: SMSserviceAuthType = {
            phone: sens.phone!,
            serviceId: sens.clientId!
        }
        return new SENS().smsService(ncpAuth, smsAuth)
    }

    public generatePassword() {
        const codeTable = '0123456789'
        let code = ''
        for (let i = 0; i < 4; i++) {
            code += codeTable[Math.floor(Math.random() * codeTable.length)]
        }
        return code
    }
    
    public async callExternalSmsService(targetPhone: string): Promise<SMSResult> {
        const code = this.generatePassword()
        const { isSuccess, data, errorMessage } = await this.smsClient.sendSMS({
            to: targetPhone,
            content: this.validationMessage(code)
        })
        let response: SMSResult
        if (isSuccess) {
            response = {
                isSuccess: true,
                validationCode: code
            }
        } else {
            response = {
                isSuccess: false,
                errorMessage: errorMessage
            }
        }
        return response
    }
}