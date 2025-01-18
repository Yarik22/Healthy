import { Module } from "@nestjs/common";
import { AppModule as AppModuleV01 } from "./v0.1/app.module";

@Module({
  imports: [AppModuleV01],
})
export class RegisterModule {}
