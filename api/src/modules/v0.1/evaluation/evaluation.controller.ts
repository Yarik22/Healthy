import { Controller, UseGuards } from "@nestjs/common";
import { AnswerService } from "./answer.service";
import { QuestionService } from "./question.service";
import { TestService } from "./test.service";

import { ApiVersion } from "src/modules/versions";
import { ApiHeader } from "@nestjs/swagger";
import { RoleName } from "../../../../../shared/enums/user.enum";
import { Roles } from "../decorator/role.decorator";
import { RolesGuard } from "../guard/role.guard";

@Controller({ path: "evaluation", version: ApiVersion.Version01 })
@ApiHeader({
  name: "Version",
  enum: Object.values(ApiVersion),
  required: true,
  description: "API version header",
})
@UseGuards(RolesGuard)
export class EvaluationController {
  constructor(
    private readonly answerService: AnswerService,
    private readonly questionService: QuestionService,
    private readonly testService: TestService
  ) {}
}
