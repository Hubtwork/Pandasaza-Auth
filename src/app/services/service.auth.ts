import { getConnection, getCustomRepository } from "typeorm";
import Token from "../../interfaces/interface.token";
import { AccountRepository } from "../../database/repository/repository.account";
import { UserRepository } from "../../database/repository/repository.user";
import { UserProfileRepository } from "../../database/repository/repository.user.profile";
import TokenService from "./service.token";




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
    ) {
        const accountRepository = getCustomRepository(AccountRepository)
        const userProfileRepository = getCustomRepository(UserProfileRepository)
        const userRepository = getCustomRepository(UserRepository)

        // construct Profile
        const profile = await userProfileRepository.insertUserProfile(profileName, profileImg)
        if (!profile) return null
        // construct User
        const user = await userRepository.insertUserDetail(profile, school, nationality)
        if (!user) return null
        // construct Account
        const account = await accountRepository.insertAccount(phoneNumber, user)
        if (!account) return null

        return account
    }

    public async signIn(validatedPhoneNumber: string) {
        const accountRepository = getCustomRepository(AccountRepository)
        const account = await accountRepository.findAccount(validatedPhoneNumber)
        if(!account) return null
        const accountId = account.accountId
        const userId = account.user.uId
        const profileId = account.user.profile.profileId
        return this.tokenService.createAccessToken(accountId, userId, profileId)

    }


}