import { SENS, SMS } from 'ncp-client'
import { getConnection, getCustomRepository } from 'typeorm'
import { Account } from '../../database/entities/entity.account'
import { AccountRepository } from '../../database/repository/repository.account'
import { NCPAuthKeyType, SMSserviceAuthType } from '../../types/auth.types'
import { SMSResult } from '../../types/return_types'
import { ncp_auth, sens } from '../../utils/environments'
import cache from 'memory-cache'


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

        // Save Key-Value ( Phone-ValidationCode ) in In-Memory Cache
        cache.put(targetPhone, code)

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

    public async scanAccount(validatedPhoneNumber: string): Promise<Account | null> {
        const accountRepository = getCustomRepository(AccountRepository)
        const account = await accountRepository.getAccountByPhone(validatedPhoneNumber)
        // means no account with phoneNumber
        if (!account) return null
        return account
    }
}