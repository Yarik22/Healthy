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
  on(TestActions.loadTestSuccess, (state, { test }) => ({
    ...state,
    loading: false,
    test,
    currentQuestionIndex: 0,
    answers: {},
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
  }))
);
