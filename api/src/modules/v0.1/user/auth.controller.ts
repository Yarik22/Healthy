import { Controller, Get, Req, Res, UseGuards } from "@nestjs/common";
import { UserService } from "./user.service";
import { ApiHeader } from "@nestjs/swagger";
import { ApiVersion } from "src/modules/versions";
import { GoogleAuthGuard } from "../guard/google.guard";
import { Request, Response } from "express";

@Controller({ path: "auth", version: ApiVersion.Version01 })
@ApiHeader({
  name: "Version",
  enum: Object.values(ApiVersion),
  required: true,
  description: "API version header",
})
export class AuthController {
  constructor(private readonly userService: UserService) {}
  @Get("google/login")
  @UseGuards(GoogleAuthGuard)
  handleLogin() {
    return { message: "OK1" };
  }

  @Get("google/redirect")
  @UseGuards(GoogleAuthGuard)
  handleRedirect() {
    return { message: "OK2" };
  }

  @Get("/status")
  handleStatus(@Req() req: Request) {
    if (req.user) {
      return { msg: "Auth" };
    }
    return { msg: "Not Auth" };
  }
}
