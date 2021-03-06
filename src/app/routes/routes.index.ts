import express from "express";
import smsRouter from "./sms/route.sms";
import authRouter from './sign/route.sign'
import serviceRouter from "./services/route.service";
import imageRouter from "./services/route.image";
import configurationRouter from "./services/route.configuration";
import testRouter from "./routes.test";



const router = express.Router()


router.use('/sms', smsRouter)
router.use('/sign', authRouter)
router.use('/service', serviceRouter)

router.use('/imageUpload', imageRouter)

// user configuration
router.use('/configuration', configurationRouter)

router.use('/test', testRouter)

export default router