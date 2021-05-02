import Token from "../../interfaces/interface.token";
import { jwt } from "../../utils/environments";
import * as JWT from 'jsonwebtoken'
import AuthentificationFailedException from "../exceptions/network/AuthentificationFailed";
import TokenizedData from "../../interfaces/interface.token.data";
import HttpException from "../exceptions/HttpException";


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
        const payload: TokenizedData = { 
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

    public verifyAccessToken(token: string): Promise<TokenizedData> {
        return new Promise( (resolve, reject) => {
            JWT.verify(token, String(jwt.access_key), (error, payload) => {
                if(error) reject(new AuthentificationFailedException())
                resolve(payload as TokenizedData)
            })
        })
    }

    public verifyRefreshToken(token: string): Promise<TokenizedData> {
        return new Promise( (resolve, reject) => {
            JWT.verify(token, String(jwt.refresh_key), (error, payload) => {
                if(error) reject(new AuthentificationFailedException())
                resolve(payload as TokenizedData)
            })
        })
    }

}