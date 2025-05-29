import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
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
import { RoleName } from "../../../../shared/enums/user.enum";
import { Roles } from "../decorator/role.decorator";
import { RolesGuard } from "../guard/role.guard";

@Controller({ path: "answers", version: ApiVersion.Version02 })
@ApiHeader({
  name: "Version",
  enum: Object.values(ApiVersion),
  required: true,
  description: "API version header",
})
@UseGuards(RolesGuard)
export class AnswerController {
  constructor(private readonly answerService: AnswerService) {}

  @Roles(RoleName.User, RoleName.Moderator, RoleName.Admin)
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

}
