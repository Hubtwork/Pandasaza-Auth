import { getCustomRepository } from "typeorm"
import TokenService from "../../../../app/services/service.token"
import { AccountRepository } from "../../../../database/repository/repository.account"
import { RefreshTokenRepository } from "../../../../database/repository/repository.token.refresh"
import { UserRepository } from "../../../../database/repository/repository.user"
import { UserProfileRepository } from "../../../../database/repository/repository.user.profile"
import UserDTO from "../../../../interfaces/interface.DTO.user"

import '../../../database.setup'

describe('UserDetail DB TestSuite', () => {

    let repository: RefreshTokenRepository

    const user1: UserDTO = {
        phone: '010xxxxyyyy',
        profileName: 'master',
        profileImg: 'https://imgur.com/d5G3whb',
        school: 'Dongguk Univ',
        nationality: 'ko'
    }


    beforeAll( async () => {
        repository = getCustomRepository(RefreshTokenRepository)
        
        const accountRepository = getCustomRepository(AccountRepository)
        await accountRepository.insertAccount(user1)
    })

    it('RefreshToken 생성 ', async () => {
        const accountRepository = getCustomRepository(AccountRepository)
        const account = await accountRepository.getAccountByPhone('010xxxxyyyy')

        const token = await repository.registerToken('010xxxxyyyy', account!, 'refreshToken')
        console.log(JSON.stringify(token))
        expect(token !== null).toEqual(true)
        expect(token!.account !== null).toEqual(true)
        expect(token!.phone).toBe('010xxxxyyyy')
        expect(token!.token).toBe('refreshToken')
    })

    it('RefreshToken 조회 ', async () => {
        const token = await repository.checkRefreshToken('refreshToken')
        expect(token !== null).toEqual(true)
        expect(token!.phone).toBe('010xxxxyyyy')
        expect(token!.token).toBe('refreshToken')
    })

    it('RefreshToken 연동 계정 데이터 조회 ', async () => {
        const data = await repository.getReferenceData('refreshToken')
        expect(data !== null).toEqual(true)
        expect(data!.userId).toBe(1)
        expect(data!.profileId).toBe(1)
    })

    it('RefreshToken 조회 ( 존재하지 않는 phone ) ', async () => {
        const token = await repository.checkRefreshToken('token')
        expect(token === null).toEqual(true)
    })

    it('RefreshToken 삭제 ( 존재하지 않는 phone ) ', async () => {
        await repository.deleteToken('010yyyyzzzz')
        const tokenCount = await repository.count()
        expect(tokenCount).toBe(1)
    })

    it('RefreshToken 삭제 ', async () => {
        await repository.deleteToken(user1.phone)
        const tokenCount = await repository.count()
        const token = await repository.checkRefreshToken('refreshToken')
        expect(tokenCount).toBe(0)
        expect(token === null).toEqual(true)
    })

})