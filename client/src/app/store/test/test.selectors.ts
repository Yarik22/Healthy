import { createFeatureSelector, createSelector } from '@ngrx/store';
import { TestState } from './test.reducer';

export const selectTestState = createFeatureSelector<TestState>('test');

export const selectTest = createSelector(
  selectTestState,
  (state) => state.test
);

export const selectCurrentQuestion = createSelector(
  selectTestState,
  (state) => state.test?.questions?.[state.currentQuestionIndex] ?? null
);

export const selectCurrentQuestionIndex = createSelector(
  selectTestState,
  (state) => state.currentQuestionIndex
);

export const selectTotalQuestions = createSelector(
  selectTest,
  (test) => test?.questions?.length ?? 0
);

export const selectIsFinished = createSelector(selectTestState, (state) =>
  state.test ? state.currentQuestionIndex >= state.test.questions.length : false
);

export const selectAnswers = createSelector(
  selectTestState,
  (state) => state.answers
);
