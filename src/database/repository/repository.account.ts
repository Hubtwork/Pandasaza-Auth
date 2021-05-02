import { EntityRepository, getCustomRepository, Repository } from 'typeorm'
import { Account } from '../entities/entity.account'
import { User } from '../entities/entity.user'
import { Logger } from '../../utils/logger'
import { UserRepository } from './repository.user'

@EntityRepository(Account)
export class AccountRepository extends Repository<Account> {
    private logger = new Logger()
    
    public async insertAccount(
        phoneNumber: string,
        user: User
        ): Promise<Account | null> {
        try {
            const account = this.create({phone: phoneNumber, user: user})
            return this.save(account)
        } catch(error) {
            this.logger.error(`[DB] insert Account with \'${JSON.stringify(phoneNumber)}\' failed`)
            return null
        }
    }

    public async findAccount(phoneNumber: string): Promise<Account | null> {
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
