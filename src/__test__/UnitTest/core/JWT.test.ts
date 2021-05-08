

import { JwtPayload, UserPayload } from '../../../core/jwt/jwt.payload'
import JWT from './JWT.mock'

import '../../database.setup'
import { BadTokenError } from '../../../core/responses/response.Error'

function sleep(t: number){
    return new Promise(resolve=>setTimeout(resolve,t))
 }

describe('JWT Service Testsuite',() => {

    const phone = '010xxxxxxxx'
    const accountId = 'accountId'
    const issuer = 'tester'
    
    const tokenExpiration = '1d'

    it('Should generate a valid token for JWT.encode', () => {
        const payload: UserPayload = { phone, accountId }
        const token = JWT.encode(payload, tokenExpiration)

        expect(typeof token).toBe('string')
        // token format : xxx.yyy.zzz
        expect(token.split('.').length).toBe(3)
    })

    it('Should decode a valid token for JWT.decode', async () => {
        const payload: UserPayload = { phone, accountId }
        const token = JWT.encode(payload, tokenExpiration)
        const decoded = await JWT.decode(token)

        expect(decoded !== null).toEqual(true)       
        expect(decoded.accountId).toBe(accountId)
        expect(decoded.phone).toBe(phone)
        expect(decoded.iss).toBe(issuer) 
        // check token Expiration Time : 1d ( 60 * 60 * 24 )
        expect(decoded.exp - decoded.iat).toBe(60 * 60 * 24)
    })

    it('Should throw error for invalid token in JWT.decode', async () => {
        try {
            const token = await JWT.decode('xx.111')
        } catch(error) {
            expect(error).toBeInstanceOf(BadTokenError)
        }
    })

    it('Should decode a expired token for JWT.decode', async () => {
        const payload: UserPayload = { phone, accountId }
        const token = JWT.encode(payload, 3)
        await sleep(5)
        const decoded = await JWT.decode(token)
        expect(decoded.phone).toBe(phone)
        expect(decoded.accountId).toBe(accountId)
    })




})