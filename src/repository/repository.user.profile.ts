import { EntityRepository, Repository } from "typeorm"
import { UserProfile } from "../entities/entity.user.profile"
import { Logger } from "../utils/logger"


@EntityRepository(UserProfile)
export class UserProfileRepository extends Repository<UserProfile> {
    private logger = new Logger()
    
    public async insertUserProfile(
        profileName: string,
        profileImage: string
        ): Promise<UserProfile | null> {
        try {
            const userProfile = this.create({profileName, profileImage})
            return this.save(userProfile)
        } catch(error) {
            this.logger.error(`[DB] insert UserProfile with \'${JSON.stringify(profileName)}\' failed`)
            return null
        }
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

    public async changeUserProfile(profileId: number, profileName: string, profileImage: string): Promise<UserProfile | null> {
        try {
            const userProfile = await this.findOneOrFail({profileId: profileId})
            // upsert userProfile
            if (userProfile) {
                userProfile.profileName = profileName
                userProfile.profileImage = profileImage
                return this.save(userProfile)
            }
            return null
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