import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";
import { ConfigService } from "@nestjs/config";
import { DocumentBuilder, SwaggerModule } from "@nestjs/swagger";
import { VersioningType } from "@nestjs/common";
import * as seesion from "express-session";
import * as passport from "passport";

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const configService = app.get(ConfigService);
  const PORT = configService.get<number>("port") || 3000;
  const CLIENT_PORT = configService.get<number>("CLIENT_PORT") || 4200;
  const API_PREFIX = configService.get<string>("API_PREFIX") || "api";
  const VERSION = configService.get<string>("API_VERSION") || "1";
  const SWAGGER_PREFIX = configService.get<string>("SWAGGER_PREFIX") || "1";
  const SECRET = configService.get<string>("SECRET") || "1";

  app.enableCors({
    origin: `http://localhost:${CLIENT_PORT}`,
    methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
    allowedHeaders: "Content-Type, Accept, Authorization",
    credentials: true,
  });

  app.setGlobalPrefix(API_PREFIX);
  app.use(
    seesion({
      secret: SECRET,
      saveUninitialized: false,
      resave: false,
      cookie: {
        maxAge: 2592000000,
        sameSite: "strict",
        httpOnly: false,
      },
    })
  );
  app.use(passport.initialize());
  app.use(passport.session());
  // app.enableVersioning({
  //   type: VersioningType.HEADER,
  //   header: "Version",
  //   defaultVersion: VERSION,
  // });

  const options = new DocumentBuilder()
    .setTitle("Healthy")
    .setDescription("Quick therapy recognition API")
    .setVersion(VERSION)
    .build();

  const document = SwaggerModule.createDocument(app, options);
  SwaggerModule.setup(`${SWAGGER_PREFIX}`, app, document);

  await app.listen(PORT, () => {
    console.log(`API running at: http://localhost:${PORT}/${API_PREFIX}`);
    console.log(`DOCS running at: http://localhost:${PORT}/${SWAGGER_PREFIX}`);
  });
}

bootstrap();
