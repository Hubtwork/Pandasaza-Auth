import { getRepository } from "typeorm";
import { AuthPhone } from "../entities/entity.auth.phone";
import { IAuthPhoneRepository } from "../repository/repository.auth";




export class AuthPhoneServer implements IAuthPhoneRepository {

    async getByPhone(phone: string): Promise<AuthPhone | null> {
        const phoneRepository = getRepository(AuthPhone)
        try {
            const auth = await phoneRepository
            .createQueryBuilder('phone')
            .where('phone.phone = ', )
            .getOneOrFail()
            const authPhone = await phoneRepository.findOneOrFail(phone)
            return authPhone
        } catch (error) {
            return null
        }
    }
    async create(authPhone: AuthPhone): Promise<AuthPhone | null> {
        throw new Error("Method not implemented.");
    }
    async delete(phone: string): Promise<AuthPhone | null> {
        throw new Error("Method not implemented.");
    }

}