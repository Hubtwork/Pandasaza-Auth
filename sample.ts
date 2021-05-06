import { SmsService } from "./src/app/services/service.sms";
import { sign, verify } from 'jsonwebtoken'
import { jwt } from "./src/utils/environments";

import { JwtPayload, UserPayload } from './src/core/jwt/jwt.payload'



const service = new SmsService()


const payload: UserPayload = {
    phone: '01075187260',
    accountId: 'acc-abb-add-aee'
}

const token = sign(payload, String(jwt.access_key), { issuer: 'pandaSaza', algorithm: 'HS256', expiresIn: String(jwt.access_life) })
const verified: JwtPayload = verify(token, String(jwt.access_key), { algorithms: ['HS256'], issuer: 'pandaSaza' }) as JwtPayload

console.log(verified)