import { Module } from "@nestjs/common";
import { UserModule } from "./user/user.module";
import { TherapyModule } from "./therapy/therapy.module";
import { EvaluationModule } from "./evaluation/evaluation.module";
import { AIModule } from "./ai/ai.module";

@Module({
  imports: [UserModule, TherapyModule, EvaluationModule, AIModule],
})
export class AppModule {}
