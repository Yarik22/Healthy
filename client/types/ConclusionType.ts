import { MentalState } from '../shared/enums/therapy.enum';
import { BaseEntityType } from './BaseEntityType';
import { User } from './UserType';

export type Conclusion = BaseEntityType & {
  user: User;
  mentalState: MentalState;
  value: number;
};
