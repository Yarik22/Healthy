import { createAction, props } from '@ngrx/store';
import { Test } from '../../../../types/TestType';

export const loadTest = createAction(
  '[Test] Load Test',
  props<{
    id: string;
    savedProgress?: {
      currentQuestionIndex: number;
      answers: { [qId: string]: string };
    };
  }>()
);

export const loadTestSuccess = createAction(
  '[Test] Load Test Success',
  props<{
    test: Test;
    savedProgress?: {
      currentQuestionIndex: number;
      answers: { [qId: string]: string };
    };
  }>()
);

export const loadTestFailure = createAction(
  '[Test] Load Test Failure',
  props<{ error: any }>()
);

export const selectAnswer = createAction(
  '[Test] Select Answer',
  props<{ questionId: string; answerId: string }>()
);

export const restoreProgress = createAction(
  '[Test] Restore Progress',
  props<{
    currentQuestionIndex: number;
    answers: { [questionId: string]: string };
  }>()
);

export const goToPreviousQuestion = createAction('[Test] Previous Question');

export const goToNextQuestion = createAction('[Test] Next Question');
