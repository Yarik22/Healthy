import { Module } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { TypeOrmModule } from "@nestjs/typeorm";

@Module({
  imports: [
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
  ],
})
export class DatabaseModule {}
