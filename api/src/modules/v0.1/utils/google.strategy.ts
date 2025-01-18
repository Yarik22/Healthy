import { Injectable } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { Profile, Strategy } from "passport-google-oauth20";
import { UserService } from "../user/user.service";

@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly userService: UserService) {
    super({
      clientID: process.env.CLIENT_ID,
      clientSecret: process.env.CLIENT_SECRET,
      callbackURL: process.env.CALLBACK_URL,
      scope: ["profile", "email"],
      passReqToCallback: null,
    });
  }
  async validate(_a: string, _r: string, profile: Profile) {
    const user = await this.userService.validateUser({
      email: profile.emails[0].value,
      nickname: profile.displayName,
    });
    return user || null;
  }
}
