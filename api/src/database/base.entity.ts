import {
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from "typeorm";
import { ApiProperty } from "@nestjs/swagger";

export abstract class BaseEntity {
  @PrimaryGeneratedColumn("uuid")
  @ApiProperty({
    description: "The unique identifier of the entity.",
    example: "9a02e64b-746c-44d4-b622-d5c743ef7fa4",
  })
  uuid: string;

  @CreateDateColumn()
  @ApiProperty({
    description: "The timestamp when the entity was created.",
    example: "2025-01-14T12:00:00Z",
  })
  createdAt: Date;

  @UpdateDateColumn()
  @ApiProperty({
    description: "The timestamp when the entity was last updated.",
    example: "2025-01-14T12:00:00Z",
  })
  updatedAt: Date;
}
