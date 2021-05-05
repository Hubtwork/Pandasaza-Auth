import { Router, Request, Response, NextFunction } from "express";
import Token from "../../interfaces/interface.token";
import TokenizedData from "../../interfaces/interface.token.data";
import { Logger } from "../../utils/logger";
import AllTokenExpiredException from "../exceptions/jwt/AllTokenExpiredException";
import ForbiddenException from "../exceptions/network/ForbiddenException";
import InternalServerException from "../exceptions/network/InternalServerException";
import MissingAuthentificationTokenException from "../exceptions/network/MissingAuthentificationTokenException";
import TokenService from "../services/service.token";




class AuthMiddleware {
    
    private logger: Logger = new Logger()
    
    private createCookie = (name: string, token: Token) => { return `${name}=${token.token}; HttpOnly; Max-Age=${token.expiresIn}` }
    
    private service: TokenService = new TokenService()
    
    public async jwtValidation(request: Request, response: Response, next: NextFunction) {
        const cookies = request.cookies
        if ( cookies && cookies.AccessToken && cookies.RefreshToken ) {
            try {
                const verifiedAccessToken = await this.service.verifyAccessToken(cookies.AccessToken)
                const verifiedRefreshToken = await this.service.verifyRefreshToken(cookies.RefreshToken)
                if (verifiedAccessToken === null) {
                    if (verifiedRefreshToken === null) {
                        // accessToken & refreshToken all Expired
                        next(new AllTokenExpiredException())
                    } else {
                        // accessToken expired 
                        // refreshToken valid
                        const accessToken = await this.service.renewAccessToken(cookies.RefreshToken)
                        response.setHeader('Set-Cookie', [this.createCookie('AccessToken', accessToken!)])
                        request.cookies.AccessToken = accessToken
                    }
                } else {
                    // accessToken valid
                    // refreshToken expired
                    if (verifiedRefreshToken === null) {
                        const userPhone = verifiedAccessToken.phone
                        
                        const tokens = await this.service.renewTokens(cookies.RefreshToken, userPhone)
                        if (!tokens) next(new ForbiddenException())
                        response.setHeader('Set-Cookie', [this.createCookie('AccessToken', tokens!.accessToken)])
                        response.setHeader('Set-Cookie', [this.createCookie('RefreshToken', tokens!.refreshToken)])
                    } else {
                        // all tokens are valid    
                        next()
                    }
                }
            } catch(error) {
                this.logger.error(error)
                next(new InternalServerException())
            }   
        } else {
            next(new MissingAuthentificationTokenException())
        }
    }

}