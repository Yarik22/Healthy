import { Entity, Column, Check } from "typeorm";
import { ApiProperty } from "@nestjs/swagger";
import { Constraints } from "../../../../shared/constraints/database.constraint";
import { MentalState } from "../../../../shared/enums/therapy.enum";
import { BaseEntity } from "../base.entity";

@Entity()
@Check(`length(img) <= ${Constraints.Therapy.imgMaxLength}`)
export class Therapy extends BaseEntity {
  @Column({
    type: "varchar",
    length: Constraints.Therapy.titleMaxLength,
    unique: true,
  })
  @ApiProperty({
    description: "The title of the therapy.",
    example: "Cognitive Behavioral Therapy",
  })
  title: string;

  @Column({
    type: "varchar",
    length: Constraints.Therapy.descriptionMaxLength,
    nullable: true,
  })
  @ApiProperty({
    description: "An optional description of the therapy.",
    example:
      "A therapeutic approach that helps individuals recognize and change harmful thought patterns.",
    nullable: true,
  })
  description: string;

  @Column({
    type: "varchar",
    length: Constraints.Therapy.urlMaxLength,
    nullable: true,
  })
  @ApiProperty({
    description: "An optional URL for more information about the therapy.",
    example: "https://www.cbt.com",
    nullable: true,
  })
  url: string;

  @Column({
    type: "varchar",
    nullable: true,
    length: Constraints.Therapy.imgMaxLength,
  })
  @ApiProperty({
    description: "An optional image associated with the therapy.",
    type: String,
    format: "binary",
    nullable: true,
  })
  img: string;

  @Column({
    type: "enum",
    enum: MentalState,
    array: true,
    name: "mentalstates",
  })
  @ApiProperty({
    description: "An array of mental states that the therapy aims to address.",
    enum: MentalState,
    isArray: true,
    example: [MentalState.Apathy, MentalState.Anger],
  })
  mentalStates: MentalState[];
}
