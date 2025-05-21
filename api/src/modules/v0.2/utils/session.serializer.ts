import { PassportSerializer } from "@nestjs/passport";
import { UserService } from "../user/user.service";
import { User } from "src/database/entities/user.entity";
import { Injectable } from "@nestjs/common";
import { firstValueFrom } from "rxjs";

@Injectable()
export class SessionSerializer extends PassportSerializer {
  constructor(private readonly userService: UserService) {
    super();
  }
  serializeUser(user: User, done: Function) {
    done(null, user);
  }
  deserializeUser(payload: User, done: Function) {
    const user = firstValueFrom(
      this.userService.findById(payload.uuid, ["roles"])
    );
    return user ? done(null, user) : done(null, null);
  }
}
