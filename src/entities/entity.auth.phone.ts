import { Column, Entity, JoinColumn, OneToOne, PrimaryGeneratedColumn } from "typeorm"
import { ValidationEntity } from "./entity.validate"
import { Length } from 'class-validator'
import { UserDetail } from "./entity.userdetail"


@Entity({name: 'auth_phone'}) 
export class AuthPhone extends ValidationEntity {
    @PrimaryGeneratedColumn('uuid')
    pId!: string

    @OneToOne(() => UserDetail)
    @JoinColumn()
    userDetail!: UserDetail

    @Column()
    @Length(10, 11)
    phone!: string
}