import { Module } from "@nestjs/common";
import { UserService } from "./user.service";
import { UserController } from "./user.controller";
import { AuthController } from "./auth.controller";
import { User } from "src/database/entities/user.entity";
import { TypeOrmModule } from "@nestjs/typeorm";
import { GoogleStrategy } from "../utils/google.strategy";
import { SessionSerializer } from "../utils/session.serializer";
import { ImageService } from "../image/image.service";
import { ElasticsearchModule } from "@nestjs/elasticsearch";
import { ConfigModule, ConfigService } from "@nestjs/config";

@Module({
  imports: [
    TypeOrmModule.forFeature([User]),
    ElasticsearchModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        node: `http://${configService.get("ELASTICSEARCH_HOST")}:${configService.get("ELASTICSEARCH_PORT")}`,
        maxRetries: 10,
        requestTimeout: 60000,
        pingTimeout: 60000,
        sniffOnStart: true,
        auth: {
          username: configService.get("ELASTICSEARCH_USERNAME", "elastic"),
          password: configService.get("ELASTICSEARCH_PASSWORD", "elastic"),
        },
      }),
    }),
  ],
  controllers: [UserController, AuthController],
  providers: [UserService, GoogleStrategy, SessionSerializer, ImageService],
  exports: [GoogleStrategy, SessionSerializer, UserService],
})
export class UserModule {}
