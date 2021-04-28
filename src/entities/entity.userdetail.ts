import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { ValidationEntity } from "./entity.validate";


@Entity({name: 'user_detail'}) 
export class UserDetail extends ValidationEntity {
    @PrimaryGeneratedColumn('increment')
    uId!: number

    @Column({nullable: false})
    authType!: number

    @Column({nullable: false})
    profileName!: string

    @Column()
    profileImage!: string

    @Column({nullable: false})
    school!: string

    @Column()
    nation!: string

    @Column({nullable: false})
    @CreateDateColumn()
    registeredAt!: Date

    @Column()
    @UpdateDateColumn()
    public updatedAt!: Date
}