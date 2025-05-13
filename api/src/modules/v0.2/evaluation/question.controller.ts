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

  // @Roles(RoleName.Admin)
  // @Post()
  // @ApiOperation({ summary: "Create a new question" })
  // @ApiResponse({
  //   status: 201,
  //   description: "The question has been successfully created.",
  //   type: Question,
  // })
  // handleCreateQuestion(
  //   @Body() question: CreateQuestionDto
  // ): Observable<Question> {
  //   return this.questionService.create(question);
  // }

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

  // @Roles(RoleName.Admin)
  // @Get()
  // @ApiOperation({ summary: "Get a list of all questions" })
  // @ApiResponse({
  //   status: 200,
  //   description: "List of questions retrieved successfully.",
  //   type: [Question],
  // })
  // handleFindAllQuestions(): Observable<Question[]> {
  //   return this.questionService.findAll();
  // }

  // @Roles(RoleName.Admin)
  // @Patch(":id")
  // @ApiOperation({ summary: "Update a question by ID" })
  // @ApiParam({
  //   name: "id",
  //   description: "The unique identifier of the question",
  // })
  // @ApiResponse({
  //   status: 200,
  //   description: "The question was successfully updated.",
  //   type: UpdateResult,
  // })
  // @ApiResponse({
  //   status: 404,
  //   description: "Question not found",
  // })
  // handleUpdateQuestion(
  //   @Param("id") id: string,
  //   @Body() updateQuestionDto: UpdateQuestionDto
  // ): Observable<UpdateResult> {
  //   return this.questionService.update(id, updateQuestionDto);
  // }

  // @Roles(RoleName.Admin)
  // @Delete(":id")
  // @ApiOperation({ summary: "Delete a question by ID" })
  // @ApiParam({
  //   name: "id",
  //   description: "The unique identifier of the question",
  // })
  // @ApiResponse({
  //   status: 200,
  //   description: "The question has been successfully deleted.",
  //   type: DeleteResult,
  // })
  // @ApiResponse({
  //   status: 404,
  //   description: "Question not found",
  // })
  // handleDeleteQuestion(@Param("id") id: string): Observable<DeleteResult> {
  //   return this.questionService.delete(id);
  // }
}
