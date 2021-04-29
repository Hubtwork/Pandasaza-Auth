import { EntityRepository, Repository } from 'typeorm';
import { AuthPhone } from '../entities/entity.auth.phone'
import { Logger } from '../utils/logger';

@EntityRepository(AuthPhone)
export class AuthPhoneRepository extends Repository<AuthPhone> {
    private logger = new Logger()
    
    public async insertAuthPhone(phone: string, uId: number): Promise<AuthPhone | null> {
        try {
            const authPhone = this.create({ phone, uId })
            this.logger.info(`[DB] AuthPhone with \'${authPhone.phone}\' successfully inserted`)
            return this.save(authPhone)
        } catch(error) {
            this.logger.error(`[DB] AuthPhone with \'${phone}\' already exists`)
            return null
        }
    }

    public async isPhoneExists(phone: string): Promise<AuthPhone | null> {
        try {
            const authPhone = await this.findOneOrFail({phone: phone})
            this.logger.info(`[DB] AuthPhone with \'${authPhone.phone}\' successfully searched`)
            return authPhone
        } catch(error) {
            this.logger.error(`[DB] AuthPhone with \'${phone}\' not found`)
            return null
        }
    }

    public async deleteAuthPhone(phone: string): Promise<null> {
        try {
            const authPhone = await this.findOneOrFail({phone: phone})
            if (authPhone) {
                this.delete(authPhone)
                this.logger.info(`[DB] AuthPhone with \'${phone}\' successfuly deleted`)
            }
            return null
        } catch(error) {
            this.logger.error(`[DB] AuthPhone with \'${phone}\' not found`)
            return null
        }
    }
}