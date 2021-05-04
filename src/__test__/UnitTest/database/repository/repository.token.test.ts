import { getCustomRepository } from "typeorm"
import TokenService from "../../../../app/services/service.token"
import { AccountRepository } from "../../../../database/repository/repository.account"
import { RefreshTokenRepository } from "../../../../database/repository/repository.token.refresh"
import { UserRepository } from "../../../../database/repository/repository.user"
import { UserProfileRepository } from "../../../../database/repository/repository.user.profile"

import '../../../database.setup'

describe('UserDetail DB TestSuite', () => {

    let repository: RefreshTokenRepository

    beforeAll( async () => {
        repository = getCustomRepository(RefreshTokenRepository)
        
        const profileRepository = getCustomRepository(UserProfileRepository)
        const userRepository = getCustomRepository(UserRepository)
        const accountRepository = getCustomRepository(AccountRepository)

        const profile1 = await profileRepository.insertUserProfile('master', 'https://imgur.com/d5G3whb')
        const user1 = await userRepository.insertUserDetail(profile1!, 'Dongguk Univ', 'ko')
        await accountRepository.insertAccount('01075187260', user1!)
    })

    it('RefreshToken 생성 ', async () => {
        const accountRepository = getCustomRepository(AccountRepository)
        const account = await accountRepository.findAccount('01075187260')

        const token = await repository.registerToken('01075187260', account!, 'refreshToken')
        console.log(JSON.stringify(token))
        expect(token !== null).toEqual(true)
        expect(token!.account !== null).toEqual(true)
        expect(token!.phone).toBe('01075187260')
        expect(token!.token).toBe('refreshToken')
    })

    it('RefreshToken 조회 ', async () => {
        const token = await repository.checkRefreshToken('refreshToken')
        expect(token !== null).toEqual(true)
        expect(token!.phone).toBe('01075187260')
        expect(token!.token).toBe('refreshToken')
    })

    it('RefreshToken 연동 계정 데이터 조회 ', async () => {
        const data = await repository.getReferenceData('refreshToken')
        expect(data !== null).toEqual(true)
        expect(data!.userId).toBe(1)
        expect(data!.profileId).toBe(1)
    })

    it('RefreshToken 조회 ( 존재하지 않는 token ) ', async () => {
        const token = await repository.checkRefreshToken('token')
        expect(token === null).toEqual(true)
    })

    it('RefreshToken 삭제 ( 존재하지 않는 token ) ', async () => {
        await repository.deleteToken('token')
        const tokenCount = await repository.count()
        expect(tokenCount).toBe(1)
    })

    it('RefreshToken 삭제 ', async () => {
        await repository.deleteToken('RefreshToken')
        const tokenCount = await repository.count()
        const token = await repository.checkRefreshToken('token')
        expect(tokenCount).toBe(0)
        expect(token === null).toEqual(true)
    })

})