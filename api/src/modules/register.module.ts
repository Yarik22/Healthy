import { Module } from "@nestjs/common";
import { AppModule as AppModuleV02 } from "./v0.2/app.module";

@Module({
  imports: [AppModuleV02],
})
export class RegisterModule {}
