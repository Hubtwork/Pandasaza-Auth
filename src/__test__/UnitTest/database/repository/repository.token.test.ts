import { getCustomRepository } from "typeorm"
import { AccountRepository } from "../../../../database/repository/repository.account"
import { RefreshTokenRepository } from "../../../../database/repository/repository.token.refresh"
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
        const token = await repository.checkRefreshToken('refreshToken')
        await repository.deleteToken(token!.tokenId)
        const tokenCount = await repository.count()
        const deletedToken = await repository.checkRefreshToken('refreshToken')
        expect(tokenCount).toBe(0)
        expect(token === null).toEqual(true)
    })

})