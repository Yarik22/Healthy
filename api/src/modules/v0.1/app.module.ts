import { Module } from "@nestjs/common";
import { UserModule } from "./user/user.module";
import { TherapyModule } from "./therapy/therapy.module";
import { EvaluationModule } from "./evaluation/evaluation.module";

@Module({
  imports: [UserModule, TherapyModule, EvaluationModule],
})
export class AppModule {}
