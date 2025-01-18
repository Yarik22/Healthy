import {
  IsOptional,
  IsString,
  IsEmail,
  IsEnum,
  IsBoolean,
  IsDateString,
  IsByteLength,
} from "class-validator";
import { ApiProperty } from "@nestjs/swagger";
import { Constraints } from "../../../../../../shared/constraints/database.constraint";
import { Sex } from "../../../../../../shared/enums/user.enum";

export class UpdateUserDto {
  @IsOptional()
  @IsEmail()
  @IsString()
  @ApiProperty({
    description: "The unique email address of the user.",
    example: "user@example.com",
    required: false,
  })
  email?: string;

  @IsOptional()
  @IsString()
  @IsByteLength(1, Constraints.User.nicknameMaxLength)
  @ApiProperty({
    description: "The unique nickname of the user.",
    example: "usernickname",
    required: false,
  })
  nickname?: string;

  @IsOptional()
  @IsDateString()
  @ApiProperty({
    description: "The birthdate of the user.",
    example: "1990-01-01",
    required: false,
  })
  birthdate?: Date;

  @IsOptional()
  @IsEnum(Sex)
  @ApiProperty({
    description: "The sex of the user.",
    enum: Sex,
    example: Sex.Male,
    required: false,
  })
  sex?: Sex;

  @IsOptional()
  @IsString()
  @IsByteLength(1, Constraints.User.bioMaxLength)
  @ApiProperty({
    description: "A short bio of the user.",
    example: "A brief description about the user.",
    required: false,
  })
  bio?: string;

  @IsOptional()
  @IsBoolean()
  @ApiProperty({
    description: "Indicates whether the user is banned.",
    example: false,
    required: false,
  })
  banned?: boolean;

  @IsOptional()
  @ApiProperty({
    description: "An optional profile image for the user.",
    type: String,
    format: "binary",
    required: false,
  })
  img?: Buffer;
}
