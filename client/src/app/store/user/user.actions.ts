import { createAction, props } from '@ngrx/store';
import { User } from '../../../../types/UserType';

export const loadUser = createAction('[User] Load Me');

export const loadUserSuccess = createAction(
  '[User] Load Me Success',
  props<{ user: User }>()
);

export const loadUserFailure = createAction(
  '[User] Load Me Failure',
  props<{ error: any }>()
);

export const updateUser = createAction(
  '[User] Update User',
  props<{ updatedUser: Partial<User> }>()
);

export const updateUserSuccess = createAction(
  '[User] Update User Success',
  props<{ user: User }>()
);

export const updateUserFailure = createAction(
  '[User] Update User Failure',
  props<{ error: any }>()
);
