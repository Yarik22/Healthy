import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from "@nestjs/common";
import { UserService } from "./user.service";
import { CreateUserDto } from "./dto/create-user.dto";
import { UpdateUserDto } from "./dto/update-user.dto";
import { ApiHeader } from "@nestjs/swagger";
import { ApiVersion } from "src/modules/versions";

@Controller({ path: "user", version: ApiVersion.Version01 })
@ApiHeader({
  name: "Version",
  enum: Object.values(ApiVersion),
  required: true,
  description: "API version header",
})
export class UserController {
  constructor(private readonly userService: UserService) {}
}
