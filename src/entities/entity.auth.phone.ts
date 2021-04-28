import { Column, Entity, PrimaryGeneratedColumn } from "typeorm"
import { ValidationEntity } from "./entity.validate"
import { Length } from 'class-validator'


@Entity({name: 'auth_phone'}) 
export class AuthPhone extends ValidationEntity {
    @PrimaryGeneratedColumn('uuid')
    pId!: string

    @Column()
    uId!: number

    @Column()
    @Length(10, 11)
    phone!: string
}