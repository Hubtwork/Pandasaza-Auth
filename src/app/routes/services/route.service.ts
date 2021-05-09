import express, { Request, Response, NextFunction } from "express";
import authAuthentication from "../../validation/validate.authentication";
import authValidation from "../../validation/validate.validation";
import profileRouter from "./route.profile";



const serviceRouter = express.Router()

serviceRouter.use('/', authValidation, authAuthentication)

serviceRouter.use('/profile', profileRouter)

export default serviceRouter