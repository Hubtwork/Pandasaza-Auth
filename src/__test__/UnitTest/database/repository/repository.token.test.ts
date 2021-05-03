import { getCustomRepository } from "typeorm"
import { AccountRepository } from "../../../../database/repository/repository.account"
import { RefreshTokenRepository } from "../../../../database/repository/repository.token.refresh"
import { UserRepository } from "../../../../database/repository/repository.user"
import { UserProfileRepository } from "../../../../database/repository/repository.user.profile"


describe('UserDetail DB TestSuite', () => {

    let profileRepository: UserProfileRepository
    let userRepository: UserRepository
    let accountRepository: AccountRepository
    let repository: RefreshTokenRepository

    beforeAll( async () => {
        profileRepository = getCustomRepository(UserProfileRepository)
        userRepository = getCustomRepository(UserRepository)
        accountRepository = getCustomRepository(AccountRepository)
        repository = getCustomRepository(RefreshTokenRepository)
    })

})