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
import RefreshTokenExpiredException from "../exceptions/jwt/RefreshTokenExpiredException";
import UserDTO from "../../interfaces/interface.DTO.user";




export class AuthentificationService {


    private tokenService: TokenService

    constructor() { 
        this.tokenService = new TokenService()
    }

    public async register(
        userDTO: UserDTO
    ): Promise<TokenTuple> {
        const accountRepository = getCustomRepository(AccountRepository)
        const userProfileRepository = getCustomRepository(UserProfileRepository)
        const userRepository = getCustomRepository(UserRepository)

        const { phone, profileName, profileImg, school, nationality } = userDTO

        return new Promise<TokenTuple>( async (resolve, reject) => {
            // construct Profile
            const profile = await userProfileRepository.insertUserProfile(profileName, profileImg)
            if (!profile) reject(new DbException('DBerror', 'Exception Occurred during Creating Profile'))
            // construct User
            const user = await userRepository.insertUserDetail(profile!, school, nationality)
            if (!user) reject(new DbException('DBerror', 'Exception Occurred during Creating User'))
            // construct Account
            const account = await accountRepository.insertAccount(phone, user!)
            if (!account) reject(new DbException('DBerror', 'Exception Occurred during Creating Account'))
            // if account successfully created, create token and return tokens
            const tokens = await this.tokenService.createTokens(phone)
            if (!tokens) reject(new NoValidAccountException())
            resolve(tokens!)
        })
    }

    public async signIn(validatedPhoneNumber: string): Promise<TokenTuple> {

        return new Promise<TokenTuple>(async (resolve, reject) => {
            const tokens = await this.tokenService.createTokens(validatedPhoneNumber)
            if (!tokens) reject(new NoValidAccountException())
            resolve(tokens!)
        })
    }

    public async singOut(phoneNumber: string): Promise<boolean> {
        return new Promise<boolean>( async (resolve, reject) => {
            const delResult = await this.tokenService.deleteRefreshToken(phoneNumber)
            if(!delResult) reject(new DbException('DBerror','Exception Occurred during Deleting RefreshToken'))
            resolve(true)
        })
    }

    /**
     * 
     * @param refreshToken must be already verified refreshToken
     * @returns 
     */
    public async renewAccessToken(refreshToken: string) {
        try {
            // server-side check RefreshToken is valid
            await this.tokenService.verifyRefreshToken(refreshToken)
            // create new access token correspond to given refresh token
            const newAccessToken = await this.tokenService.renewAccessToken(refreshToken)
            return newAccessToken
        } catch(error) {
            // Refresh Token Expired  =>  have to regain RefreshToken
            if (error.name === 'RefreshTokenExpired') {  }
            else if (error.name === 'InvalidSign') {  }
            return null
        }
    }

}