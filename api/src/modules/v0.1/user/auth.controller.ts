import { Controller, Get, Req, Res, UseGuards } from "@nestjs/common";
import { UserService } from "./user.service";
import { ApiHeader } from "@nestjs/swagger";
import { ApiVersion } from "src/modules/versions";
import { GoogleAuthGuard } from "../guard/google.guard";
import { Request, Response } from "express";
import { RoleName } from "../../../../../shared/enums/user.enum";
import { Roles } from "../decorator/role.decorator";
import { RolesGuard } from "../guard/role.guard";

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
  handleRedirect(@Res() res: Response) {
    res.redirect("http://localhost:3000/api/auth/status")
  }
  @UseGuards(RolesGuard)
  @Roles(RoleName.User)
  @Get("/status")
  async handleStatus(@Req() req: Request) {
    if (req.user) {
      return { msg: "Auth" };
    }
    return { msg: "Not Auth" };
  }

}
