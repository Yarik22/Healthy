import { Module } from "@nestjs/common";
import { AppModule as AppModuleV01 } from "./v0.1/app.module";
import { AppModule as AppModuleV02 } from "./v0.2/app.module";

@Module({
  imports: [AppModuleV01, AppModuleV02],
})
export class RegisterModule {}
