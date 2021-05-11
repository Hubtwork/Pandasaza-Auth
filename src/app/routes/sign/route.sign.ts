import express, { Request, Response, NextFunction } from "express";
import { getCustomRepository } from "typeorm";
import { UserPayload } from "../../../core/jwt/jwt.payload";
import JWT from "../../../core/jwt/jwt.service";
import { SuccessMsgResponse, SuccessResponse, TokenRefreshResponse } from "../../../core/responses/response.API";
import { BadRequestError, InternalError, NotFoundError } from "../../../core/responses/response.Error";
import { AccountRepository } from "../../../database/repository/repository.account";
import { RefreshTokenRepository } from "../../../database/repository/repository.token.refresh";
import UserDTO from "../../../interfaces/interface.DTO.user";
import { getAccessToken, validateUserDTO } from "../../utils/validateUtils";
import validateLogout from "../../validation/validate.logout";
import validateRefreshToken from "../../validation/validate.refreshToken";
import validateRegister from "../../validation/validate.register";


/*
    About Signing

    routing source :: /sign

*/

const signRouter = express.Router()

signRouter.get('/login/:phone',
    async function (req: Request, res: Response, next: NextFunction) {
        try {
            const phone = req.params.phone

            const tokenInDB = await getCustomRepository(RefreshTokenRepository).checkIsLoggedIn(phone)
            if (tokenInDB) throw new BadRequestError('Already logged in')

            const account = await getCustomRepository(AccountRepository).getAccountByPhone(phone)
            if ( !account ) throw new BadRequestError(`No Account with ${phone}`)

            const payload: UserPayload = {
                phone: phone,
                accountId: account.accountId
            }
            const tokens = await JWT.createTokens(payload)

            new SuccessResponse('login success', {
                phone: phone,
                account: account,
                tokens: tokens
            }).send(res)
        } catch (error) {
            next(error)
        }
    }
)

signRouter.post('/logout',
    validateLogout,
    async function (req: Request, res: Response, next: NextFunction) {
        try {
            const delResult = await getCustomRepository(RefreshTokenRepository).deleteToken(req.body.phone)
            if (!delResult) throw new InternalError(`No signed user with ${req.body.phone}`)
            new SuccessMsgResponse(`Logout Success`).send(res)
        } catch(error) {
            next(error)
        }
    }
)

signRouter.post('/register',
    validateRegister,
    async function (req: Request, res: Response, next: NextFunction) {

        const userDTO = req.body as UserDTO
        try {
            const account = await getCustomRepository(AccountRepository).getAccountByPhone(userDTO.phone)
            if ( account ) throw new BadRequestError(`Account already exists with ${userDTO.phone}`)

            const newAccount = await getCustomRepository(AccountRepository).insertAccount(userDTO)
            if ( !newAccount ) throw new InternalError('DB Error')

            const userPayload: UserPayload = {
                phone: newAccount.phone,
                accountId: newAccount.accountId
            }
            const loadedAccount = await getCustomRepository(AccountRepository).getAccountByAccountId(newAccount.accountId)
            const tokens = await JWT.createTokens(userPayload)
            new SuccessResponse('Registered Successfully', { account: loadedAccount, tokens: tokens }).send(res)
        } catch(error) {
            next(error)
        }
        
    }
)

signRouter.post('/refresh', 
    validateRefreshToken,
    async function (req: Request, res: Response, next: NextFunction) {
        try {
            const accessToken = getAccessToken(req.headers.authorization)
            if (!req.body || !req.body.refreshToken) throw new BadRequestError('RefreshToken Needed')
            const refreshToken = req.body.refreshToken
            const tokens = await JWT.renewAccessToken(accessToken, refreshToken)

            new TokenRefreshResponse('Token Issued Successfully', tokens.accessToken, tokens.refreshToken).send(res)
        } catch(error) {
            next(error)
        }
        
    }
)

export default signRouter