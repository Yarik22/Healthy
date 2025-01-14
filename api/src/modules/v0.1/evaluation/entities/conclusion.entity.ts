import { Entity, Column, ManyToOne, JoinColumn, Check } from "typeorm";
import { User } from "../../user/entities/user.entity";
import { Constraints } from "../../../../../../shared/constraints/database.constraint";
import { BaseEntity } from "../../../../database/base.entity";
import { MentalState } from "../../../../../../shared/enums/therapy.enum";
import { ApiProperty } from "@nestjs/swagger";

@Entity()
@Check(
  `value >= ${Constraints.Conclusion.value.min} AND value <= ${Constraints.Conclusion.value.max}`
)
export class Conclusion extends BaseEntity {
  @ManyToOne(() => User, { onDelete: "CASCADE", onUpdate: "CASCADE" })
  @JoinColumn({ name: "user_uuid", referencedColumnName: "uuid" })
  @ApiProperty({
    description: "The user associated with this conclusion.",
  })
  user: User;

  @Column({
    type: "enum",
    enum: MentalState,
  })
  @ApiProperty({
    description: "The mental state evaluated for this conclusion.",
    enum: MentalState,
  })
  mentalState: MentalState;

  @Column({
    type: "int",
    nullable: false,
  })
  @ApiProperty({
    description:
      "The value associated with the conclusion, within the allowed range.",
    example: 75,
  })
  value: number;
}
