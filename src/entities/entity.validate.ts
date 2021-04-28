import { validateOrReject } from "class-validator";
import { BaseEntity, BeforeInsert, BeforeUpdate } from "typeorm";

export abstract class ValidationEntity extends BaseEntity {
    @BeforeInsert()
    @BeforeUpdate()
    async validate(): Promise<void> {
      await validateOrReject(this)
    }
}