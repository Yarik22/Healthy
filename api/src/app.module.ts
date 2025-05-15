import { Module } from "@nestjs/common";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { config } from "../config";
import { RegisterModule } from "./modules/register.module";
import { DatabaseModule } from "./database/database.module";
import { PassportModule } from "@nestjs/passport";
import { redisStore } from "cache-manager-redis-yet";
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
    // CacheModule.registerAsync({
    //   isGlobal: true,
    //   useFactory: async (cfg) => {
    //     const store = await redisStore({
    //       socket: {
    //         host: "localhost",
    //         port: 6379,
    //       },
    //     });
    //     return { store };
    //   },
    //   inject: [ConfigService],
    // }),
    CacheModule.register({
      max: 100,
      ttl: 0,
      isGlobal: true,
      store: redisStore,
      host: "localhost",
      port: 6379,
    }),
  ],
})
export class AppModule {}
