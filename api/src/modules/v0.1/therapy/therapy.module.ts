import { Module } from "@nestjs/common";
import { TherapyService } from "./therapy.service";
import { TherapyController } from "./therapy.controller";
import { Therapy } from "src/database/entities/therapy.entity";
import { TypeOrmModule } from "@nestjs/typeorm";
import { UserModule } from "../user/user.module";

@Module({
  imports: [TypeOrmModule.forFeature([Therapy]), UserModule],
  controllers: [TherapyController],
  providers: [TherapyService],
})
export class TherapyModule {}
