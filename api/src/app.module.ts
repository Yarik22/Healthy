import { Controller, Get, Module } from "@nestjs/common";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { TypeOrmModule } from "@nestjs/typeorm";
import { config } from "../config";
import { RegisterModule } from "./modules/register.module";

@Module({
  imports: [
    ConfigModule.forRoot({
      load: [config],
      isGlobal: true,
    }),
    TypeOrmModule.forRootAsync({
      useFactory: (configService: ConfigService) => ({
        type: "postgres",
        host: configService.get("DATABASE_HOST"),
        port: configService.get<number>("DATABASE_PORT"),
        username: configService.get("DATABASE_USER"),
        password: configService.get("DATABASE_PASSWORD"),
        database: configService.get("DATABASE_NAME"),
        entities: [__dirname + "/../**/*.entity.{ts,js}"],
        synchronize: false,
        autoLoadEntities: true,
        migrations: [__dirname + "/migrations/**/*.{ts,js}"],
      }),
      inject: [ConfigService],
    }),
    RegisterModule,
  ],
})
export class AppModule {}
