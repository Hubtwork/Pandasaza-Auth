import Token from "../../interfaces/interface.token";
import { jwt } from "../../utils/environments";
import * as JWT from 'jsonwebtoken'
import TokenizedData from "../../interfaces/interface.token.data";
import { RefreshTokenRepository } from "../../database/repository/repository.token.refresh";
import { getCustomRepository } from "typeorm";
import TokenTuple from "../../interfaces/interface.token.tuple";
import { AccountRepository } from "../../database/repository/repository.account";
import { Logger } from "../../utils/logger";
import { Account } from "../../database/entities/entity.account";
import InternalServerException from "../exceptions/network/InternalServerException";
import VerifiedAccessTokenData from "../../interfaces/interface.token.payload";
import AccessTokenExpiredException from "../exceptions/jwt/AccessTokenExpiredException";
import RefreshTokenExpiredException from "../exceptions/jwt/RefreshTokenExpiredException";
import InvalidSignatureException from "../exceptions/jwt/InvalidSignatureException";


export default class TokenService {

    private logger: Logger = new Logger()
    private repository: RefreshTokenRepository

    constructor() {
        this.repository = getCustomRepository(RefreshTokenRepository)
    }

    public async createTokens(phone: string): Promise<TokenTuple | null> {
        const accountRepository = getCustomRepository(AccountRepository)
        const account = await accountRepository.findAccount(phone)
        if (!account) return null
        if (!(account.user)) return null
        if (!(account.user.profile)) return null
        const payload: TokenizedData = {
            accountId: account.accountId,
            userId: account.user.uId,
            profileId: account.user.profile.profileId
        }
        const accessToken = this.createAccessToken(payload)
        const refreshToken = await this.createRefreshToken(phone, account)
        if (!refreshToken) { 
            return null
        }
        const tokens: TokenTuple = {
            accessToken: accessToken,
            refreshToken: refreshToken
        }
        return tokens
    }

    // for signOut Method
    public async deleteRefreshToken(refreshToken: string): Promise<boolean> {
        try {
            const delResult = await this.repository.deleteToken(refreshToken)
            return true
        } catch(error) {
            return false
        }
    }

    public createAccessToken(payload: TokenizedData): Token {
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

    public async renewAccessToken(refreshToken: string): Promise<Token | null> {
        try {
            const payload = await this.repository.getReferenceData(refreshToken)
            if(!payload) return null
            const accessToken = this.createAccessToken(payload)
            return accessToken
        } catch(error) {
            return null
        }
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
    public async createRefreshToken(phone: string, account: Account): Promise<Token | null> {
        let refreshToken = JWT.sign({}, String(jwt.refresh_key), {
            issuer: 'pandaSaza',
            algorithm: 'HS256',
            expiresIn: String(jwt.refresh_life)
        })
        const token: Token = {
            token: refreshToken,
            expiresIn: String(jwt.refresh_life)
        }
        try {
            // save the token to db
            const savedToken = await this.repository.registerToken(phone, account, refreshToken)
            return token
        } catch(error) {
            return null
        }
    }

    public async verifyAccessToken(token: string): Promise<VerifiedAccessTokenData> {
        return new Promise<VerifiedAccessTokenData>( (resolve, reject) => {
            const payload = JWT.verify(token, String(jwt.access_key), { algorithms: ['HS256'], issuer: 'pandaSaza' }, (error, decoded) => {
                if (error) {
                    if (error.name == 'TokenExpiredError') { reject(new AccessTokenExpiredException())}
                    else if (error.name == 'JsonWebTokenError') { reject(new InvalidSignatureException()) }
                    else if (error.name == 'NotBeforeError') { reject(error) }
                }
                resolve(decoded as VerifiedAccessTokenData)
            })
        })
    }

    public async verifyRefreshToken(token: string): Promise<boolean> {
        return new Promise<boolean>( (resolve, reject) => {
            const payload = JWT.verify(token, String(jwt.refresh_key), { algorithms: ['HS256'], issuer: 'pandaSaza' }, (error, decoded) => {
                if (error) {
                    if (error.name == 'TokenExpiredError') { reject(new RefreshTokenExpiredException()) }
                    else if (error.name == 'JsonWebTokenError') { reject(new InvalidSignatureException()) }
                    else if (error.name == 'NotBeforeError') { reject(error) }
                }
                resolve(true)
            })
        })
    }

}