import { Column, Entity, JoinColumn, OneToOne, PrimaryGeneratedColumn } from "typeorm"
import { ValidationEntity } from "./entity.validate"
import { Length } from 'class-validator'
import { User } from "./entity.user"
import bcrypt from 'bcrypt'

@Entity({name: 'auth_phone'}) 
export class AuthPhone extends ValidationEntity {
    @PrimaryGeneratedColumn('uuid')
    pId!: string

    @OneToOne(() => User)
    @JoinColumn()
    userDetail!: User

    @Column()
    @Length(10, 11)
    phone!: string

    public hashPhoneNumberIdentity() { this.phone = bcrypt.hashSync(this.phone, 10) }

    public checkIfUnencryptedPhoneIsValid(unencryptedPhone: string) { return bcrypt.compareSync(unencryptedPhone, this.phone) }
}