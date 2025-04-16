import { Module } from "@nestjs/common";
import { UserService } from "./user.service";
import { UserController } from "./user.controller";
import { AuthController } from "./auth.controller";
import { User } from "src/database/entities/user.entity";
import { TypeOrmModule } from "@nestjs/typeorm";
import { GoogleStrategy } from "../utils/google.strategy";
import { SessionSerializer } from "../utils/session.serializer";
import { ImageService } from "../image/image.service";

@Module({
  imports: [TypeOrmModule.forFeature([User])],
  controllers: [UserController, AuthController],
  providers: [UserService, GoogleStrategy, SessionSerializer, ImageService],
  exports: [GoogleStrategy, SessionSerializer, UserService],
})
export class UserModule {}
