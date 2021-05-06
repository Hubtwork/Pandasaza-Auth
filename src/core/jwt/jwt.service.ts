import { jwt } from "../../utils/environments";
import { JwtPayload, Tokens, UserPayload } from "./jwt.payload";
import { sign, verify }from 'jsonwebtoken'
import { AuthFailureError, BadTokenError, InternalError, TokenExpiredError } from "../responses/response.Error";
import { getCustomRepository } from "typeorm";
import { RefreshTokenRepository } from "../../database/repository/repository.token.refresh";
import { AccountRepository } from "../../database/repository/repository.account";



export default class JWT {

    private static encode(payload: UserPayload, key: string, expiration: string): string {
        return sign(payload, key, { issuer: 'pandaSaza', algorithm: 'HS256', expiresIn: expiration })
    }

    private static decode(token: string): Promise<JwtPayload> {
        return new Promise<JwtPayload>( (resolve, reject) => {
            const payload = verify(token, String(jwt.access_key), { ignoreExpiration: true ,algorithms: ['HS256'], issuer: 'pandaSaza' }, (error, decoded) => {
                if (error) {
                    if (error.name == 'TokenExpiredError') { reject(new TokenExpiredError())}
                    reject(new BadTokenError())
                }
                resolve(decoded as JwtPayload)
            })
        })
    }

    private static async validate(token: string, key: string): Promise<JwtPayload> {
        return new Promise<JwtPayload>( (resolve, reject) => {
            const payload = verify(token, key, { algorithms: ['HS256'], issuer: 'pandaSaza' }, (error, decoded) => {
                if (error) {
                    if (error.name == 'TokenExpiredError') { reject(new TokenExpiredError())}
                    reject(new BadTokenError())
                }
                resolve(decoded as JwtPayload)
            })
        })
    }

    public static async createTokens(payload: UserPayload): Promise<Tokens> {
        const accessToken = this.encode(payload, String(jwt.access_key), String(jwt.access_life))
        const refreshToken = this.encode(payload, String(jwt.refresh_key), String(jwt.refresh_life))
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
        const refreshTokenPayload = await this.validate(refreshToken, String(jwt.refresh_key))
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
            const accessToken = this.encode(payload, String(jwt.access_key), String(jwt.access_life))
            return { accessToken, refreshToken }
        }
    }
}