import { Request, Response, NextFunction } from "express"
import { getCustomRepository } from "typeorm"
import JWT from "../../core/jwt/jwt.service"
import { AccessTokenError, AuthFailureError, TokenExpiredError } from "../../core/responses/response.Error"
import { AccountRepository } from "../../database/repository/repository.account"
import { jwt } from "../../utils/environments"
import { getAccessToken, getRefreshToken, validateTokenData } from "../utils/validateUtils"

export default async function (req: Request, res: Response, next: NextFunction) {
    try {
        const accessToken = getAccessToken(req.headers.authorization)
        const payload = await JWT.validate(accessToken, jwt.access_key!)
        validateTokenData(payload)

        const account = await getCustomRepository(AccountRepository).getAccountByAccountId(payload.accountId)
        if (!account) throw new AuthFailureError('Account not registered')
        req.body.accountId = account.accountId

        next()
    } catch(error) {
        if (error instanceof TokenExpiredError) throw new AccessTokenError(error.message)
        next(error)
    }
}