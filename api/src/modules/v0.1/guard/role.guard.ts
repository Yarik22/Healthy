import {
  Injectable,
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  UnauthorizedException,
} from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { Observable, from } from "rxjs";
import { map, catchError, switchMap } from "rxjs/operators";
import { UserService } from "../user/user.service";
import { RoleName } from "../../../../shared/enums/user.enum";
import { User } from "src/database/entities/user.entity";

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(
    private readonly reflector: Reflector,
    private readonly userService: UserService
  ) {}

  canActivate(context: ExecutionContext): Observable<boolean> {
    const requiredRoles = this.reflector.get<RoleName[]>(
      "roles",
      context.getHandler()
    );

    if (!requiredRoles) {
      return from([true]);
    }

    const request = context.switchToHttp().getRequest();
    const userPromise = request.user as Promise<User>;
    if (!userPromise) {
      throw new UnauthorizedException("User is not authenticated");
    }
    return from(userPromise).pipe(
      switchMap((user) => {
        if (!user) {
          throw new UnauthorizedException("User is not authenticated");
        }

        const userUuid = user.uuid;
        if (!userUuid) {
          throw new UnauthorizedException("User does not have a valid UUID");
        }

        return from(this.userService.findById(userUuid, ["roles"])).pipe(
          map((dbUser) => {
            const userRoles = dbUser.roles.map((role) => role.name);
            const hasRole = requiredRoles.some((role) =>
              userRoles.includes(role)
            );

            if (!hasRole) {
              throw new ForbiddenException("User does not have required roles");
            }

            return true;
          }),
          catchError(() => {
            throw new ForbiddenException("Access denied");
          })
        );
      }),
      catchError((error) => {
        throw new ForbiddenException("Access denied");
      })
    );
  }
}
