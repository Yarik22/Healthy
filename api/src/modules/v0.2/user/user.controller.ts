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
  Query,
} from "@nestjs/common";
import { UserService } from "./user.service";
import { CreateUserDto } from "./dto/create-user.dto";
import { UpdateUserDto } from "./dto/update-user.dto";
import {
  ApiHeader,
  ApiOperation,
  ApiResponse,
  ApiParam,
  ApiQuery,
} from "@nestjs/swagger";
import { ApiVersion } from "src/modules/versions";
import { from, Observable, switchMap } from "rxjs";
import { User } from "src/database/entities/user.entity";
import { DeleteResult, UpdateResult } from "typeorm";
import { RoleName, Sex } from "../../../../shared/enums/user.enum";
import { Roles } from "../decorator/role.decorator";
import { RolesGuard } from "../guard/role.guard";
import { Request } from "express";
import { faker } from "@faker-js/faker";
import { ElasticsearchService } from "@nestjs/elasticsearch";

@Controller({ path: "users", version: ApiVersion.Version02 })
@ApiHeader({
  name: "Version",
  enum: Object.values(ApiVersion),
  required: true,
  description: "API version header",
})
@UseGuards(RolesGuard)
export class UserController {
  constructor(
    private readonly userService: UserService,
    private readonly elasticsearchService: ElasticsearchService
  ) {}

  @Roles(RoleName.User, RoleName.Moderator, RoleName.Admin)
  @Get("search")
  @ApiOperation({ summary: "Search users by nickname" })
  @ApiQuery({
    name: "nickname",
    required: true,
    type: String,
    description: "Nickname to search for (fuzzy match supported)",
  })
  @ApiResponse({
    status: 200,
    description: "List of users found",
    type: [User],
  })
  handleSearchByNickname(
    @Query("nickname") nickname: string
  ): Observable<User[]> {
    return this.userService.findByNickname(nickname);
  }

  @Roles(RoleName.User)
  @ApiOperation({ summary: "Get current user" })
  @ApiResponse({
    status: 200,
    description: "The user was successfully found.",
    type: User,
  })
  @ApiResponse({
    status: 404,
    description: "User not found",
  })
  @Get("me")
  async handleMe(@Req() req: Request) {
    return req.user;
  }

  @Roles(RoleName.User)
  @Patch("me")
  @ApiOperation({ summary: "Update current user information" })
  @ApiResponse({
    status: 200,
    description: "User updated successfully.",
    type: UpdateResult,
  })
  @ApiResponse({
    status: 404,
    description: "User not found",
  })
  handleMeEdit(
    @Req() req: Request,
    @Body() userData: UpdateUserDto
  ): Observable<UpdateResult> {
    return from(req.user as Promise<User>).pipe(
      switchMap((user: User) => {
        if (!user || !user.uuid) {
          throw new Error("User not found");
        }
        return this.userService.updateUserProfile(user.uuid, userData);
      })
    );
  }

  // @Roles(RoleName.Admin)
  // @Post()
  // @ApiOperation({ summary: "Create a new user" })
  // @ApiResponse({
  //   status: 201,
  //   description: "The user has been successfully created.",
  //   type: User,
  // })
  // handleCreate(@Body() user: CreateUserDto): Observable<User> {
  //   return this.userService.create(user);
  // }

  @Roles(RoleName.User, RoleName.Moderator, RoleName.Admin)
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

  // @Roles(RoleName.Admin)
  // @Get()
  // @ApiOperation({ summary: "Get a list of all users" })
  // @ApiResponse({
  //   status: 200,
  //   description: "List of users retrieved successfully.",
  //   type: [User],
  // })
  // handleFindAll(): Observable<User[]> {
  //   return this.userService.findAll();
  // }

  // @Roles(RoleName.Admin)
  // @Patch(":id")
  // @ApiOperation({ summary: "Update user information by ID" })
  // @ApiParam({ name: "id", description: "The unique identifier of the user" })
  // @ApiResponse({
  //   status: 200,
  //   description: "User updated successfully.",
  //   type: UpdateResult,
  // })
  // @ApiResponse({
  //   status: 404,
  //   description: "User not found",
  // })
  // handleUpdate(
  //   @Param("id") id: string,
  //   @Body() user: UpdateUserDto
  // ): Observable<UpdateResult> {
  //   return this.userService.update(id, user);
  // }

  // @Roles(RoleName.Admin)
  // @Delete(":id")
  // @ApiOperation({ summary: "Delete a user by ID" })
  // @ApiParam({ name: "id", description: "The unique identifier of the user" })
  // @ApiResponse({
  //   status: 200,
  //   description: "The user has been successfully deleted.",
  //   type: DeleteResult,
  // })
  // @ApiResponse({
  //   status: 404,
  //   description: "User not found",
  // })
  // handleDelete(@Param("id") id: string): Observable<DeleteResult> {
  //   return this.userService.delete(id);
  // }

  @Roles(RoleName.Admin)
  @Post("mock")
  @ApiOperation({ summary: "Generate and save mock users for testing" })
  @ApiQuery({
    name: "mockUsersCount",
    required: false,
    type: Number,
    example: 1000,
  })
  @ApiResponse({
    status: 201,
    description: "Mock users created",
    schema: {
      example: { count: 1000 },
    },
  })
  async generateMockUsers(
    @Query("mockUsersCount") mockUsersCount = 1000
  ): Promise<{ count: number }> {
    const mockUsers: CreateUserDto[] = [];

    await this.elasticsearchService.indices.create(
      {
        index: "users",
        body: {
          mappings: {
            properties: {
              nickname: {
                type: "text",
                analyzer: "standard",
              },
              email: { type: "keyword" },
              bio: { type: "text" },
              sex: { type: "keyword" },
              birthdate: { type: "date" },
            },
          },
        },
      },
      { ignore: [400] }
    );

    function mutateNickname(name: string): string {
      const arr = name.split("");
      const index = Math.floor(Math.random() * arr.length);
      arr[index] = faker.string.alpha(1);
      return arr.join("");
    }

    for (let i = 0; i < mockUsersCount; i++) {
      if (i % 10 === 0) {
        var baseNickname = faker.internet.userName();
      }

      const nickname = mutateNickname(baseNickname);
      const uniqueEmail = `user${i}_${faker.internet.email()}`;

      mockUsers.push({
        email: uniqueEmail,
        nickname,
        bio: faker.lorem.sentence(),
        sex: faker.helpers.arrayElement([Sex.Female, Sex.Male]),
        birthdate: faker.date.birthdate({ min: 18, max: 65, mode: "age" }),
      });
    }

    for (const user of mockUsers) {
      const created = await this.userService.create(user).toPromise();
      await this.elasticsearchService.index({
        index: "users",
        id: created.uuid,
        document: created,
      });
    }

    return { count: mockUsers.length };
  }
}
