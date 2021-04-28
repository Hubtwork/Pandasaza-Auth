import { getConnection, Repository } from 'typeorm'
import { AuthPhone } from '../entity/entity.auth.phone'


class AuthRepository {

    private phone_auth: Repository<AuthPhone>

    constructor() {
        const connection = getConnection()
    }
}