import { inject } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { switchMap, map, catchError, of } from 'rxjs';
import { TherapyService } from '../../service/therapy.service';
import {
  loadTherapyByName,
  loadTherapyByNameSuccess,
  loadTherapyByNameFailure,
} from './therapy.actions';

export const loadTherapyByNameEffect = createEffect(
  () => {
    const actions$ = inject(Actions);
    const therapyService = inject(TherapyService);

    return actions$.pipe(
      ofType(loadTherapyByName),
      switchMap(({ name }) =>
        therapyService.getTherapyByName(name).pipe(
          map((therapy) => loadTherapyByNameSuccess({ therapy })),
          catchError((error) =>
            of(
              loadTherapyByNameFailure({
                error: error?.message || 'Failed to load therapy',
              })
            )
          )
        )
      )
    );
  },
  { functional: true }
);

export const TherapyEffects = {
  loadTherapyByNameEffect,
};
