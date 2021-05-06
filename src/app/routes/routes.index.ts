import express from "express";
import smsRouter from "./sms/route.sms";
import authRouter from './sign/route.sign'






const router = express.Router()


router.use('/sms', smsRouter)
router.use('/sign', authRouter)


export default router