import { Entity, Column, JoinTable, ManyToMany } from "typeorm";
import { User } from "./user.entity";
import { ApiProperty } from "@nestjs/swagger";
import { Constraints } from "../../../../shared/constraints/database.constraint";
import { RoleName } from "../../../../shared/enums/user.enum";
import { BaseEntity } from "../base.entity";

@Entity()
export class Role extends BaseEntity {
  @Column({
    type: "enum",
    unique: true,
    enum: RoleName,
    default: RoleName.User,
  })
  @ApiProperty({
    description: "The name of the role.",
    enum: RoleName,
    example: RoleName.User,
  })
  name: RoleName;

  @Column({
    type: "varchar",
    length: Constraints.Role.descriptionMaxLength,
    nullable: true,
  })
  @ApiProperty({
    description: "An optional description for the role.",
    example: "Standard user with access to basic features.",
    nullable: true,
  })
  description: string;

  @ManyToMany(() => User, (user) => user.roles, {
    onDelete: "CASCADE",
    onUpdate: "CASCADE",
  })
  @JoinTable({
    name: "user_role",
    joinColumn: { name: "role_uuid", referencedColumnName: "uuid" },
    inverseJoinColumn: { name: "user_uuid", referencedColumnName: "uuid" },
  })
  @ApiProperty({
    description: "The users associated with this role.",
    type: [User],
  })
  users: User[];
}
