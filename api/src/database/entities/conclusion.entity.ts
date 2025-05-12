import { Entity, Column, ManyToOne, JoinColumn, Check } from "typeorm";
import { BaseEntity } from "../base.entity";
import { ApiProperty } from "@nestjs/swagger";
import { Constraints } from "../../../shared/constraints/database.constraint";
import { MentalState } from "../../../shared/enums/therapy.enum";
import { User } from "./user.entity";

@Entity()
@Check(
  `value >= ${Constraints.Conclusion.value.min} AND value <= ${Constraints.Conclusion.value.max}`
)
export class Conclusion extends BaseEntity {
  @ManyToOne(() => User, { onDelete: "CASCADE", onUpdate: "CASCADE" })
  @JoinColumn({ name: "user_uuid", referencedColumnName: "uuid" })
  user: User;

  @Column({
    type: "enum",
    enum: MentalState,
    name: "mentalstate",
  })
  @ApiProperty({
    description: "The mental state evaluated for this conclusion.",
    enum: MentalState,
  })
  mentalState: MentalState;

  @Column({
    type: "int",
    nullable: false,
    default: Constraints.Conclusion.defaultValue,
  })
  @ApiProperty({
    description:
      "The value associated with the conclusion, within the allowed range.",
    example: 75,
  })
  value: number;
}
