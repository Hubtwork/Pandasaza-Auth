import { Router, Request, Response, NextFunction } from "express"
import Controller from "../../interfaces/controller"
import { AuthentificationService } from "../services/service.auth"
import { Logger } from "../../utils/logger"
import TokenTuple from "../../interfaces/interface.token.tuple"
import Token from "../../interfaces/interface.token"
import NoValidAccountException from "../exceptions/network/NoValidAccountException"
import InternalServerException from "../exceptions/network/InternalServerException"
import UserDTO from "../../interfaces/interface.DTO.user"



export default class AuthController implements Controller {
    private logger: Logger
    private service: AuthentificationService

    private createCookie = (name: string, token: Token) => { return `${name}=${token.token}; HttpOnly; Max-Age=${token.expiresIn}` }

    public path = '/auth'
    public router = Router()

    constructor() {
        this.logger = new Logger()
        this.service = new AuthentificationService()
        this.constructRouters()
    }

    private constructRouters() {
        this.router.post(`${this.path}/register`, this.register)
        this.router.get(`${this.path}/signIn/:phone`, this.signIn)
        this.router.get(`${this.path}/signOut/:phone`, this.signOut)
    }

    private register = async (request: Request, response: Response, next: NextFunction) => {
        try {
            const userDTO: UserDTO = request.body
            const { accessToken, refreshToken } = await this.service.register(userDTO)
            response.setHeader('Set-Cookie', [this.createCookie('AccessToken', accessToken)])
            response.setHeader('Set-Cookie', [this.createCookie('RefreshToken', refreshToken)])
            response.send(200)
        } catch(error) {
            this.logger.error(error)
            next(new InternalServerException())
        }
    }

    private signIn = async (request: Request, response: Response, next: NextFunction) => {
        const phone = request.params.phone
        try {
            const { accessToken, refreshToken } = await this.service.signIn(phone)
            response.setHeader('Set-Cookie', [this.createCookie('AccessToken', accessToken)])
            response.setHeader('Set-Cookie', [this.createCookie('RefreshToken', refreshToken)])
            response.send(200)
        } catch(error) {
            next(new NoValidAccountException())
        }
    }

    private signOut = async (request: Request, response: Response, next: NextFunction) => {
        const phone = request.params.phone
        try {
            await this.service.singOut(phone)
            response.setHeader('Set-Cookie', ['AccessToken=; Max-age=0;'])
            response.setHeader('Set-Cookie', ['RefreshToken=; Max-age=0;'])
            response.send(200)
        } catch(error) {
            next(new InternalServerException())
        }
    }
    
    private renewAccessToken = async (request: Request, response: Response, next: NextFunction) => {
        
    }

}