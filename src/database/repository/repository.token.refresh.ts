import { EntityRepository, getCustomRepository, Repository } from "typeorm";
import { Logger } from "../../utils/logger";
import { Account } from "../entities/entity.account";
import { RefreshToken } from "../entities/entity.token.refresh";
import { AccountRepository } from "./repository.account";

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

    public async createRefreshToken(phone: string, accountId: string, refreshToken: string): Promise<RefreshToken | null> {
        try {
            const account = await getCustomRepository(AccountRepository).getAccountByAccountId(accountId)
            const token = this.create({ phone: phone, account: account!, token: refreshToken})
            return this.save(token)
        } catch(error) {
            this.logger.error(`[DB] create RefreshToken of Phone ${phone} failed`)
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

    public async deleteToken(phone: string): Promise<boolean> {
        try {
            const token = await this.findOneOrFail({ where: {phone: phone}})
            if (!token) throw new Error('token Not found')
            await this.delete(token.tokenId)
            return true
        } catch(error) {
            this.logger.error(`[DB] delete Token of User { \'${phone}\' } failed`)
            return false
        }
    }
}