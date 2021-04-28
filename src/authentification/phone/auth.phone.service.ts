import Token from "../../interfaces/token.interface";
import { MariaDBConnection } from "../../utils/dbcon";




class PhoneAuthentificationService {

    private db = new MariaDBConnection()
    
    private async checkPhoneIfExists(phone: string) {
        try {
            const result = await this.db.query(`select * from auth_phone where  `)

        } catch(error) {
            console.error(`error occured ) ${error.message}`)
            return false
        }
    }

    public createCookie(token: Token): string {
        return `Authorization=${token.token}; HttpOnly; Max-Age=${token.expiresIn}`
    }
}

export default PhoneAuthentificationService