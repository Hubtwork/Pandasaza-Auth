import { EntityRepository, Repository } from "typeorm"
import { User } from "../entities/entity.user"
import { UserProfile } from "../entities/entity.user.profile"
import { Logger } from "../utils/logger"


@EntityRepository(User)
export class UserDetailRepository extends Repository<User> {
    private logger = new Logger()
    
    public async insertUserDetail(
        profile: UserProfile,
        school: string, 
        nationality: string
        ): Promise<User | null> {
        try {
            const userDetail = this.create({profile, school, nationality})
            return this.save(userDetail)
        } catch(error) {
            this.logger.error(`[DB] insert UserDetail with \'${JSON.stringify(profile)}\' failed`)
            return null
        }
    }

    public async deleteUserDetail(uId: number): Promise<null> {
        try {
            const userDetail = await this.findOneOrFail({uId: uId})
            if (userDetail) {
                this.delete(userDetail)
                this.logger.info(`[DB] UserDetail with \'${uId}\' successfuly deleted`)
            }
            return null
        } catch(error) {
            this.logger.error(`[DB] UserDetail with \'${uId}\' not Found`)
            return null
        }
    }

    
}