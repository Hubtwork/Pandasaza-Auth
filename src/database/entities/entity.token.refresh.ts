import { Column, CreateDateColumn, Entity, JoinColumn, OneToOne, PrimaryColumn, PrimaryGeneratedColumn } from "typeorm"
import { ValidationEntity } from "./entity.validate"
import bcrypt from 'bcrypt'
import { Account } from "./entity.account"

@Entity({name: 'refresh_token'}) 
export class RefreshToken extends ValidationEntity {

    @PrimaryGeneratedColumn('uuid')
    tokenId!: string

    @Column({nullable: false})
    phone!: string

    @Column({nullable: false})
    token!: string

    @OneToOne(() => Account)
    @JoinColumn({name: 'account'})
    account!: Account

    @CreateDateColumn({nullable: false})
    issuedAt!: Date

    public hashingToken() { this.token = bcrypt.hashSync(this.token, 8) }

    public checkIfUnencryptedTokenIsValid(unencryptedToken: string) { return bcrypt.compareSync(unencryptedToken, this.token) }

}