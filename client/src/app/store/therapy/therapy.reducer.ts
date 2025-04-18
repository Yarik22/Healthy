import { createReducer, on } from '@ngrx/store';
import { loadTherapyByName, loadTherapyByNameSuccess, loadTherapyByNameFailure } from './therapy.actions';
import { Therapy } from '../../../../types/TherapyType';

export interface TherapyState {
  therapy: Therapy | null;
  loading: boolean;
  error: string | null;
}

export const initialTherapyState: TherapyState = {
  therapy: null,
  loading: false,
  error: null
};

export const therapyReducer = createReducer(
  initialTherapyState,
  on(loadTherapyByName, (state) => ({
    ...state,
    loading: true,
    error: null
  })),
  on(loadTherapyByNameSuccess, (state, { therapy }) => ({
    ...state,
    therapy,
    loading: false
  })),
  on(loadTherapyByNameFailure, (state, { error }) => ({
    ...state,
    error,
    loading: false
  }))
);