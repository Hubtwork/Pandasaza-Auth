import express, { Request, Response, NextFunction } from "express";
import { FailureMsgResponse, SuccessMsgResponse, SuccessResponse, TokenRefreshResponse } from "../../core/responses/response.API";
import { ApiError, InternalError } from "../../core/responses/response.Error";
import cache from 'memory-cache'



/*
    SMS 

    routing source :: /sms

*/

function generatePassword() {
    const codeTable = '0123456789'
    let code = ''
    for (let i = 0; i < 4; i++) {
        code += codeTable[Math.floor(Math.random() * codeTable.length)]
    }
    return code
}

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

testRouter.get('/cache',
    function (req: Request, res: Response, next: NextFunction) {
        const cacheData = cache.keys()
        
        if (cacheData.length == 0) new FailureMsgResponse('cache is empty').send(res)
        else new SuccessResponse('get Caches', { keys: cacheData }).send(res)
    }
)

testRouter.get('/putCache/:key',
    function (req: Request, res: Response, next: NextFunction) {
        const code = generatePassword()
        cache.put(req.params.key, code, 5*60*1000)
        const cacheData = cache.get(req.params.key)
        new SuccessResponse('cache registered', { cache: cacheData }).send(res)
    }
)

testRouter.get('/getCache/:key',
    function (req: Request, res: Response, next: NextFunction) {
        const cacheData = cache.get(req.params.key)
        if (cacheData) new SuccessResponse('cache registered', { cache: cacheData }).send(res)
        else ApiError.handle(new InternalError('cache doesn\'t exists'), res)
    }
)

export default testRouter