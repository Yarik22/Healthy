import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { config } from "../config";
import { RegisterModule } from "./modules/register.module";
import { DatabaseModule } from "./database/database.module";
import { PassportModule } from "@nestjs/passport";

@Module({
  imports: [
    ConfigModule.forRoot({
      load: [config],
      isGlobal: true,
    }),
    RegisterModule,
    DatabaseModule,
    PassportModule.register({ session: true }),
  ],
})
export class AppModule {}
