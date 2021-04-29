import { EntityRepository, Repository } from "typeorm"
import { UserDetail } from "../entities/entity.userdetail"
import { Logger } from "../utils/logger"


@EntityRepository(UserDetail)
export class UserDetailRepository extends Repository<UserDetail> {
    private logger = new Logger()
    
    public async insertUserDetail(
        profileName: string, 
        profileImage: string,
        school: string, 
        nationality: string
        ): Promise<UserDetail | null> {
        try {
            const userDetail = this.create({profileName, profileImage, school, nationality})
            return this.save(userDetail)
        } catch(error) {
            this.logger.error(`[DB] insert UserDetail with \'${profileName}\' failed`)
            return null
        }
    }
}