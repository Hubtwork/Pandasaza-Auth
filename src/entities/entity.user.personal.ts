import { Max, Min } from "class-validator"
import { Entity, PrimaryGeneratedColumn, Column, UpdateDateColumn } from "typeorm"
import { ValidationEntity } from "./entity.validate"



/**
 *          TODO - discuss with teams. 
 *          TOPIC - Is it needs for infomatics like fields in ADs, PRODUCTs
 */
@Entity({name: 'user_personal'}) 
export class UserPersonal extends ValidationEntity {
    @PrimaryGeneratedColumn('increment')
    personalId!: number

    @Column({ type: "tinyint" })
    @Min(0) // 0 : male
    @Max(1) // 1 : female
    sex!: number

    @Column()
    @Min(15)
    @Max(100)
    age!: number

    @UpdateDateColumn()
    public updatedAt!: Date
}