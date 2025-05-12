import { ApiProperty } from "@nestjs/swagger";
import {
  IsEnum,
  IsInt,
  IsOptional,
  IsString,
  IsByteLength,
} from "class-validator";
import { Constraints } from "../../../../../shared/constraints/database.constraint";
import { MentalState } from "../../../../../shared/enums/therapy.enum";

export class CreateAnswerDto {
  @ApiProperty({
    description: "The mental state associated with the answer.",
    enum: MentalState,
  })
  @IsEnum(MentalState)
  mentalState: MentalState;

  @ApiProperty({
    description: "The influence score associated with the answer.",
    example: 5,
  })
  @IsInt()
  influence: number;

  @ApiProperty({
    description:
      "The optional text field for additional information related to the answer.",
    example: "This is a sample text.",
    nullable: true,
  })
  @IsOptional()
  @IsString()
  @IsByteLength(0, Constraints.Answer.textMaxLength)
  text?: string;

  @ApiProperty({
    description: "The optional image file related to the answer.",
    type: String,
    format: "binary",
    nullable: true,
  })
  @IsOptional()
  @IsByteLength(0, Constraints.Answer.imgMaxLength)
  img?: string;
}
