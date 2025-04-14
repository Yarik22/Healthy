import { createReducer, on } from '@ngrx/store';
import { User } from '../../../../types/UserType';
import {
  loadUser,
  loadUserSuccess,
  loadUserFailure,
  updateUser,
  updateUserSuccess,
  updateUserFailure,
} from './user.actions';

export interface UserState {
  user: User | null;
  loading: boolean;
  error: any;
}

export const initialState: UserState = {
  user: null,
  loading: false,
  error: null,
};

export const userReducer = createReducer(
  initialState,
  on(loadUser, (state) => ({ ...state, loading: true, error: null })),
  on(loadUserSuccess, (state, { user }) => ({
    ...state,
    user,
    loading: false,
  })),
  on(loadUserFailure, (state, { error }) => ({
    ...state,
    error,
    loading: false,
  })),

  on(updateUserSuccess, (state, { user }) => ({
    ...state,
    user,
  })),

  on(updateUserFailure, (state, { error }) => ({
    ...state,
    error,
  }))
);
