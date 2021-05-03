import { getConnection, getCustomRepository } from "typeorm";
import Token from "../../interfaces/interface.token";
import { AccountRepository } from "../../database/repository/repository.account";
import { UserRepository } from "../../database/repository/repository.user";
import { UserProfileRepository } from "../../database/repository/repository.user.profile";
import TokenService from "./service.token";
import { reject } from "lodash";
import NoValidAccountException from "../exceptions/network/NoValidAccountException";
import TokenTuple from "../../interfaces/interface.token.tuple";
import DbException from "../exceptions/DbException";




export class AuthentificationService {

    private createCookie = (token: Token) => { return `Authorization=${token.token}; HttpOnly; Max-Age=${token.expiresIn}` }

    private tokenService: TokenService

    constructor() { 
        this.tokenService = new TokenService()
    }


    public async register(
        phoneNumber: string,
        profileName: string,
        profileImg: string,
        school: string,
        nationality: string
    ): Promise<TokenTuple> {
        const accountRepository = getCustomRepository(AccountRepository)
        const userProfileRepository = getCustomRepository(UserProfileRepository)
        const userRepository = getCustomRepository(UserRepository)

        return new Promise<TokenTuple>( async (resolve, reject) => {
            // construct Profile
            const profile = await userProfileRepository.insertUserProfile(profileName, profileImg)
            if (!profile) reject(new DbException('Exception Occurred during Creating Profile'))
            // construct User
            const user = await userRepository.insertUserDetail(profile!, school, nationality)
            if (!user) reject(new DbException('Exception Occurred during Creating User'))
            // construct Account
            const account = await accountRepository.insertAccount(phoneNumber, user!)
            if (!account) reject(new DbException('Exception Occurred during Creating Account'))
            // if account successfully created, create token and return tokens
            const tokens = await this.tokenService.createTokens(account!.accountId, user!.uId, profile!.profileId)
            resolve(tokens)
        })
    }

    public async signIn(validatedPhoneNumber: string): Promise<TokenTuple> {
        const accountRepository = getCustomRepository(AccountRepository)

        return new Promise<TokenTuple>(async (resolve, reject) => {
            const account = await accountRepository.findAccount(validatedPhoneNumber)
            // error handling ( no account with the given phone number )
            if (!account) reject(new NoValidAccountException())
            const accountId = account!.accountId
            const userId = account!.user.uId
            const profileId = account!.user.profile.profileId
            const tokens = await this.tokenService.createTokens(accountId, userId, profileId)
            resolve(tokens)
        })
    }

    public async singOut(phoneNumber: string) {
        
        return new Promise(async (resolve, reject) => {

            
        })
    }


}