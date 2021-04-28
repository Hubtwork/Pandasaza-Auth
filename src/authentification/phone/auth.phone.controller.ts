import { Router } from "express";
import Controller from "../../interfaces/controller";
import PhoneAuthentificationService from "./auth.phone.service";



class PhoneAuthentificationController implements Controller {
    
    public path = '/auth/phone'
    public router = Router()

    private authentificationService = new PhoneAuthentificationService()
}