import { getCustomRepository } from 'typeorm'
import { AuthPhoneRepository } from '../../../src/repository/repository.auth'
import { Database } from '../../../src/config/database'
import { AuthPhone } from '../../../src/entities/entity.auth.phone'

import '../database.setup'
import { Logger } from '../../../src/utils/logger'

let logger = new Logger()

describe('AuthPhone DB TestSuite', () => {

    it('AuthPhone 데이터 삽입', async () => {
        const uId = 1
        const phone ='01075187260'
        const repository: AuthPhoneRepository = await getCustomRepository(AuthPhoneRepository)
        await repository.addAuthPhone(phone, uId)
        const phoneAuth = await repository.find({ phone })
        logger.info(JSON.stringify(phoneAuth))
        expect(phoneAuth).toHaveLength(1)
        expect(phoneAuth[0].phone).toEqual(phone)
        expect(phoneAuth[0].uId).toEqual(uId)
    })
})  