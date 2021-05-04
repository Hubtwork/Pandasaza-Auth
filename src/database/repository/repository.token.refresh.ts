import { EntityRepository, Repository } from "typeorm";
import DBJoinException from "../../app/exceptions/database/DBJoinException";
import TokenizedData from "../../interfaces/interface.token.data";
import { Logger } from "../../utils/logger";
import { Account } from "../entities/entity.account";
import { RefreshToken } from "../entities/entity.token.refresh";

@EntityRepository(RefreshToken)
export class RefreshTokenRepository extends Repository<RefreshToken> {
    private logger = new Logger()

    public async registerToken(phone: string, account: Account, refreshToken: string): Promise<RefreshToken | null> {
        try {
            const token = this.create({ phone: phone, account: account, token: refreshToken})
            return this.save(token)
        } catch(error) {
            this.logger.error(`[DB] create RefreshToken of Phone ${phone} failed`)
            return null
        }
    }

    public async getReferenceData(token: string): Promise<TokenizedData | null> {
        try {
            const refreshToken = await this.findOneOrFail({ where: { token: token}, relations: ['account', 'account.user', 'account.user.profile']})
            const account = refreshToken.account
            if( account && account.user && account.user.profile ) {
                const tokenizedData: TokenizedData = {
                    accountId: account.accountId,
                    userId: account.user.uId,
                    profileId: account.user.profile.profileId
                }
                return tokenizedData
            } else { throw new DBJoinException() }
        } catch(error) {
            this.logger.error(`[DB] RefreshToken reference Failed`)
            return null
        }
    }

    public async checkRefreshToken(token: string): Promise<RefreshToken | null> {
        try {
            const refreshToken = await this.findOneOrFail({ where: { token: token }})
            return refreshToken
        } catch(error) {
            this.logger.error(`[DB] RefreshToken not Found`)
            return null
        }
    }

    public async deleteToken(refreshToken: string): Promise<boolean> {
        try {
            const token = await this.findOneOrFail({ where: {token: refreshToken}})
            if (token) {
                await this.delete(token.tokenId)
            }
            return true
        } catch(error) {
            this.logger.error(`[DB] delete Token of User { \'${refreshToken}\' } failed`)
            return false
        }
    }
}