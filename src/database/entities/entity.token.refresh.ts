import { Column, CreateDateColumn, Entity, PrimaryColumn, PrimaryGeneratedColumn } from "typeorm"
import { ValidationEntity } from "./entity.validate"
import bcrypt from 'bcrypt'

@Entity({name: 'refresh_token'}) 
export class RefreshToken extends ValidationEntity {

    @PrimaryGeneratedColumn('uuid')
    tokenId!: string

    @Column({nullable: false})
    accountId!: string

    @Column({nullable: false})
    token!: string

    @CreateDateColumn({nullable: false})
    issuedAt!: Date

    public hashingToken() { this.token = bcrypt.hashSync(this.token, 8) }

    public checkIfUnencryptedPhoneIsValid(unencryptedPhone: string) { return bcrypt.compareSync(unencryptedPhone, this.token) }

}