import { User } from '../../../../types/UserType';
import { BaseState } from '../models/base-state.model';

export type UsersState = BaseState<User[]>;

export const initialUsersState: UsersState = {
  data: [],
  loading: false,
  error: null,
};
