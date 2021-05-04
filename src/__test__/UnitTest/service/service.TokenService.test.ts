import TokenService from "../../../app/services/service.token"
import { jwt } from '../../../utils/environments'
import * as JWT from 'jsonwebtoken'
import Token from "../../../interfaces/interface.token"
import TokenizedData from "../../../interfaces/interface.token.data"
import HttpException from "../../../app/exceptions/HttpException"
import { Logger } from "../../../utils/logger"

import '../../database.setup'
import { getCustomRepository } from "typeorm"
import { AccountRepository } from "../../../database/repository/repository.account"
import { UserProfileRepository } from "../../../database/repository/repository.user.profile"
import { UserRepository } from "../../../database/repository/repository.user"
import InternerServerException from "../../../app/exceptions/network/InternalServerException"
import VerifiedTokenData from "../../../interfaces/interface.token.payload"

describe('TokenService TestSuite', () => {
    
    let logger = new Logger()
    let service: TokenService

    let payload: TokenizedData | null
    let accessToken: Token | null
    let refreshToken: Token | null

    beforeAll( async ()=> {
        service = new TokenService()

        const profileRepository = getCustomRepository(UserProfileRepository)
        const userRepository = getCustomRepository(UserRepository)
        const accountRepository = getCustomRepository(AccountRepository)

        const profile1 = await profileRepository.insertUserProfile('master', 'https://imgur.com/d5G3whb')
        const user1 = await userRepository.insertUserDetail(profile1!, 'Dongguk Univ', 'ko')
        await accountRepository.insertAccount('01075187260', user1!)

        payload = await accountRepository.getTokenData('01075187260')
    })

    it('JWT Access Token 생성', () => {
        accessToken = service.createAccessToken(payload!)
        const token: Token = accessToken
        expect(token != null).toEqual(true)
        expect(token.expiresIn).toBe(String(jwt.access_life))
        expect(token.token !== null).toEqual(true)
    })

    it('JWT Refresh Token 생성', async () => {
        const accountRepository = getCustomRepository(AccountRepository)
        const account = await accountRepository.findAccount('01075187260')
        refreshToken = await service.createRefreshToken('01075187260', account!)
        const token: Token = refreshToken!
        expect(token != null).toEqual(true)
        expect(token.expiresIn).toBe(String(jwt.refresh_life))
        expect(token.token !== null).toEqual(true)
    })

    it('JWT Access Token 인증 ', async () => {
        let exception: HttpException | null = null
        let tokenizedData: VerifiedTokenData | null = null
        try {
            tokenizedData = await service.verifyAccessToken(accessToken!.token)
        } catch(error) {
            exception = error
        }
        expect(exception === null).toEqual(true)
        expect(tokenizedData !== null).toEqual(true)
        expect(tokenizedData!.accountId).toBe(payload?.accountId)
        expect(tokenizedData!.userId).toBe(payload?.userId)
        expect(tokenizedData!.profileId).toBe(payload?.profileId)
    })

    it('JWT Refresh Token 인증 ', async () => {
        let exception: HttpException | null = null
        let isRefreshTokenValid: boolean = false
        try {
            isRefreshTokenValid = await service.verifyRefreshToken(refreshToken!.token)
        } catch(error) {
            console.log(' 인증 error ', error.message)
            exception = error
        }
        expect(exception === null).toEqual(true)
        expect(isRefreshTokenValid).toBe(true)
    })

    it('JWT Token 인증 ( 잘못된 Secret Key )', async () => {

        let exception: HttpException | null = null
        let tokenizedData: VerifiedTokenData | null = null
        try {
            tokenizedData = await service.verifyAccessToken(refreshToken!.token)
        } catch(error) {
            console.log(error.message)
            exception = error
        }
        expect(exception !== null).toEqual(true)
        expect(exception!.message === '[ JWT ] Tried to Verify with Invalid Signature').toEqual(true)
        expect(tokenizedData === null).toEqual(true)
    })

    it('JWT Token 만료 error check', async () => {

        let exception: HttpException | null = null
        let tokenizedData: VerifiedTokenData | null = null
        const token = JWT.sign({}, String(jwt.access_key), {
            algorithm: 'HS256',
            expiresIn: 1
        })
        try {
            await new Promise(r => setTimeout(r, 2000))
            tokenizedData = await service.verifyAccessToken(token)
        } catch(error) {
            exception = error
        }
        expect(exception !== null).toEqual(true)
        expect(exception!.message === '[ JWT ] Access Token Expired').toEqual(true)
        expect(tokenizedData === null).toEqual(true)
    })

    it('JWT AccessToken 갱신 ', async () => {
        let exception: HttpException | null = null
        let verifiedAccessToken: TokenizedData | null = null

        const expiredAccessToken = JWT.sign(payload!, String(jwt.access_key), {
            algorithm: 'HS256',
            expiresIn: 1
        })
        await new Promise(r => setTimeout(r, 2000))
        try {
            const newAccessToken = await service.renewAccessToken(refreshToken!.token)
            if (!newAccessToken) throw new InternerServerException()
            verifiedAccessToken = await service.verifyAccessToken(newAccessToken!.token)
        } catch(error) {
            exception = error
        }
        expect(exception === null).toEqual(true)
        expect(verifiedAccessToken !== null).toEqual(true)
        expect(verifiedAccessToken!.accountId).toBe(payload?.accountId)
        expect(verifiedAccessToken!.userId).toBe(payload?.userId)
        expect(verifiedAccessToken!.profileId).toBe(payload?.profileId)
    })

})