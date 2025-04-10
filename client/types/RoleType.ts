import { RoleName } from '../../shared/enums/user.enum';
import { BaseEntityType } from './BaseEntityType';
import { User } from './UserType';

export type Role = BaseEntityType & {
  name: RoleName;
  description?: string | null;
  users: User[];
};
