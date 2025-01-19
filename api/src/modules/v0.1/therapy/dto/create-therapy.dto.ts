import { ApiProperty } from "@nestjs/swagger";
import {
  IsString,
  IsOptional,
  IsEnum,
  IsByteLength,
  IsArray,
} from "class-validator";
import { Constraints } from "../../../../../../shared/constraints/database.constraint";
import { MentalState } from "../../../../../../shared/enums/therapy.enum";

export class CreateTherapyDto {
  @ApiProperty({
    description: "The title of the therapy.",
    example: "Cognitive Behavioral Therapy",
  })
  @IsString()
  @IsByteLength(1, Constraints.Therapy.titleMaxLength)
  title: string;

  @ApiProperty({
    description: "An optional description of the therapy.",
    example:
      "A therapeutic approach that helps individuals recognize and change harmful thought patterns.",
    nullable: true,
  })
  @IsOptional()
  @IsString()
  @IsByteLength(0, Constraints.Therapy.descriptionMaxLength)
  description?: string;

  @ApiProperty({
    description: "An optional URL for more information about the therapy.",
    example: "https://www.cbt.com",
    nullable: true,
  })
  @IsOptional()
  @IsString()
  @IsByteLength(0, Constraints.Therapy.urlMaxLength)
  url?: string;

  @ApiProperty({
    description: "An optional image associated with the therapy.",
    type: String,
    format: "binary",
    nullable: true,
  })
  @IsOptional()
  @IsByteLength(0, Constraints.Therapy.imgMaxLength)
  img?: Buffer;

  @ApiProperty({
    description: "An array of mental states that the therapy aims to address.",
    enum: MentalState,
    isArray: true,
    example: [MentalState.Apathy, MentalState.Anger],
  })
  @IsArray()
  @IsEnum(MentalState, { each: true })
  mentalStates: MentalState[];
}
