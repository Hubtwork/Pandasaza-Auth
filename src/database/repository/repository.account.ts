import { EntityRepository, getCustomRepository, Repository } from 'typeorm'
import { Account } from '../entities/entity.account'
import { User } from '../entities/entity.user'
import { Logger } from '../../utils/logger'
import { UserRepository } from './repository.user'
import UserDTO from '../../interfaces/interface.DTO.user'
import { UserProfileRepository } from './repository.user.profile'
import { validate } from 'class-validator'
import { InternalError } from '../../core/responses/response.Error'

@EntityRepository(Account)
export class AccountRepository extends Repository<Account> {
    private logger = new Logger()

    public async validate(phoneNumber: string): Promise<boolean> {
        try {
            const account = new Account()
            account.phone = phoneNumber
            if ( (await validate(account)).length > 0 ) throw new Error('Account Validation Error')
            return true
        } catch(error) {
            return false
        }
    }
    
    public async insertAccount(
        userDTO: UserDTO
        ): Promise<Account | null> {
        try {
            // for avoiding just creating dummy profile / user
            // validate first
            const profileValid = await getCustomRepository(UserProfileRepository).validate(userDTO.profileName, userDTO.profileImage)
            const userValid = await getCustomRepository(UserRepository).validate(userDTO.school, userDTO.nationality)
            const accountValid = await this.validate(userDTO.phone)
            if (!profileValid || !userValid || !accountValid) throw new Error('Validation Error')
            const profile = await getCustomRepository(UserProfileRepository).insertUserProfile(userDTO.profileName, userDTO.profileImage)
            if (!profile) throw new Error('Profile Insertion Error')
            const user = await getCustomRepository(UserRepository).insertUserDetail(profile, userDTO.school, userDTO.nationality)
            if (!user) throw new Error('User Insertion Error')
            const currentTimeStamp = new Date().getTime().toString()
            const account = this.create({phone: userDTO.phone, user: user, registeredAt: currentTimeStamp })
            return this.save(account)
        } catch(error) {
            this.logger.error(`[DB] insert Account with \'${JSON.stringify(userDTO.phone)}\' failed`)
            return null
        }
    }

    public async getAccountByAccountId(accountId: string): Promise<Account | null> {
        try {
            const account = await this.findOneOrFail({where: { accountId: accountId }, relations:['user', 'user.profile']})
            return account
        } catch(error) {
            this.logger.error(`[DB] Account with \'${accountId}\' not Found`)
            return null
        }
    }

    public async getAccountByPhone(phoneNumber: string): Promise<Account | null> {
        try {
            const account = await this.findOneOrFail({where: {phone: phoneNumber}, relations:['user', 'user.profile']})
            return account
        } catch(error) {
            this.logger.error(`[DB] Account with \'${phoneNumber}\' not Found`)
            return null
        }
    }

    public async deleteAccount(phoneNumber: string): Promise<string | null> {
        try {
            const account = await this.findOneOrFail({ where: { phone: phoneNumber }, relations: ['user', 'user.profile'] })
            const userRepository = getCustomRepository(UserRepository)
            if (account) {
                await this.delete(account.accountId)
                await userRepository.deleteUserDetail(account.user.uId)
            }
            return phoneNumber
        } catch(error) {
            this.logger.error(`[DB] Account with \'${phoneNumber}\' not Found`)
            return null
        }
    }
    
}
