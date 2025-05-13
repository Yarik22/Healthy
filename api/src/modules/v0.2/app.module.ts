import { Module } from "@nestjs/common";
import { UserModule } from "./user/user.module";
import { TherapyModule } from "./therapy/therapy.module";
import { EvaluationModule } from "./evaluation/evaluation.module";
import { RabbitMQModule } from "./rabbitmq/rabbitmq.module";

@Module({
  imports: [UserModule, TherapyModule, EvaluationModule, RabbitMQModule],
})
export class AppModule {}
