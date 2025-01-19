import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from "@nestjs/common";
import { AnswerService } from "./answer.service";
import { CreateAnswerDto } from "./dto/create-answer.dto";
import { UpdateAnswerDto } from "./dto/update-answer.dto";
import { Answer } from "src/database/entities/answer.entity";
import {
  ApiOperation,
  ApiResponse,
  ApiParam,
  ApiHeader,
} from "@nestjs/swagger";
import { Observable } from "rxjs";
import { DeleteResult, UpdateResult } from "typeorm";
import { ApiVersion } from "src/modules/versions";

@Controller({ path: "answer", version: ApiVersion.Version01 })
@ApiHeader({
  name: "Version",
  enum: Object.values(ApiVersion),
  required: true,
  description: "API version header",
})
export class AnswerController {
  constructor(private readonly answerService: AnswerService) {}

  @Post()
  @ApiOperation({ summary: "Create a new answer" })
  @ApiResponse({
    status: 201,
    description: "The answer has been successfully created.",
    type: Answer,
  })
  handleCreateAnswer(@Body() answer: CreateAnswerDto): Observable<Answer> {
    return this.answerService.create(answer);
  }

  @Get(":id")
  @ApiOperation({ summary: "Get an answer by ID" })
  @ApiParam({ name: "id", description: "The unique identifier of the answer" })
  @ApiResponse({
    status: 200,
    description: "The answer was successfully found.",
    type: Answer,
  })
  @ApiResponse({
    status: 404,
    description: "Answer not found",
  })
  handleFindAnswerById(@Param("id") id: string): Observable<Answer> {
    return this.answerService.findById(id);
  }

  @Get()
  @ApiOperation({ summary: "Get a list of all answers" })
  @ApiResponse({
    status: 200,
    description: "List of answers retrieved successfully.",
    type: [Answer],
  })
  handleFindAllAnswers(): Observable<Answer[]> {
    return this.answerService.findAll();
  }

  @Patch(":id")
  @ApiOperation({ summary: "Update an answer by ID" })
  @ApiParam({ name: "id", description: "The unique identifier of the answer" })
  @ApiResponse({
    status: 200,
    description: "The answer was successfully updated.",
    type: UpdateResult,
  })
  @ApiResponse({
    status: 404,
    description: "Answer not found",
  })
  handleUpdateAnswer(
    @Param("id") id: string,
    @Body() updateAnswerDto: UpdateAnswerDto
  ): Observable<UpdateResult> {
    return this.answerService.update(id, updateAnswerDto);
  }

  @Delete(":id")
  @ApiOperation({ summary: "Delete an answer by ID" })
  @ApiParam({ name: "id", description: "The unique identifier of the answer" })
  @ApiResponse({
    status: 200,
    description: "The answer has been successfully deleted.",
    type: DeleteResult,
  })
  @ApiResponse({
    status: 404,
    description: "Answer not found",
  })
  handleDeleteAnswer(@Param("id") id: string): Observable<DeleteResult> {
    return this.answerService.delete(id);
  }
}
