import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";
import { ConfigService } from "@nestjs/config";
import { DocumentBuilder, SwaggerModule } from "@nestjs/swagger";
import { VersioningType } from "@nestjs/common";

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const configService = app.get(ConfigService);
  const PORT = configService.get<number>("PORT") || 3000;
  const PREFIX = configService.get<string>("API_PREFIX") || "api";
  const VERSION = configService.get<string>("API_VERSION") || "1";

  app.enableVersioning({
    type: VersioningType.HEADER,
    header: "Version",
    defaultVersion: VERSION,
  });

  const options = new DocumentBuilder()
    .setTitle("Healthy")
    .setDescription("Quick therapy recognition API")
    .build();

  const document = SwaggerModule.createDocument(app, options);
  SwaggerModule.setup(`${PREFIX}`, app, document);

  await app.listen(PORT, () => {
    console.log(`API running at: http://localhost:${PORT}/${PREFIX}`);
  });
}

bootstrap();
