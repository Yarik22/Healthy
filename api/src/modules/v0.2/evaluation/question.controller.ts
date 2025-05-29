import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Req,
} from "@nestjs/common";
import { QuestionService } from "./question.service";
import { CreateQuestionDto } from "./dto/create-question.dto";
import { UpdateQuestionDto } from "./dto/update-question.dto";
import { Question } from "src/database/entities/question.entity";
import {
  ApiOperation,
  ApiResponse,
  ApiParam,
  ApiHeader,
} from "@nestjs/swagger";
import { from, Observable, switchMap } from "rxjs";
import { DeleteResult, UpdateResult } from "typeorm";
import { ApiVersion } from "src/modules/versions";
import { RoleName } from "../../../../shared/enums/user.enum";
import { Roles } from "../decorator/role.decorator";
import { RolesGuard } from "../guard/role.guard";
import { Request } from "express";
import { Result } from "src/database/entities/result.entity";
import { SubmitResultsDto } from "./dto/result.dto";
import { User } from "src/database/entities/user.entity";
@Controller({ path: "questions", version: ApiVersion.Version02 })
@ApiHeader({
  name: "Version",
  enum: Object.values(ApiVersion),
  required: true,
  description: "API version header",
})
@UseGuards(RolesGuard)
export class QuestionController {
  constructor(private readonly questionService: QuestionService) {}

  @Roles(RoleName.User, RoleName.Moderator, RoleName.Admin)
  @Get(":id")
  @ApiOperation({ summary: "Get a question by ID" })
  @ApiParam({
    name: "id",
    description: "The unique identifier of the question",
  })
  @ApiResponse({
    status: 200,
    description: "The question was successfully found.",
    type: Question,
  })
  @ApiResponse({
    status: 404,
    description: "Question not found",
  })
  handleFindQuestionById(@Param("id") id: string): Observable<Question> {
    return this.questionService.findById(id);
  }

  @Post("submit-results")
  @Roles(RoleName.User)
  @ApiOperation({ summary: "Submit answers for questions" })
  @ApiResponse({
    status: 201,
    description: "Answers submitted successfully.",
    type: [Result],
  })
  handleSubmitResults(
    @Req() req: Request,
    @Body() body: SubmitResultsDto
  ): Observable<Result[]> {
    return from(req.user as Promise<User>).pipe(
      switchMap((user: User) => {
        if (!user || !user.uuid) {
          throw new Error("User not found");
        }
        return this.questionService.submitResults(
          user.uuid,
          body.test_uuid,
          body.results
        );
      })
    );
  }

}
