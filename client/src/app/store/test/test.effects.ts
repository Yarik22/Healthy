import { inject } from '@angular/core';
import { createEffect } from '@ngrx/effects';
import { Actions, ofType } from '@ngrx/effects';
import * as TestActions from './test.actions';
import { catchError, map, switchMap, of } from 'rxjs';
import { TestService } from '../../service/test.service';

export const loadTestsEffect = createEffect(
  (actions$ = inject(Actions)) => {
    const testService = inject(TestService);

    return actions$.pipe(
      ofType(TestActions.loadTest),
      switchMap(({ id }) =>
        testService.getTestById(id).pipe(
          map((test) => TestActions.loadTestSuccess({ test })),
          catchError((error) => of(TestActions.loadTestFailure({ error })))
        )
      )
    );
  },
  { functional: true }
);

export const TestEffects = {
  loadTestsEffect,
};
