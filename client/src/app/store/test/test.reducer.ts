import { createReducer, on } from '@ngrx/store';
import * as TestActions from './test.actions';
import { Test } from '../../../../types/TestType';

export interface TestState {
  test: Test | null;
  loading: boolean;
  error: any;
  currentQuestionIndex: number;
  answers: { [questionId: string]: string }; // questionId -> answerId
}

export const initialState: TestState = {
  test: null,
  loading: false,
  error: null,
  currentQuestionIndex: 0,
  answers: {},
};

export const testReducer = createReducer(
  initialState,
  on(TestActions.loadTest, (state) => ({
    ...state,
    loading: true,
    error: null,
  })),
  on(TestActions.loadTestSuccess, (state, { test, savedProgress }) => ({
    ...state,
    loading: false,
    test,
    currentQuestionIndex: savedProgress?.currentQuestionIndex ?? 0,
    answers: savedProgress?.answers ?? {},
  })),

  on(TestActions.loadTestFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error,
  })),
  on(TestActions.selectAnswer, (state, { questionId, answerId }) => ({
    ...state,
    answers: {
      ...state.answers,
      [questionId]: answerId,
    },
  })),
  on(TestActions.goToNextQuestion, (state) => ({
    ...state,
    currentQuestionIndex: state.currentQuestionIndex + 1,
  })),
  on(
    TestActions.restoreProgress,
    (state, { currentQuestionIndex, answers }) => ({
      ...state,
      currentQuestionIndex,
      answers,
    })
  ),
  on(TestActions.goToPreviousQuestion, (state) => ({
  ...state,
  currentQuestionIndex: Math.max(0, state.currentQuestionIndex - 1),
})),
);
