import TokenService from "../../../app/services/service.token"
import * as JWT from 'jsonwebtoken'
import { jwt } from '../../../utils/environments'
import Token from "../../../interfaces/interface.token"



describe('TokenService TestSuite', () => {
    
    let service: TokenService

    const accountId = '731134b4-f673-42c1-a6b3-89e352428741'
    const userId = 1
    const profileId = 1

    beforeAll(()=> {
        service = new TokenService()
    })

    it('JWT Access Token 생성', () => {
        const token: Token = service.createAccessToken(accountId, userId, profileId)
        expect(token != null).toEqual(true)
        expect(token.expiresIn).toBe(Number(jwt.access_life))
        expect(token.token !== null).toEqual(true)
    })

    it('JWT Refresh Token 생성', () => {
        const token: Token = service.createRefreshToken(accountId, userId, profileId)
        expect(token != null).toEqual(true)
        expect(token.expiresIn).toBe(Number(jwt.access_life))
        expect(token.token !== null).toEqual(true)
    })
})