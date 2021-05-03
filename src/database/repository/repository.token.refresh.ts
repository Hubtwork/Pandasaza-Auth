import { EntityRepository, Repository } from "typeorm";
import { Logger } from "../../utils/logger";
import { RefreshToken } from "../entities/entity.token.refresh";




@EntityRepository(RefreshToken)
export class RefreshTokenRepository extends Repository<RefreshToken> {
    private logger = new Logger()

    public async registerToken(accountId: string, refreshToken: string): Promise<RefreshToken | null> {
        try {
            const token = this.create({accountId: accountId, token: refreshToken})
            return this.save(token)
        } catch(error) {
            this.logger.error(`[DB] create Token of User { \'${JSON.stringify(accountId)}\' } failed`)
            return null
        }
    }

    public async checkToken(accountId: string) {
        
    }

    public async deleteToken(accountId: string): Promise<boolean> {
        try {
            const refreshToken = await this.findOneOrFail({accountId: accountId})
            if (refreshToken) {
                await this.delete(refreshToken.tokenId)
            }

            return true
        } catch(error) {
            this.logger.error(`[DB] delete Token of User { \'${JSON.stringify(accountId)}\' } failed`)
            return false
        }
    }
}