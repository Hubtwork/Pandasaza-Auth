import { jwt } from "../../../utils/environments";
import { JwtPayload, Tokens, UserPayload } from "../../../core/jwt/jwt.payload";
import { sign, verify }from 'jsonwebtoken'
import { getCustomRepository } from "typeorm";
import { BadTokenError, InternalError, AuthFailureError, TokenExpiredError } from "../../../core/responses/response.Error";
import { AccountRepository } from "../../../database/repository/repository.account";
import { RefreshTokenRepository } from "../../../database/repository/repository.token.refresh";



export default class MockJWT {

    public static encode(payload: UserPayload, expiration: string | number): string {
        return sign(payload, 'testKey', { issuer: 'tester', algorithm: 'HS256', expiresIn: expiration })
    }

    public static decode(token: string): Promise<JwtPayload> {
        return new Promise<JwtPayload>( (resolve, reject) => {
            const payload = verify(token, 'testKey', { ignoreExpiration: true ,algorithms: ['HS256'], issuer: 'tester' }, (error, decoded) => {
                if (error) {
                    if (error.name == 'TokenExpiredError') { reject(new TokenExpiredError())}
                    reject(new BadTokenError())
                }
                resolve(decoded as JwtPayload)
            })
        })
    }

    public static async validate(token: string): Promise<JwtPayload> {
        return new Promise<JwtPayload>( (resolve, reject) => {
            const payload = verify(token, 'testKey', { algorithms: ['HS256'], issuer: 'tester' }, (error, decoded) => {
                if (error) {
                    if (error.name == 'TokenExpiredError') { reject(new TokenExpiredError())}
                    reject(new BadTokenError())
                }
                resolve(decoded as JwtPayload)
            })
        })
    }

    public static async createTokens(payload: UserPayload): Promise<Tokens> {
        const accessToken = this.encode(payload, String(jwt.access_life))
        const refreshToken = this.encode(payload, String(jwt.refresh_life))
        const token = await getCustomRepository(RefreshTokenRepository).createRefreshToken(payload.phone, payload.accountId, refreshToken)
        if (!token) throw new InternalError()
        return { accessToken, refreshToken }
    }

    public static async renewAccessToken(expiredAccessToken: string, refreshToken: string): Promise<Tokens> {
        // original access token check
        const expiredAccessTokenPayload = await this.decode(expiredAccessToken)
        if (!expiredAccessTokenPayload) throw new BadTokenError()

        // is Token's payload valid ?
        const account = await getCustomRepository(AccountRepository).getAccountByAccountId(expiredAccessTokenPayload.accountId)
        if (!account) throw new AuthFailureError()

        // original refresh token check
        const refreshTokenPayload = await this.validate(refreshToken)
        if (!refreshTokenPayload) throw new BadTokenError()

        // if access / refresh token pair contaminated
        if (expiredAccessTokenPayload.accountId !== refreshTokenPayload.accountId) throw new AuthFailureError('Invalid Token Pair')

        // is given refreshToken already in DB ?
        const refreshTokenInDB = await getCustomRepository(RefreshTokenRepository).checkRefreshToken(refreshToken)
        if (!refreshTokenInDB) throw new AuthFailureError()

        const payload: UserPayload = {
            phone: refreshTokenPayload.phone,
            accountId: refreshTokenPayload.accountId
        }
        // if refreshToken's expiration time under 4days.
        if ( (refreshTokenPayload.exp - refreshTokenPayload.iat) < ( 4 * 24 * 60 * 60 ) ) {
            const delResult = await getCustomRepository(RefreshTokenRepository).deleteToken(refreshToken)
            if (!delResult) throw new InternalError()
            const tokens = await this.createTokens(payload)
            return tokens
        } else {
            const accessToken = this.encode(payload, String(jwt.access_life))
            return { accessToken, refreshToken }
        }
    }
}