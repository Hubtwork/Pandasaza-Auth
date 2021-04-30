import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from "typeorm"
import { ValidationEntity } from "./entity.validate"


@Entity({name: 'user_profile'}) 
export class UserProfile extends ValidationEntity {
    @PrimaryGeneratedColumn('increment')
    profileId!: number

    @Column({nullable: false})
    profileName!: string

    @Column()
    profileImage!: string

    @Column()
    @UpdateDateColumn()
    public updatedAt!: Date
}