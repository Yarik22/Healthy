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
import { CacheInterceptor, CacheTTL } from "@nestjs/cache-manager";

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
}
