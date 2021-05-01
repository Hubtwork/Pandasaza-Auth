import { Column, CreateDateColumn, Entity, JoinColumn, OneToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { UserProfile } from "./entity.user.profile";
import { ValidationEntity } from "./entity.validate";


@Entity({name: 'user_detail'}) 
export class User extends ValidationEntity {
    @PrimaryGeneratedColumn('increment')
    uId!: number

    @OneToOne(() => UserProfile)
    @JoinColumn({name: 'profile'})
    profile!: UserProfile

    @Column({nullable: false})
    school!: string

    @Column()
    nationality!: string

    @CreateDateColumn({nullable: false})
    registeredAt!: Date

    @UpdateDateColumn({nullable: false})
    updatedAt!: Date
}