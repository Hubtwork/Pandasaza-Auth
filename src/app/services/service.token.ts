import Token from "../../interfaces/interface.token";
import { jwt } from "../../utils/environments";
import * as JWT from 'jsonwebtoken'


export default class TokenService {

    public createAccessToken(accountId: string, userId: number, profileId: number): Token {
        const payload = { 
            accountId: accountId,
            userId: userId,
            profileId: profileId
        }
        let accessToken = JWT.sign(payload, String(jwt.access_key), {
            algorithm: 'HS256',
            expiresIn: Number(jwt.access_life)
        })
        const token: Token = {
            token: accessToken,
            expiresIn: Number(jwt.access_life)
        }
        return token
    }

    public createRefreshToken(accountId: string, userId: number, profileId: number): Token {
        const payload = { 
            accountId: accountId,
            userId: userId,
            profileId: profileId
        }
        let refreshToken = JWT.sign(payload, String(jwt.refresh_key), {
            algorithm: 'HS256',
            expiresIn: Number(jwt.refresh_life)
        })
        const token: Token = {
            token: refreshToken,
            expiresIn: Number(jwt.refresh_life)
        }
        return token
    }

}