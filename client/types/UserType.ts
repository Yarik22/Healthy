import { BaseEntityType } from './BaseEntityType';
import { Conclusion } from './ConclusionType';
import { Result } from './ResultType';
import { Role } from './RoleType';
import { Sex } from '../../shared/enums/user.enum';

export type Img = {
  type: string;
  data: Buffer;
};

export type User = BaseEntityType & {
  email: string;
  nickname: string;
  birthdate?: Date | null;
  sex?: Sex | null;
  bio?: string | null;
  banned: boolean;
  img?: Img | null;
  roles: Role[];
  conclusions: Conclusion[];
  results: Result[];
};
