import { createFeatureSelector, createSelector } from '@ngrx/store';
import { TherapyState } from './therapy.reducer';

export const selectTherapyState =
  createFeatureSelector<TherapyState>('therapy');

export const selectTherapy = createSelector(
  selectTherapyState,
  (state: TherapyState) => state.therapy
);

export const selectLoading = createSelector(
  selectTherapyState,
  (state: TherapyState) => state.loading
);

export const selectError = createSelector(
  selectTherapyState,
  (state: TherapyState) => state.error
);
