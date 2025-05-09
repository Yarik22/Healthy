import { createFeatureSelector, createSelector } from '@ngrx/store';
import { TestState } from './test.reducer';

export const selectTestState = createFeatureSelector<TestState>('test');

export const selectCurrentQuestion = createSelector(
  selectTestState,
  (state) => state.test?.questions?.[state.currentQuestionIndex] ?? null
);

export const selectIsFinished = createSelector(selectTestState, (state) =>
  state.test ? state.currentQuestionIndex >= state.test.questions.length : false
);
