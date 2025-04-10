import {
  Controller,
  Get,
  HttpStatus,
  Req,
  Res,
  UseGuards,
} from "@nestjs/common";
import { UserService } from "./user.service";
import { ApiHeader } from "@nestjs/swagger";
import { ApiVersion } from "src/modules/versions";
import { GoogleAuthGuard } from "../guard/google.guard";
import { Response } from "express";
import { ConfigService } from "@nestjs/config";

@Controller({ path: "auth", version: ApiVersion.Version01 })
@UseGuards(GoogleAuthGuard)
@ApiHeader({
  name: "Version",
  enum: Object.values(ApiVersion),
  required: true,
  description: "API version header",
})
export class AuthController {
  constructor(
    private readonly userService: UserService,
    private readonly configService: ConfigService
  ) {}
  @Get("google/login")
  handleLogin() {
    return HttpStatus.ACCEPTED;
  }

  @Get("google/redirect")
  handleRedirect(@Res() res: Response) {
    res.redirect(
      `http://localhost:${this.configService.get("CLIENT_PORT")}/home`
    );
  }
}
