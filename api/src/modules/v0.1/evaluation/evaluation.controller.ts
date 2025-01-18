import { Controller } from "@nestjs/common";
import { AnswerService } from "./answer.service";
import { QuestionService } from "./question.service";
import { ApiVersion } from "src/modules/versions";
import { ApiHeader } from "@nestjs/swagger";
import { TestService } from "./test.service";

@Controller({ path: "evaluation", version: ApiVersion.Version01 })
@ApiHeader({
  name: "Version",
  enum: Object.values(ApiVersion),
  required: true,
  description: "API version header",
})
export class EvaluationController {
  constructor(
    private readonly answerService: AnswerService,
    private readonly questionService: QuestionService,
    private readonly testService: TestService
  ) {}
}
