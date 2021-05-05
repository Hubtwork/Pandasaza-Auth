import express from "express";
import smsRouter from "./sms/route.sms";
import authRouter from './auth/route.auth'






const router = express.Router()


router.use('/sms', smsRouter)
router.use('/auth', authRouter)


export default router