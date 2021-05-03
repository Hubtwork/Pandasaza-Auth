import Token from "../../interfaces/interface.token";
import { jwt } from "../../utils/environments";
import * as JWT from 'jsonwebtoken'
import AuthentificationFailedException from "../exceptions/network/AuthentificationFailed";
import TokenizedData from "../../interfaces/interface.token.data";
import HttpException from "../exceptions/HttpException";
import AccessTokenExpiredException from "../exceptions/network/AccessTokenExpiredException";
import RefreshTokenExpiredException from "../exceptions/network/RefreshTokenExpiredException";
import { RefreshTokenRepository } from "../../database/repository/repository.token.refresh";
import { getCustomRepository } from "typeorm";
import TokenTuple from "../../interfaces/interface.token.tuple";


export default class TokenService {

    private repository: RefreshTokenRepository

    constructor() {
        this.repository = getCustomRepository(RefreshTokenRepository)
    }

    public checkRefreshToken() {

    }

    public async createTokens(accountId: string, userId: number, profileId: number): Promise<TokenTuple> {
        const accessToken = this.createAccessToken(accountId, userId, profileId)
        const refreshToken = await this.createRefreshToken(accountId, userId, profileId)
        const tokens: TokenTuple = {
            accessToken: accessToken,
            refreshToken: refreshToken
        }
        return tokens
    }

    public async deleteRefreshToken(accountId: string) {
        
    }

    public createAccessToken(accountId: string, userId: number, profileId: number): Token {
        const payload = { 
            accountId: accountId,
            userId: userId,
            profileId: profileId
        }
        let accessToken = JWT.sign(payload, String(jwt.access_key), {
            issuer: 'pandaSaza',
            algorithm: 'HS256',
            expiresIn: String(jwt.access_life)
        })
        const token: Token = {
            token: accessToken,
            expiresIn: String(jwt.access_life)
        }
        return token
    }

    /**
     *  Async Function for creating RefreshToken
     *  => It needs asynchronous ( creating refresh token on db )
     * 
     * @param accountId 
     * @param userId 
     * @param profileId 
     * @returns 
     */
    public async createRefreshToken(accountId: string, userId: number, profileId: number): Promise<Token> {
        const payload: TokenizedData = { 
            accountId: accountId,
            userId: userId,
            profileId: profileId
        }
        let refreshToken = JWT.sign(payload, String(jwt.refresh_key), {
            issuer: 'pandaSaza',
            algorithm: 'HS256',
            expiresIn: String(jwt.refresh_life)
        })
        const token: Token = {
            token: refreshToken,
            expiresIn: String(jwt.refresh_life)
        }
        // save the token to db
        await this.repository.registerToken(accountId, refreshToken)

        return token
    }

    public verifyAccessToken(token: string): Promise<TokenizedData> {
        return new Promise( (resolve, reject) => {
            JWT.verify(token, String(jwt.access_key), (error, payload) => {
                if(error) {
                    if (error.name =='TokenExpiredError') reject(new AccessTokenExpiredException())
                    reject(new AuthentificationFailedException())
                }
                resolve(payload as TokenizedData)
            })
        })
    }

    public verifyRefreshToken(token: string): Promise<TokenizedData> {
        return new Promise( (resolve, reject) => {
            JWT.verify(token, String(jwt.refresh_key), (error, payload) => {
                if(error) {
                    if (error.name =='TokenExpiredError') reject(new RefreshTokenExpiredException())
                    reject(new AuthentificationFailedException())
                }
                resolve(payload as TokenizedData)
            })
        })
    }

}