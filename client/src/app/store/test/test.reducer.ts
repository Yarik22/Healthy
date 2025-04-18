// import { createReducer, on } from '@ngrx/store';
// import { Test } from '../../../../types/TestType';
// import * as TestActions from './test.actions';

// export interface TestState {
//   tests: Test[];
//   currentTest: Test | null;
//   loading: boolean;
//   error: string | null;
//   currentQuestionIndex: number;
//   selectedAnswers: { [questionId: string]: string };
// }

// export const initialTestState: TestState = {
//   tests: [],
//   currentTest: null,
//   loading: false,
//   error: null,
//   currentQuestionIndex: 0,
//   selectedAnswers: {},
// };

// export const testReducer = createReducer(
//   initialTestState,
//   on(TestActions.loadTests, (state) => ({
//     ...state,
//     loading: true,
//     error: null,
//   })),
//   on(TestActions.loadTestsSuccess, (state, { tests }) => ({
//     ...state,
//     tests,
//     loading: false,
//   })),
//   on(TestActions.loadTestsFailure, (state, { error }) => ({
//     ...state,
//     error,
//     loading: false,
//   })),
//   on(TestActions.loadTest, (state) => ({
//     ...state,
//     loading: true,
//     error: null,
//     currentQuestionIndex: 0,
//     selectedAnswers: {},
//   })),
//   on(TestActions.loadTestSuccess, (state, { test }) => ({
//     ...state,
//     currentTest: test,
//     loading: false,
//   })),
//   on(TestActions.loadTestFailure, (state, { error }) => ({
//     ...state,
//     error,
//     loading: false,
//   })),
//   on(TestActions.setCurrentQuestion, (state, { index }) => ({
//     ...state,
//     currentQuestionIndex: index,
//   })),
//   on(TestActions.submitTestAnswers, (state, { answers }) => ({
//     ...state,
//     selectedAnswers: { ...state.selectedAnswers, ...answers },
//     loading: true,
//   })),
//   on(TestActions.submitTestAnswersSuccess, (state) => ({
//     ...state,
//     loading: false,
//     currentQuestionIndex: 0,
//     selectedAnswers: {},
//   })),
//   on(TestActions.submitTestAnswersFailure, (state, { error }) => ({
//     ...state,
//     error,
//     loading: false,
//   }))
// );
