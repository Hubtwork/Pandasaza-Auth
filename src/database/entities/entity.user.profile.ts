import { Length } from "class-validator"
import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, JoinColumn, OneToOne, BaseEntity } from "typeorm"
import { User } from "./entity.user"
import { ValidationEntity } from "./entity.validate"


@Entity({name: 'user_profile'}) 
export class UserProfile extends BaseEntity {
    @PrimaryGeneratedColumn('increment')
    profileId!: number

    // Constraint : 4 ~ 12 character
    @Column({ type: "varchar", length: 12, nullable: false})
    @Length(2, 12)
    profileName!: string

    @Column({ type: 'text'})
    profileImage!: string

    @Column({ nullable : false })
    registeredAt!: string

    @Column({ nullable : false })
    updatedAt!: string
}