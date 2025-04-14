import { Controller, Get, HttpStatus, Res, UseGuards } from "@nestjs/common";
import { UserService } from "./user.service";
import { ApiHeader } from "@nestjs/swagger";
import { ApiVersion } from "src/modules/versions";
import { GoogleAuthGuard } from "../guard/google.guard";
import { Response } from "express";
import { ConfigService } from "@nestjs/config";

@UseGuards(GoogleAuthGuard)
@Controller({ path: "auth", version: ApiVersion.Version01 })
@ApiHeader({
  name: "Version",
  enum: Object.values(ApiVersion),
  required: true,
  description: "API version header",
})
export class AuthController {
  constructor(private readonly configService: ConfigService) {}
  @Get("google/login")
  handleLogin(){
    HttpStatus.TEMPORARY_REDIRECT
  }
  @Get("google/redirect")
  handleRedirect(@Res() res: Response) {
    res.redirect(
      `http://localhost:${this.configService.get("CLIENT_PORT")}/home`
    );
  }
}
