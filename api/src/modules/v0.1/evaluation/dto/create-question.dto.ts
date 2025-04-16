import { ApiProperty } from "@nestjs/swagger";
import { IsString, IsOptional, IsByteLength } from "class-validator";
import { Constraints } from "../../../../../../shared/constraints/database.constraint";

export class CreateQuestionDto {
  @ApiProperty({
    description: "The title of the question.",
    example: "What is your level of stress?",
  })
  @IsString()
  @IsByteLength(1, Constraints.Question.titleMaxLength)
  title: string;

  @ApiProperty({
    description:
      "An optional description providing more context for the question.",
    example: "Please describe your stress levels over the past week.",
    nullable: true,
  })
  @IsOptional()
  @IsString()
  @IsByteLength(0, Constraints.Question.descriptionMaxLength)
  description?: string;

  @ApiProperty({
    description: "An optional image associated with the question.",
    type: String,
    format: "binary",
    nullable: true,
  })
  @IsOptional()
  @IsByteLength(0, Constraints.Question.imgMaxLength)
  img?: string;
}
