

import { JwtPayload, UserPayload } from '../../../core/jwt/jwt.payload'
import JWT from './JWT.mock'

import '../../database.setup'
import { BadTokenError, TokenExpiredError } from '../../../core/responses/response.Error'
import { getCustomRepository } from 'typeorm'
import { AccountRepository } from '../../../database/repository/repository.account'
import UserDTO from '../../../interfaces/interface.DTO.user'

describe('JWT Service Testsuite',() => {

    const user: UserDTO = {
        phone: '010xxxxxxxx',
        profileName: 'master',
        profileImg: 'https://imgur.com/d5G3whb',
        school: 'Dongguk Univ',
        nationality: 'ko'
    }

    const user2: UserDTO = {
        phone: '010yyyyzzzz',
        profileName: 'slave',
        profileImg: 'https://imgur.com/d5G3whb',
        school: 'Seogang Univ',
        nationality: 'ko'
    }
    
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
        const token = JWT.encode(payload, 1)
        // sleep for 2 seconds  ( suppose that token is expired )
        await new Promise(r => setTimeout(r, 2000))
        const decoded = await JWT.decode(token)
        expect(decoded.phone).toBe(phone)
        expect(decoded.accountId).toBe(accountId)
    })

    it('Should validate a valid token for JWT.validate', async () => {
        const payload: UserPayload = { phone, accountId }
        const token = JWT.encode(payload, tokenExpiration)
        const validated = await JWT.validate(token)
        
        expect(validated !== null).toEqual(true)       
        expect(validated.accountId).toBe(accountId)
        expect(validated.phone).toBe(phone)
        expect(validated.iss).toBe(issuer) 
        // check token Expiration Time : 1d ( 60 * 60 * 24 )
        expect(validated.exp - validated.iat).toBe(60 * 60 * 24)
    })

    it('Should throw error for invalid token in JWT.validate', async() => {
        try {
            const token = await JWT.validate('xxx.yyy')
        } catch(error) {
            expect(error).toBeInstanceOf(BadTokenError)
        }
    })

    it('Should throw error for expired token in JWT.validate', async() => {
        const payload: UserPayload = { phone, accountId }
        const token = JWT.encode(payload, 1)
        // sleep for 2 seconds  ( suppose that token is expired )
        await new Promise(r => setTimeout(r, 2000))
        try {
            const validated = await JWT.validate(token)
        } catch(error) {
            expect(error).toBeInstanceOf(TokenExpiredError)
        }
    })

    it('Should generate valid tokens for JWT.createTokens', async() => {
        const account = await getCustomRepository(AccountRepository).insertAccount(user)
        const payload: UserPayload = { phone, accountId: account!.accountId }
        const tokens = await JWT.createTokens(payload)
        
        expect(tokens !== null).toEqual(true)
        expect(tokens).toHaveProperty('accessToken')
        expect(tokens).toHaveProperty('refreshToken')
        expect(typeof tokens.accessToken).toBe('string')
        expect(typeof tokens.refreshToken).toBe('string')
        expect(tokens.accessToken.split('.').length).toBe(3)
        expect(tokens.refreshToken.split('.').length).toBe(3)
    })

    it('Should return renewedTokens for JWT.renewAccessToken', async() => {
        // first check renewed Token is valid
        const account = await getCustomRepository(AccountRepository).insertAccount(user2)
        const payload: UserPayload = { phone: user2.phone, accountId: account!.accountId }
        const { accessToken, refreshToken } = await JWT.createTokens(payload)
        await new Promise(r => setTimeout(r, 2000))
        const newTokens = await JWT.renewAccessToken(accessToken, refreshToken)

        expect(newTokens != null).toEqual(true)
        expect(newTokens).toHaveProperty('accessToken')
        expect(newTokens).toHaveProperty('refreshToken')
        // second check renewed Token & original Token is same on payload properties
        // not on Issued Time, Expired Time
        const validated = await JWT.validate(accessToken)
        const newValidated = await JWT.validate(newTokens.accessToken)

        expect(validated.iat !== newValidated.iat).toEqual(true)
        expect(validated.exp !== newValidated.exp).toEqual(true)
        expect(validated.phone === newValidated.phone).toEqual(true)
        expect(validated.accountId === newValidated.accountId).toEqual(true)
    })

})