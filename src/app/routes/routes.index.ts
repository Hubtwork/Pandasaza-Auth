import express from "express";
import smsRouter from "./sms/route.sms";
import authRouter from './sign/route.sign'
import serviceRouter from "./services/route.service";



const router = express.Router()


router.use('/sms', smsRouter)
router.use('/sign', authRouter)
router.use('/service', serviceRouter)


export default router