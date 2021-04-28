import { BaseEntity, Column, Entity, PrimaryGeneratedColumn } from "typeorm";


@Entity({name: 'user_detail'}) 
export class UserDetail extends BaseEntity {
    @PrimaryGeneratedColumn('increment')
    uId: number = 0

    @Column({nullable: false})
    authType: number = 0

    @Column({nullable: false})
    profileName: string = ''

    @Column()
    profileImage: string = ''

    @Column({nullable: false})
    school: string = ''

    @Column()
    nation: string = ''

    @Column({nullable: false})
    registeredAt: Date = new Date()

}