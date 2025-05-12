import { SetMetadata } from "@nestjs/common";
import { RoleName } from "../../../../shared/enums/user.enum";

export const Roles = (...roles: RoleName[]) => SetMetadata("roles", roles);
