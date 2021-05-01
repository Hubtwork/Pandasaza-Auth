import { EntityRepository, Repository } from 'typeorm'
import { Account } from '../entities/entity.auth.phone'
import { User } from '../entities/entity.user'
import { Logger } from '../utils/logger'

@EntityRepository(Account)
export class AuthPhoneRepository extends Repository<Account> {
    private logger = new Logger()
    
    
}
