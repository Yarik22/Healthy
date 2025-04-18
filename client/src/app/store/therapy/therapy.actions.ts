import { createAction, props } from '@ngrx/store';
import { Therapy } from '../../../../types/TherapyType';

export const loadTherapyByName = createAction(
  '[Therapy] Load Therapy By Name',
  props<{ name: string }>()
);

export const loadTherapyByNameSuccess = createAction(
  '[Therapy] Load Therapy By Name Success',
  props<{ therapy: Therapy }>()
);

export const loadTherapyByNameFailure = createAction(
  '[Therapy] Load Therapy By Name Failure',
  props<{ error: string }>()
);
