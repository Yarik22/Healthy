import { inject } from '@angular/core';
import { Actions, createEffect } from '@ngrx/effects';
import { ofType } from '@ngrx/effects';
import { of } from 'rxjs';
import { catchError, map, switchMap } from 'rxjs/operators';
import { loadUsers, loadUsersSuccess, loadUsersFailure } from './users.actions';
import { UserService } from '../../service/user.service';

export const usersEffects = createEffect(
  () => {
    const actions$ = inject(Actions);
    const userService = inject(UserService);

    return actions$.pipe(
      ofType(loadUsers),
      switchMap(() =>
        userService.getUsers().pipe(
          map((users) => loadUsersSuccess({ users })),
          catchError((error) => of(loadUsersFailure({ error: error.message })))
        )
      )
    );
  },
  { functional: true }
);
