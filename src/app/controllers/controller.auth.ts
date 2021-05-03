import { Router } from "express"
import Controller from "../../interfaces/controller"
import { AuthentificationService } from "../services/service.auth"
import { Logger } from "../../utils/logger"



class AuthController implements Controller {
    private logger: Logger
    private service: AuthentificationService

    public path = '/auth'
    public router = Router()

    constructor() {
        this.logger = new Logger()
        this.service = new AuthentificationService()
    }

    private constructRouters() {

    }

    private signIn = async (request: Request, response: Response) => {
        
    }

    private signOut = async (request: Request, response: Response) => {
         
    }

}