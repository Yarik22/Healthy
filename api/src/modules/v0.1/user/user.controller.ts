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
import { UserService } from "./user.service";
import { CreateUserDto } from "./dto/create-user.dto";
import { UpdateUserDto } from "./dto/update-user.dto";
import {
  ApiHeader,
  ApiOperation,
  ApiResponse,
  ApiParam,
} from "@nestjs/swagger";
import { ApiVersion } from "src/modules/versions";
import { Observable } from "rxjs";
import { User } from "src/database/entities/user.entity";
import { DeleteResult, UpdateResult } from "typeorm";
import { RoleName } from "../../../../../shared/enums/user.enum";
import { Roles } from "../decorator/role.decorator";
import { RolesGuard } from "../guard/role.guard";

@Controller({ path: "user", version: ApiVersion.Version01 })
@ApiHeader({
  name: "Version",
  enum: Object.values(ApiVersion),
  required: true,
  description: "API version header",
})
@UseGuards(RolesGuard)
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Roles(RoleName.Admin)
  @Post()
  @ApiOperation({ summary: "Create a new user" })
  @ApiResponse({
    status: 201,
    description: "The user has been successfully created.",
    type: User,
  })
  handleCreate(@Body() user: CreateUserDto): Observable<User> {
    return this.userService.create(user);
  }

  @Roles(RoleName.Admin)
  @Get(":id")
  @ApiOperation({ summary: "Get a user by ID" })
  @ApiParam({ name: "id", description: "The unique identifier of the user" })
  @ApiResponse({
    status: 200,
    description: "The user was successfully found.",
    type: User,
  })
  @ApiResponse({
    status: 404,
    description: "User not found",
  })
  handleFindOne(@Param("id") id: string): Observable<User> {
    return this.userService.findById(id);
  }

  @Roles(RoleName.Admin)
  @Get()
  @ApiOperation({ summary: "Get a list of all users" })
  @ApiResponse({
    status: 200,
    description: "List of users retrieved successfully.",
    type: [User],
  })
  handleFindAll(): Observable<User[]> {
    return this.userService.findAll();
  }

  @Roles(RoleName.Admin)
  @Patch(":id")
  @ApiOperation({ summary: "Update user information by ID" })
  @ApiParam({ name: "id", description: "The unique identifier of the user" })
  @ApiResponse({
    status: 200,
    description: "User updated successfully.",
    type: UpdateResult,
  })
  @ApiResponse({
    status: 404,
    description: "User not found",
  })
  handleUpdate(
    @Param("id") id: string,
    @Body() user: UpdateUserDto
  ): Observable<UpdateResult> {
    return this.userService.update(id, user);
  }

  @Roles(RoleName.Admin)
  @Delete(":id")
  @ApiOperation({ summary: "Delete a user by ID" })
  @ApiParam({ name: "id", description: "The unique identifier of the user" })
  @ApiResponse({
    status: 200,
    description: "The user has been successfully deleted.",
    type: DeleteResult,
  })
  @ApiResponse({
    status: 404,
    description: "User not found",
  })
  handleDelete(@Param("id") id: string): Observable<DeleteResult> {
    return this.userService.delete(id);
  }
}
