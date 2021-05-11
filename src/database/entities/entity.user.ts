import { IsString } from "class-validator";
import { BaseEntity, Column, CreateDateColumn, Entity, JoinColumn, OneToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { UserProfile } from "./entity.user.profile";
import { ValidationEntity } from "./entity.validate";


@Entity({name: 'user_detail'}) 
export class User extends BaseEntity {
    @PrimaryGeneratedColumn('increment')
    uId!: number

    @OneToOne(() => UserProfile)
    @JoinColumn({name: 'profile'})
    profile!: UserProfile

    @IsString()
    @Column({nullable: false})
    school!: string

    @IsString()
    @Column()
    nationality!: string

    @Column({ nullable : false })
    registeredAt!: string

    @Column({ nullable : false })
    updatedAt!: string
}