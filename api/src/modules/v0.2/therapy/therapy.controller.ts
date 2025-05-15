import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  UseInterceptors,
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
import {
  catchError,
  from,
  map,
  Observable,
  of,
  switchMap,
  throwError,
} from "rxjs";
import { Therapy } from "src/database/entities/therapy.entity";
import { DeleteResult, UpdateResult } from "typeorm";
import { RolesGuard } from "../guard/role.guard";
import { RoleName } from "../../../../shared/enums/user.enum";
import { Roles } from "../decorator/role.decorator";
import { CacheInterceptor, CacheKey, CacheTTL } from "@nestjs/cache-manager";

@UseInterceptors(CacheInterceptor)
@Controller({ path: "therapies", version: ApiVersion.Version02 })
@UseGuards(RolesGuard)
@ApiHeader({
  name: "Version",
  enum: Object.values(ApiVersion),
  required: true,
  description: "API version header",
})
export class TherapyController {
  constructor(private readonly therapyService: TherapyService) {}

  // @Roles(RoleName.Admin)
  // @Post()
  // @ApiOperation({ summary: "Create a new therapy" })
  // @ApiResponse({
  //   status: 201,
  //   description: "The therapy has been successfully created.",
  //   type: Therapy,
  // })
  // handleCreate(@Body() therapy: CreateTherapyDto): Observable<Therapy> {
  //   return this.therapyService.create(therapy);
  // }

  @Roles(RoleName.User, RoleName.Moderator, RoleName.Admin)
  @Get(":identifier")
  @ApiOperation({ summary: "Get a therapy by ID or name" })
  @ApiParam({
    name: "identifier",
    description: "The UUID or name of the therapy",
  })
  @ApiResponse({
    status: 200,
    description: "The therapy was successfully found.",
    type: Therapy,
  })
  @ApiResponse({
    status: 404,
    description: "Therapy not found",
  })
  handleFindOne(@Param("identifier") identifier: string): Observable<Therapy> {
    const isUUID =
      /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(
        identifier
      );
    if (isUUID) {
      return this.therapyService.findByIdCached(identifier).pipe(
        catchError((err) => {
          if (err.message === "NotFound") {
            return throwError(() => ({
              status: 404,
              message: "Therapy not found",
            }));
          }
          console.error("DB/cache error:", err);
          return throwError(() => ({
            status: 500,
            message: "Internal server error",
          }));
        })
      );
    } else {
      return this.therapyService.findByTitleCached(identifier).pipe(
        catchError((err) => {
          if (err.message === "NotFound") {
            return throwError(() => ({
              status: 404,
              message: "Therapy not found",
            }));
          }
          console.error("DB/cache error:", err);
          return throwError(() => ({
            status: 500,
            message: "Internal server error",
          }));
        })
      );
    }
  }

  // @Roles(RoleName.Admin)
  @CacheKey("qwe")
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

  // @Roles(RoleName.Admin)
  // @Patch(":id")
  // @ApiOperation({ summary: "Update therapy information by ID" })
  // @ApiParam({ name: "id", description: "The unique identifier of the therapy" })
  // @ApiResponse({
  //   status: 200,
  //   description: "Therapy updated successfully.",
  //   type: UpdateResult,
  // })
  // @ApiResponse({
  //   status: 404,
  //   description: "Therapy not found",
  // })
  // handleUpdate(
  //   @Param("id") id: string,
  //   @Body() therapy: UpdateTherapyDto
  // ): Observable<UpdateResult> {
  //   return this.therapyService.update(id, therapy);
  // }

  // @Roles(RoleName.Admin)
  // @Delete(":id")
  // @ApiOperation({ summary: "Delete a therapy by ID" })
  // @ApiParam({ name: "id", description: "The unique identifier of the therapy" })
  // @ApiResponse({
  //   status: 200,
  //   description: "The therapy has been successfully deleted.",
  //   type: DeleteResult,
  // })
  // @ApiResponse({
  //   status: 404,
  //   description: "Therapy not found",
  // })
  // handleDelete(@Param("id") id: string): Observable<DeleteResult> {
  //   return this.therapyService.delete(id);
  // }
}
