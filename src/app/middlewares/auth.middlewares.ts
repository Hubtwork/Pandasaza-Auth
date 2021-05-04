import { Router, Request, Response, NextFunction } from "express";
import TokenizedData from "../../interfaces/interface.token.data";
import AllTokenExpiredException from "../exceptions/network/AllTokenExpiredException";
import MissingAuthentificationTokenException from "../exceptions/network/MissingAuthentificationTokenException";
import { AuthentificationService } from "../services/service.auth";
import TokenService from "../services/service.token";




class AuthMiddleware {
    
    private service: TokenService = new TokenService()
    
    public async jwtValidation(request: Request, response: Response, next: NextFunction) {
        const cookies = request.cookies
        if ( cookies && cookies.AccessToken && cookies.RefreshToken ) {

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
                }
            }
            
        } else {
            next(new MissingAuthentificationTokenException())
        }
    }

}