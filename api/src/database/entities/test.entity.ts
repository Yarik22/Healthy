import { Entity, Column, JoinTable, ManyToMany, Check } from "typeorm";
import { Question } from "./question.entity";
import { ApiProperty } from "@nestjs/swagger";
import { Constraints } from "../../../shared/constraints/database.constraint";
import { User } from "./user.entity";
import { BaseEntity } from "../base.entity";

@Entity()
@Check(`length(img) <= ${Constraints.Test.imgMaxLength}`)
export class Test extends BaseEntity {
  @Column({
    type: "varchar",
    length: Constraints.Test.titleMaxLength,
    unique: true,
  })
  @ApiProperty({
    description: "The title of the test.",
    example: "Mental Health Assessment",
  })
  title: string;

  @Column({
    type: "varchar",
    length: Constraints.Test.descriptionMaxLength,
    nullable: true,
  })
  @ApiProperty({
    description: "An optional description of the test.",
    example:
      "This test assesses the mental health of individuals using various psychological questions.",
    nullable: true,
  })
  description: string;

  @Column({
    type: "varchar",
    nullable: true,
    length: Constraints.Test.imgMaxLength,
  })
  @ApiProperty({
    description: "An optional image related to the test.",
    type: String,
    format: "binary",
    nullable: true,
  })
  img: string;

  @ManyToMany(() => User, { onDelete: "CASCADE", onUpdate: "CASCADE" })
  @JoinTable({
    name: "user_test",
    joinColumn: { name: "test_uuid", referencedColumnName: "uuid" },
    inverseJoinColumn: { name: "user_uuid", referencedColumnName: "uuid" },
  })
  users: User[];

  @ManyToMany(() => Question, { onDelete: "CASCADE", onUpdate: "CASCADE" })
  @JoinTable({
    name: "test_question",
    joinColumn: { name: "test_uuid", referencedColumnName: "uuid" },
    inverseJoinColumn: { name: "question_uuid", referencedColumnName: "uuid" },
  })
  questions: Question[];
}
