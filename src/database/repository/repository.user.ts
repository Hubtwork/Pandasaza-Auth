import { EntityRepository, getCustomRepository, Repository } from "typeorm"
import { User } from "../entities/entity.user"
import { UserProfile } from "../entities/entity.user.profile"
import { Logger } from '../../utils/logger'
import { UserProfileRepository } from "./repository.user.profile"

import { validate } from 'class-validator'


@EntityRepository(User)
export class UserRepository extends Repository<User> {
    private logger = new Logger()
    
    public async validate(school: string, nationality: string): Promise<boolean> {
        try {
            const user = new User()
            user.nationality = nationality
            user.school = school
            if ( (await validate(user)).length > 0 ) throw new Error('User Validation Error')
            return true
        } catch(error) {
            return false
        }
    }

    public async insertUserDetail(
        profile: UserProfile,
        school: string, 
        nationality: string
        ): Promise<User | null> {
        try {
            const currentTimeStamp = new Date().getTime().toString()
            const userDetail = this.create({profile, school, nationality, registeredAt: currentTimeStamp, updatedAt: currentTimeStamp })
            return this.save(userDetail)
        } catch(error) {
            this.logger.error(`[DB] insert UserDetail with \'${JSON.stringify(profile)}\' failed`)
            return null
        }
    }

    public async getUserDetail(uId: number): Promise<User | null> {
        try {
            const userDetail = await this.findOneOrFail({where: { uId: uId }, relations: ['profile']})
            return userDetail
        } catch(error) {
            this.logger.error(`[DB] UserDetail with \'${uId}\' not Found`)
            return null
        }
    }

    // if profile changed, trigger update 'updateAt'
    public async updateInnerData(uId: number): Promise<User | null> {
        try {
            const userDetail = await this.findOneOrFail({where: { uId: uId }, relations: ['profile'] })
            const currentTimeStamp = new Date().getTime().toString()
            userDetail.updatedAt = currentTimeStamp
            return this.save(userDetail)
        } catch(error) {
            this.logger.error(`[DB] UserDetail with \'${uId}\' not Found`)
            return null
        }
    }

    public async deleteUserDetail(uId: number): Promise<number | null> {
        try {
            const userDetail = await this.findOneOrFail({ where: { uId: uId }, relations: ['profile'] })
            const profileRepository = getCustomRepository(UserProfileRepository)
            if (userDetail) {
                await this.delete(uId)
                await profileRepository.deleteUserProfile(userDetail.profile.profileId)
            }
            return uId
        } catch(error) {
            this.logger.error(`[DB] UserDetail with \'${uId}\' not Found`)
            return null
        }
    }

    
}