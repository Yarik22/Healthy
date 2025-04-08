import { Module } from "@nestjs/common";
import { EvaluationController } from "./evaluation.controller";
import { QuestionService } from "./question.service";
import { AnswerService } from "./answer.service";
import { Answer } from "src/database/entities/answer.entity";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Question } from "src/database/entities/question.entity";
import { TestService } from "./test.service";
import { Test } from "src/database/entities/test.entity";
import { AnswerController } from "./answer.controller";
import { QuestionController } from "./question.controller";
import { TestController } from "./test.controller";
import { UserModule } from "../user/user.module";

@Module({
  imports: [TypeOrmModule.forFeature([Answer, Question, Test]),UserModule],
  controllers: [
    EvaluationController,
    AnswerController,
    QuestionController,
    TestController,
  ],
  providers: [QuestionService, AnswerService, TestService],
})
export class EvaluationModule {}
