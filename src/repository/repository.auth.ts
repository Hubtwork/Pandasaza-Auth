import { EntityRepository, Repository } from 'typeorm';
import { AuthPhone } from '../entities/entity.auth.phone'


export interface IAuthPhoneRepository {
    getByPhone(phone: string): Promise<AuthPhone | null>
    create(authPhone: AuthPhone): Promise<AuthPhone | null>
    delete(phone: string): Promise<AuthPhone | null>
}


@EntityRepository(AuthPhone)
export class AuthPhoneRepository extends Repository<AuthPhone> {
    
    public async addAuthPhone(phone: string, uId: number) {
        const authPhone = this.create({ phone, uId })
        return this.save(authPhone)
    }
}