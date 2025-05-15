import { Module } from "@nestjs/common";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { config } from "../config";
import { RegisterModule } from "./modules/register.module";
import { DatabaseModule } from "./database/database.module";
import { PassportModule } from "@nestjs/passport";
import * as redisStore from 'cache-manager-redis-store';
import { CacheModule } from "@nestjs/cache-manager";

@Module({
  imports: [
    ConfigModule.forRoot({
      load: [config],
      isGlobal: true,
    }),
    RegisterModule,
    DatabaseModule,
    PassportModule.register({ session: true }),
    CacheModule.register({
      max: 100,
      ttl: 0,
      isGlobal: true,
      store: redisStore,
      host: process.env.REDIS_HOST,
      port: +process.env.REDIS_PORT,
    }),
  ],
})
export class AppModule {}
