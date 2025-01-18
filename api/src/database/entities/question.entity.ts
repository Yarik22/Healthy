import {
  Entity,
  Column,
  JoinTable,
  ManyToMany,
  Check,
  OneToMany,
} from "typeorm";
import { Test } from "./test.entity";
import { Answer } from "./answer.entity";
import { Result } from "./result.entity";
import { ApiProperty } from "@nestjs/swagger";
import { Constraints } from "../../../../shared/constraints/database.constraint";
import { BaseEntity } from "../base.entity";

@Entity()
@Check(`length(img) <= ${Constraints.Question.imgMaxLength}`)
export class Question extends BaseEntity {
  @ManyToMany(() => Test, { onDelete: "CASCADE", onUpdate: "CASCADE" })
  @JoinTable({
    name: "test_question",
    joinColumn: { name: "question_uuid", referencedColumnName: "uuid" },
    inverseJoinColumn: { name: "test_uuid", referencedColumnName: "uuid" },
  })
  @ApiProperty({
    description: "The list of tests that this question belongs to.",
    type: [Test],
  })
  tests: Test[];

  @OneToMany(() => Answer, (answer) => answer.question)
  @ApiProperty({
    description: "The list of answers associated with this question.",
    type: [Answer],
  })
  answers: Answer[];

  @OneToMany(() => Result, (result) => result.question)
  @ApiProperty({
    description: "The list of results associated with this question.",
    type: [Result],
  })
  results: Result[];

  @Column({
    type: "varchar",
    length: Constraints.Question.titleMaxLength,
    unique: true,
  })
  @ApiProperty({
    description: "The title of the question.",
    example: "What is your level of stress?",
  })
  title: string;

  @Column({
    type: "varchar",
    length: Constraints.Question.descriptionMaxLength,
    nullable: true,
  })
  @ApiProperty({
    description:
      "An optional description providing more context for the question.",
    example: "Please describe your stress levels over the past week.",
    nullable: true,
  })
  description: string;

  @Column({
    type: "bytea",
    nullable: true,
  })
  @ApiProperty({
    description: "An optional image associated with the question.",
    type: String,
    format: "binary",
    nullable: true,
  })
  img: Buffer;
}
