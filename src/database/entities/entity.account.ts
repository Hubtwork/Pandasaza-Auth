import { Column, CreateDateColumn, Entity, JoinColumn, OneToOne, PrimaryGeneratedColumn } from "typeorm"
import { ValidationEntity } from "./entity.validate"
import { Length } from 'class-validator'
import { User } from "./entity.user"

@Entity({name: 'account'}) 
export class Account extends ValidationEntity {
    @PrimaryGeneratedColumn('uuid')
    accountId!: string

    @OneToOne(() => User)
    @JoinColumn({name: 'user'})
    user!: User

    @Column()
    @Length(10, 11)
    phone!: string

    @CreateDateColumn({nullable: false})
    registeredAt!: Date
}