import { ApiProperty } from "@nestjs/swagger";
import {
  IsString,
  IsOptional,
  IsArray,
  IsUUID,
  IsByteLength,
} from "class-validator";
import { Constraints } from "../../../../../shared/constraints/database.constraint";
import { CreateQuestionDto } from "./create-question.dto";

export class CreateTestDto {
  @ApiProperty({
    description: "The title of the test.",
    example: "Mental Health Assessment",
  })
  @IsString()
  @IsByteLength(1, Constraints.Test.titleMaxLength)
  title: string;

  @ApiProperty({
    description: "An optional description of the test.",
    example:
      "This test assesses the mental health of individuals using various psychological questions.",
    nullable: true,
  })
  @IsOptional()
  @IsString()
  @IsByteLength(0, Constraints.Test.descriptionMaxLength)
  description?: string;

  @ApiProperty({
    description: "An optional image related to the test.",
    type: String,
    format: "binary",
    nullable: true,
  })
  @IsOptional()
  @IsByteLength(0, Constraints.Test.imgMaxLength)
  img?: string;

  questions: CreateQuestionDto[];
}
