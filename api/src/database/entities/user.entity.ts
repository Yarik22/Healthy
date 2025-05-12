import {
  Entity,
  Column,
  Unique,
  Index,
  ManyToMany,
  JoinTable,
  OneToMany,
  Check,
} from "typeorm";
import { ApiProperty } from "@nestjs/swagger";
import { Constraints } from "../../../shared/constraints/database.constraint";
import { Sex } from "../../../shared/enums/user.enum";
import { Conclusion } from "./conclusion.entity";
import { Result } from "./result.entity";
import { Role } from "./role.entity";
import { BaseEntity } from "../base.entity";

@Entity()
@Check(`length(img) <= ${Constraints.User.imgMaxLength}`)
@Unique(["email", "nickname"])
export class User extends BaseEntity {
  @ManyToMany(() => Role, (role) => role.users, {
    onDelete: "CASCADE",
    onUpdate: "CASCADE",
  })
  @JoinTable({
    name: "user_role",
    joinColumn: { name: "user_uuid", referencedColumnName: "uuid" },
    inverseJoinColumn: { name: "role_uuid", referencedColumnName: "uuid" },
  })
  roles: Role[];

  @OneToMany(() => Conclusion, (conclusion) => conclusion.user)
  conclusions: Conclusion[];

  @OneToMany(() => Result, (result) => result.user)
  results: Result[];

  @Column({
    type: "varchar",
    length: Constraints.User.emailMaxLength,
    unique: true,
  })
  @Index()
  @ApiProperty({
    description: "The unique email address of the user.",
    example: "user@example.com",
  })
  email: string;

  @Column({
    type: "varchar",
    length: Constraints.User.nicknameMaxLength,
    unique: true,
  })
  @Index()
  @ApiProperty({
    description: "The unique nickname of the user.",
    example: "usernickname",
  })
  nickname: string;

  @Column({
    type: "date",
    nullable: true,
  })
  @ApiProperty({
    description: "The birthdate of the user.",
    example: "1990-01-01",
    nullable: true,
  })
  birthdate: Date;

  @Column({
    type: "enum",
    enum: Sex,
    nullable: true,
  })
  @ApiProperty({
    description: "The sex of the user.",
    enum: Sex,
    example: Sex.Male,
    nullable: true,
  })
  sex: Sex;

  @Column({
    type: "varchar",
    length: Constraints.User.bioMaxLength,
    nullable: true,
  })
  @ApiProperty({
    description: "A short bio of the user.",
    example: "A brief description about the user.",
    nullable: true,
  })
  bio: string;

  @Column({
    type: "boolean",
    default: false,
  })
  @ApiProperty({
    description: "Indicates whether the user is banned.",
    example: false,
  })
  banned: boolean;

  @Column({
    type: "varchar",
    length: Constraints.User.imgMaxLength,
    nullable: true,
  })
  @ApiProperty({
    description: "An optional profile image for the user in base64 format.",
    type: String,
    format: "binary",
    nullable: true,
  })
  img: string;
}
