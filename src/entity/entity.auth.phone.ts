import { BaseEntity, Column, Entity, PrimaryGeneratedColumn } from "typeorm";


@Entity({name: 'auth_phone'}) 
export class AuthPhone extends BaseEntity {
    @PrimaryGeneratedColumn('uuid')
    pId: string = ''

    @Column()
    uId: number = 0

    @Column()
    phone: string = ''
}