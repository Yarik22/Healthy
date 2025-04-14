import { inject } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { switchMap, map, catchError, of } from 'rxjs';
import { UserService } from '../../service/user.service';
import {
  loadUser,
  loadUserSuccess,
  loadUserFailure,
  updateUser,
  updateUserSuccess,
  updateUserFailure,
} from './user.actions';

export const loadUserEffect = createEffect(
  () => {
    const actions$ = inject(Actions);
    const userService = inject(UserService);

    return actions$.pipe(
      ofType(loadUser),
      switchMap(() =>
        userService.getMe().pipe(
          map((user) => loadUserSuccess({ user })),
          catchError((error) =>
            of(loadUserFailure({ error: error?.message || 'Unknown error' }))
          )
        )
      )
    );
  },
  { functional: true }
);

export const updateUserEffect = createEffect(
  () => {
    const actions$ = inject(Actions);
    const userService = inject(UserService);

    return actions$.pipe(
      ofType(updateUser),
      switchMap(({ updatedUser }) =>
        userService.updateMe(updatedUser).pipe(
          map((user) => updateUserSuccess({ user })),
          catchError((error) =>
            of(updateUserFailure({ error: error?.message || 'Unknown error' }))
          )
        )
      )
    );
  },
  { functional: true }
);

export const UserEffects = {
  loadUserEffect,
  updateUserEffect,
};
