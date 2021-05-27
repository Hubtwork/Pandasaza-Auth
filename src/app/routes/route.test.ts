import express, { Request, Response, NextFunction } from "express";
import { SuccessMsgResponse, SuccessResponse, TokenRefreshResponse } from "../../core/responses/response.API";
import { ApiError, InternalError } from "../../core/responses/response.Error";



/*
    SMS 

    routing source :: /sms

*/

const testRouter = express.Router()

testRouter.get('/success',
    async function (req: Request, res: Response, next: NextFunction) {
        new SuccessResponse('success with Data', { data: 'data' }).send(res)
    }
)

testRouter.get('/msg',
    async function (req: Request, res: Response, next: NextFunction) {
        new SuccessMsgResponse('success').send(res)
    }
)

testRouter.get('/token',
    async function (req: Request, res: Response, next: NextFunction) {
        new TokenRefreshResponse('success', { accessToken: 'at', refreshToken: 'rt' }).send(res)
    }
)

testRouter.get('/failure',
    async function (req: Request, res: Response, next: NextFunction) {
        ApiError.handle(new InternalError(), res)
    }
)

export default testRouter