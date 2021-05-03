import TokenService from "../../../app/services/service.token"
import { jwt } from '../../../utils/environments'
import * as JWT from 'jsonwebtoken'
import Token from "../../../interfaces/interface.token"
import TokenizedData from "../../../interfaces/interface.token.data"
import HttpException from "../../../app/exceptions/HttpException"
import { Logger } from "../../../utils/logger"

describe('TokenService TestSuite', () => {
    
    let logger = new Logger()
    let service: TokenService

    const accountId = '731134b4-f673-42c1-a6b3-89e352428741'
    const userId = 1
    const profileId = 1

    let accessToken: Token
    let refreshToken: Token

    beforeAll(()=> {
        service = new TokenService()
    })

    it('JWT Access Token 생성', () => {
        accessToken = service.createAccessToken(accountId, userId, profileId)
        const token: Token = accessToken
        expect(token != null).toEqual(true)
        expect(token.expiresIn).toBe(String(jwt.access_life))
        expect(token.token !== null).toEqual(true)
    })

    it('JWT Refresh Token 생성', async () => {
        refreshToken = await service.createRefreshToken(accountId, userId, profileId)
        const token: Token = refreshToken
        expect(token != null).toEqual(true)
        expect(token.expiresIn).toBe(String(jwt.refresh_life))
        expect(token.token !== null).toEqual(true)
    })

    it('JWT Access Token 인증 ', async () => {
        let exception: HttpException | null = null
        let payload: TokenizedData | null = null
        try {
            payload = await service.verifyAccessToken(accessToken.token)
        } catch(error) {
            exception = error
        }
        expect(exception === null).toEqual(true)
        expect(payload !== null).toEqual(true)
        expect(payload!.accountId).toBe(accountId)
        expect(payload!.userId).toBe(userId)
        expect(payload!.profileId).toBe(profileId)
    })

    it('JWT Refresh Token 인증 ', async () => {
        let exception: HttpException | null = null
        let payload: TokenizedData | null = null
        try {
            payload = await service.verifyRefreshToken(refreshToken.token)
        } catch(error) {
            exception = error
        }
        expect(exception === null).toEqual(true)
        expect(payload !== null).toEqual(true)
        expect(payload!.accountId).toBe(accountId)
        expect(payload!.userId).toBe(userId)
        expect(payload!.profileId).toBe(profileId)
    })

    it('JWT Token 인증 ( 잘못된 Secret Key )', async () => {

        let exception: HttpException | null = null
        let payload: TokenizedData | null = null
        try {
            payload = await service.verifyAccessToken(refreshToken.token)
        } catch(error) {
            console.log('에러 발생', error.message)
            exception = error
        }
        expect(exception !== null).toEqual(true)
        expect(exception!.message === 'Authentification Failed').toEqual(true)
        expect(payload === null).toEqual(true)
    })

    it('JWT Token 만료 error check', async () => {

        let exception: HttpException | null = null
        let payload: TokenizedData | null = null
        const token = JWT.sign({}, String(jwt.access_key), {
            algorithm: 'HS256',
            expiresIn: 1
        })
        try {
            await new Promise(r => setTimeout(r, 2000))
            payload = await service.verifyAccessToken(token)
        } catch(error) {
            console.log(error.message)
            exception = error
        }
        expect(exception !== null).toEqual(true)
        expect(exception!.message === 'Access Token Expired').toEqual(true)
        expect(payload === null).toEqual(true)
    })

})