import { Controller, Get, Req, Res, UseGuards } from "@nestjs/common";
import { UserService } from "./user.service";
import { ApiHeader } from "@nestjs/swagger";
import { ApiVersion } from "src/modules/versions";
import { GoogleAuthGuard } from "../guard/google.guard";
import { Response } from "express";

@Controller({ path: "auth", version: ApiVersion.Version01 })
@UseGuards(GoogleAuthGuard)
@ApiHeader({
  name: "Version",
  enum: Object.values(ApiVersion),
  required: true,
  description: "API version header",
})
export class AuthController {
  constructor(private readonly userService: UserService) {}
  @Get("google/login")
  handleLogin() {
    return { message: "OK1" };
  }

  @Get("google/redirect")
  handleRedirect(@Res() res: Response) {
    res.redirect("http://localhost:3000/api/user");
  }
}
