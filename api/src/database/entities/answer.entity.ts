import {
  Entity,
  Column,
  ManyToOne,
  JoinColumn,
  Check,
  OneToMany,
} from "typeorm";
import { Question } from "./question.entity";
import { Result } from "./result.entity";
import { ApiProperty } from "@nestjs/swagger";
import { Constraints } from "../../../../shared/constraints/database.constraint";
import { MentalState } from "../../../../shared/enums/therapy.enum";
import { BaseEntity } from "../base.entity";

@Entity()
@Check(
  `"influence" >= ${Constraints.Answer.influenceMin} AND "influence" <= ${Constraints.Answer.influenceMax}`
)
@Check(`length(img) <= ${Constraints.Test.imgMaxLength}`)
export class Answer extends BaseEntity {
  @ManyToOne(() => Question, (question) => question.answers, {
    onDelete: "CASCADE",
    onUpdate: "CASCADE",
  })
  @JoinColumn({ name: "question_uuid", referencedColumnName: "uuid" })
  @ApiProperty({
    description: "The question to which this answer corresponds.",
  })
  question: Question;

  @OneToMany(() => Result, (result) => result.answer)
  @ApiProperty({
    description: "The list of results associated with this answer.",
    type: [Result],
  })
  results: Result[];

  @Column({
    type: "enum",
    enum: MentalState,
    name: "mentalstate",
  })
  @ApiProperty({
    description: "The mental state associated with the answer.",
    enum: MentalState,
  })
  mentalState: MentalState;

  @Column({
    type: "int",
  })
  @ApiProperty({
    description: "The influence score associated with the answer.",
    example: 5,
  })
  influence: number;

  @Column({
    type: "varchar",
    length: Constraints.Answer.textMaxLength,
    nullable: true,
  })
  @ApiProperty({
    description:
      "The optional text field for additional information related to the answer.",
    example: "This is a sample text.",
    nullable: true,
  })
  text: string;

  @Column({
    type: "bytea",
    nullable: true,
  })
  @ApiProperty({
    description: "The optional image file related to the answer.",
    type: String,
    format: "binary",
    nullable: true,
  })
  img: Buffer;
}
