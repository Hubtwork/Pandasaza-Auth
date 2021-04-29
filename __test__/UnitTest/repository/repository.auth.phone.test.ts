import { getCustomRepository } from 'typeorm'
import { AuthPhoneRepository } from '../../../src/repository/repository.auth'
import { Database } from '../../../src/config/database'
import { AuthPhone } from '../../../src/entities/entity.auth.phone'

import '../database.setup'
import { Logger } from '../../../src/utils/logger'

let logger = new Logger()

// All Covered
describe('AuthPhone DB TestSuite', () => {

    it('AuthPhone 데이터 삽입', async () => {
        const uId = 1
        const phone ='01075187260'
        const repository: AuthPhoneRepository = await getCustomRepository(AuthPhoneRepository)
        await repository.insertAuthPhone(phone, uId)
        const phoneAuth = await repository.find({ phone })
        expect(phoneAuth).toHaveLength(1)
        expect(phoneAuth[0].phone).toEqual(phone)
        expect(phoneAuth[0].uId).toEqual(uId)
    })

    it('AuthPhone 데이터 조회', async () => {
        const uId = 2
        const phone ='01033214444'
        const repository: AuthPhoneRepository = await getCustomRepository(AuthPhoneRepository)
        await repository.insertAuthPhone(phone, uId)
        await repository.insertAuthPhone('01041452569', 3)
        const pA1 = await repository.isPhoneExists('01033214444')
        const pA2 = await repository.isPhoneExists('01041452569')        
        const pAwrong = await repository.isPhoneExists('01000000000')
        expect(pA1!.uId).toEqual(uId)
        expect(pA1!.phone).toEqual(phone)
        expect(pA2!.uId).toEqual(3)
        expect(pA2!.phone).toEqual('01041452569')
        expect(pAwrong).toEqual(null)
        const pA0 = await repository.isPhoneExists('01075187260')
        expect(pA0!.uId).toEqual(1)
    })

    it('AuthPhone 데이터 삭제', async () => {
        const repository: AuthPhoneRepository = await getCustomRepository(AuthPhoneRepository)
        const allCount = await repository.count()
        const pA0 = await repository.isPhoneExists('01075187260')
        // upper tests, already 3 data inserted.
        expect(allCount).toEqual(3)
        expect(pA0 !== null).toEqual(true)
        await repository.deleteAuthPhone('01075187260')
        const reducedCount = await repository.count()
        const pA1 = await repository.isPhoneExists('01075187260')
        expect(reducedCount).toEqual(2)
        expect(pA1 === null).toEqual(true)
    })
})  