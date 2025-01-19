import { Entity, ManyToOne, JoinColumn, PrimaryColumn } from "typeorm";
import { Question } from "./question.entity";
import { Answer } from "./answer.entity";
import { ApiProperty } from "@nestjs/swagger";
import { User } from "./user.entity";

@Entity()
export class Result {
  @PrimaryColumn({ type: "uuid" })
  @ApiProperty({
    description: "The UUID of the user who submitted the result.",
    example: "9a02e64b-746c-44d4-b622-d5c743ef7fa4",
  })
  user_uuid: string;

  @PrimaryColumn({ type: "uuid" })
  @ApiProperty({
    description: "The UUID of the question related to this result.",
    example: "a7f5c4b9-5ff2-4d12-90ab-0a35e254b232",
  })
  question_uuid: string;

  @ManyToOne(() => User, { onDelete: "CASCADE", onUpdate: "CASCADE" })
  @JoinColumn({ name: "user_uuid", referencedColumnName: "uuid" })
  user: User;

  @ManyToOne(() => Question, { onDelete: "CASCADE", onUpdate: "CASCADE" })
  @JoinColumn({ name: "question_uuid", referencedColumnName: "uuid" })
  question: Question;

  @ManyToOne(() => Answer, { onDelete: "CASCADE", onUpdate: "CASCADE" })
  @JoinColumn({ name: "answer_uuid", referencedColumnName: "uuid" })
  answer: Answer;
}
