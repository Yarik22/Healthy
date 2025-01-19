import { ApiProperty } from "@nestjs/swagger";
import {
  IsString,
  IsEmail,
  IsOptional,
  IsEnum,
  IsBoolean,
  IsDate,
  IsByteLength,
  IsNotEmpty,
} from "class-validator";
import { Constraints } from "../../../../../../shared/constraints/database.constraint";
import { Sex } from "../../../../../../shared/enums/user.enum";

export class CreateUserDto {
  @ApiProperty({
    description: "The email address of the user.",
    example: "user@example.com",
  })
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @ApiProperty({
    description: "The nickname of the user.",
    example: "usernickname",
  })
  @IsString()
  @IsNotEmpty()
  @IsByteLength(1, Constraints.User.nicknameMaxLength)
  nickname: string;

  @ApiProperty({
    description: "The birthdate of the user.",
    example: "1990-01-01",
    nullable: true,
  })
  @IsOptional()
  @IsDate()
  birthdate?: Date;

  @ApiProperty({
    description: "The sex of the user.",
    enum: Sex,
    example: Sex.Male,
    nullable: true,
  })
  @IsOptional()
  @IsEnum(Sex)
  sex?: Sex;

  @ApiProperty({
    description: "A short bio of the user.",
    example: "A brief description about the user.",
    nullable: true,
  })
  @IsOptional()
  @IsString()
  @IsByteLength(1, Constraints.User.bioMaxLength)
  bio?: string;

  @ApiProperty({
    description: "Indicates whether the user is banned.",
    example: false,
  })
  @IsOptional()
  @IsBoolean()
  banned?: boolean;

  @ApiProperty({
    description: "An optional profile image for the user.",
    type: String,
    format: "binary",
    nullable: true,
  })
  @IsOptional()
  @IsByteLength(0, Constraints.User.imgMaxLength)
  img?: Buffer;
}
