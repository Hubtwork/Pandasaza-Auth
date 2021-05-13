import { EntityRepository, Repository } from "typeorm"
import { UserProfile } from "../entities/entity.user.profile"
import { Logger } from "../../utils/logger"
import { validate } from "class-validator"
import { timeStamp } from "node:console"
import { NotFoundError } from "../../core/responses/response.Error"


@EntityRepository(UserProfile)
export class UserProfileRepository extends Repository<UserProfile> {
    private logger = new Logger()

    public async validate(profileName: string, profileImage: string): Promise<boolean> {
        try {
            const profile = new UserProfile()
            profile.profileName = profileName
            profile.profileImage = profileImage
            if ( (await validate(profile)).length > 0 ) throw new Error('Profile Validation Error')
            return true
        } catch(error) {
            return false
        }
    }
    
    public async insertUserProfile(
        profileName: string,
        profileImage: string
        ): Promise<UserProfile | null> {
        try {
            const currentTimeStamp = new Date().getTime().toString()
            const userProfile = this.create({profileName, profileImage, registeredAt: currentTimeStamp, updatedAt: currentTimeStamp })
            return this.save(userProfile)
        } catch(error) {
            this.logger.error(`[DB] insert UserProfile with \'${JSON.stringify(profileName)}\' failed`)
            return null
        }
    }

    public async updateUserProfile(
        profileId: number,
        profileName: string,
        profileImage: string
    ): Promise<UserProfile> {
        const userProfile = await this.getUserProfile(profileId)
        if (!userProfile) throw new NotFoundError('Profile Not Found')
        const currentTimeStamp = new Date().getTime().toString()
        userProfile.profileName = profileName
        userProfile.profileImage = profileImage
        userProfile.updatedAt = currentTimeStamp
        return this.save(userProfile)
    }

    public async getUserProfile(profileId: number): Promise<UserProfile | null> {
        try {
            const userProfile = await this.findOneOrFail({profileId: profileId})
            return userProfile
        } catch(error) {
            this.logger.error(`[DB] UserProfile with \'${profileId}\' not Found`)
            return null
        }
    }

    public async deleteUserProfile(profileId: number): Promise<number | null> {
        try {
            const userProfile = await this.findOneOrFail({profileId: profileId})
            if (userProfile) {
                await this.delete(profileId)
            }
            return profileId
        } catch(error) {
            this.logger.error(`[DB] UserProfile with \'${profileId}\' not Found`)
            return null
        }
    }

    
}