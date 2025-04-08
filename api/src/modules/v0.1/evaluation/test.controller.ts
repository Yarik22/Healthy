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
import { TestService } from "./test.service";
import { CreateTestDto } from "./dto/create-test.dto";
import { UpdateTestDto } from "./dto/update-test.dto";
import { Test } from "src/database/entities/test.entity";
import {
  ApiOperation,
  ApiResponse,
  ApiParam,
  ApiHeader,
} from "@nestjs/swagger";
import { Observable } from "rxjs";
import { DeleteResult, UpdateResult } from "typeorm";
import { ApiVersion } from "src/modules/versions";
import { RoleName } from "../../../../../shared/enums/user.enum";
import { Roles } from "../decorator/role.decorator";
import { RolesGuard } from "../guard/role.guard";

@Controller({ path: "test", version: ApiVersion.Version01 })
@ApiHeader({
  name: "Version",
  enum: Object.values(ApiVersion),
  required: true,
  description: "API version header",
})
@UseGuards(RolesGuard)
export class TestController {
  constructor(private readonly testService: TestService) {}

  @Roles(RoleName.Admin)
  @Post()
  @ApiOperation({ summary: "Create a new test" })
  @ApiResponse({
    status: 201,
    description: "The test has been successfully created.",
    type: Test,
  })
  handleCreateTest(@Body() test: CreateTestDto): Observable<Test> {
    return this.testService.create(test);
  }

  @Roles(RoleName.Admin)
  @Get(":id")
  @ApiOperation({ summary: "Get a test by ID" })
  @ApiParam({ name: "id", description: "The unique identifier of the test" })
  @ApiResponse({
    status: 200,
    description: "The test was successfully found.",
    type: Test,
  })
  @ApiResponse({
    status: 404,
    description: "Test not found",
  })
  handleFindTestById(@Param("id") id: string): Observable<Test> {
    return this.testService.findById(id);
  }

  @Roles(RoleName.Admin)
  @Get()
  @ApiOperation({ summary: "Get a list of all tests" })
  @ApiResponse({
    status: 200,
    description: "List of tests retrieved successfully.",
    type: [Test],
  })
  handleFindAllTests(): Observable<Test[]> {
    return this.testService.findAll();
  }

  @Roles(RoleName.Admin)
  @Patch(":id")
  @ApiOperation({ summary: "Update a test by ID" })
  @ApiParam({ name: "id", description: "The unique identifier of the test" })
  @ApiResponse({
    status: 200,
    description: "The test was successfully updated.",
    type: UpdateResult,
  })
  @ApiResponse({
    status: 404,
    description: "Test not found",
  })
  handleUpdateTest(
    @Param("id") id: string,
    @Body() updateTestDto: UpdateTestDto
  ): Observable<UpdateResult> {
    return this.testService.update(id, updateTestDto);
  }

  @Roles(RoleName.Admin)
  @Delete(":id")
  @ApiOperation({ summary: "Delete a test by ID" })
  @ApiParam({ name: "id", description: "The unique identifier of the test" })
  @ApiResponse({
    status: 200,
    description: "The test has been successfully deleted.",
    type: DeleteResult,
  })
  @ApiResponse({
    status: 404,
    description: "Test not found",
  })
  handleDeleteTest(@Param("id") id: string): Observable<DeleteResult> {
    return this.testService.delete(id);
  }
}
