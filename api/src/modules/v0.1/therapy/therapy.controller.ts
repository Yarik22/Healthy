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
import { TherapyService } from "./therapy.service";
import { CreateTherapyDto } from "./dto/create-therapy.dto";
import { UpdateTherapyDto } from "./dto/update-therapy.dto";
import {
  ApiHeader,
  ApiOperation,
  ApiResponse,
  ApiParam,
} from "@nestjs/swagger";
import { ApiVersion } from "src/modules/versions";
import { Observable } from "rxjs";
import { Therapy } from "src/database/entities/therapy.entity";
import { DeleteResult, UpdateResult } from "typeorm";
import { RolesGuard } from "../guard/role.guard";
import { RoleName } from "../../../../../shared/enums/user.enum";
import { Roles } from "../decorator/role.decorator";

@Controller({ path: "therapies", version: ApiVersion.Version01 })
@UseGuards(RolesGuard)
@ApiHeader({
  name: "Version",
  enum: Object.values(ApiVersion),
  required: true,
  description: "API version header",
})
export class TherapyController {
  constructor(private readonly therapyService: TherapyService) {}

  @Roles(RoleName.Admin)
  @Post()
  @ApiOperation({ summary: "Create a new therapy" })
  @ApiResponse({
    status: 201,
    description: "The therapy has been successfully created.",
    type: Therapy,
  })
  handleCreate(@Body() therapy: CreateTherapyDto): Observable<Therapy> {
    return this.therapyService.create(therapy);
  }

  @Roles(RoleName.User, RoleName.Moderator, RoleName.Admin)
  @Get(":id")
  @ApiOperation({ summary: "Get a therapy by ID" })
  @ApiParam({ name: "id", description: "The unique identifier of the therapy" })
  @ApiResponse({
    status: 200,
    description: "The therapy was successfully found.",
    type: Therapy,
  })
  @ApiResponse({
    status: 404,
    description: "Therapy not found",
  })
  handleFindOne(@Param("id") id: string): Observable<Therapy> {
    return this.therapyService.findById(id);
  }

  @Roles(RoleName.Admin)
  @Get()
  @ApiOperation({ summary: "Get a list of all therapies" })
  @ApiResponse({
    status: 200,
    description: "List of therapies retrieved successfully.",
    type: [Therapy],
  })
  handleFindAll(): Observable<Therapy[]> {
    return this.therapyService.findAll();
  }

  @Roles(RoleName.Admin)
  @Patch(":id")
  @ApiOperation({ summary: "Update therapy information by ID" })
  @ApiParam({ name: "id", description: "The unique identifier of the therapy" })
  @ApiResponse({
    status: 200,
    description: "Therapy updated successfully.",
    type: UpdateResult,
  })
  @ApiResponse({
    status: 404,
    description: "Therapy not found",
  })
  handleUpdate(
    @Param("id") id: string,
    @Body() therapy: UpdateTherapyDto
  ): Observable<UpdateResult> {
    return this.therapyService.update(id, therapy);
  }

  @Roles(RoleName.Admin)
  @Delete(":id")
  @ApiOperation({ summary: "Delete a therapy by ID" })
  @ApiParam({ name: "id", description: "The unique identifier of the therapy" })
  @ApiResponse({
    status: 200,
    description: "The therapy has been successfully deleted.",
    type: DeleteResult,
  })
  @ApiResponse({
    status: 404,
    description: "Therapy not found",
  })
  handleDelete(@Param("id") id: string): Observable<DeleteResult> {
    return this.therapyService.delete(id);
  }
}
