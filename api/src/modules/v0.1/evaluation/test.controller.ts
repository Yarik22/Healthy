import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
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

@Controller({ path: "test", version: ApiVersion.Version01 })
@ApiHeader({
  name: "Version",
  enum: Object.values(ApiVersion),
  required: true,
  description: "API version header",
})
export class TestController {
  constructor(private readonly testService: TestService) {}

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
