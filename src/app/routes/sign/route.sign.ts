import express, { Request, Response, NextFunction } from "express";
import { getCustomRepository } from "typeorm";
import { UserPayload } from "../../../core/jwt/jwt.payload";
import JWT from "../../../core/jwt/jwt.service";
import { SuccessMsgResponse, SuccessResponse, TokenRefreshResponse } from "../../../core/responses/response.API";
import { BadRequestError, InternalError } from "../../../core/responses/response.Error";
import { AccountRepository } from "../../../database/repository/repository.account";
import { UserRepository } from "../../../database/repository/repository.user";
import { UserProfileRepository } from "../../../database/repository/repository.user.profile";
import UserDTO from "../../../interfaces/interface.DTO.user";
import { getAccessToken, validateUserDTO } from "../../utils/validateUtils";


/*
    About Signing

    routing source :: /sign

*/

const authRouter = express.Router()

authRouter.get('/logIn/:phone',
    async function (req: Request, res: Response, next: NextFunction) {
        const phone = req.params.phone

        const account = await getCustomRepository(AccountRepository).getAccountByPhone(phone)
        if ( !account ) throw new BadRequestError(`No Account with ${phone}`)

        const payload: UserPayload = {
            phone: phone,
            accountId: account.accountId
        }
        const tokens = await JWT.createTokens(payload)

        res.status(200).json({
            user: phone,
            currectRoute: 'SignIN'
        })
    }
)

authRouter.post('/register',
    async function (req: Request, res: Response, next: NextFunction) {
        try {
            if (Object.keys(req.body).length > 5) throw new BadRequestError('Invalid Request Body')
            const userDTO = req.body as UserDTO
            if ( !validateUserDTO(userDTO) ) throw new BadRequestError('Invalid Request Body')
            req.body = userDTO
            next()
        } catch(error) {
            next(error)
        }
    },
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

authRouter.post('/refresh', 
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

export default authRouter