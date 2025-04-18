// import { createFeatureSelector, createSelector } from '@ngrx/store';
// import { TestState } from './test.reducer';

// export const selectTestState = createFeatureSelector<TestState>('test');

// export const selectCurrentTest = createSelector(
//   selectTestState,
//   (state: TestState) => state.currentTest
// );

// export const selectLoading = createSelector(
//   selectTestState,
//   (state: TestState) => state.loading
// );

// export const selectError = createSelector(
//   selectTestState,
//   (state: TestState) => state.error
// );

// export const selectCurrentQuestionIndex = createSelector(
//   selectTestState,
//   (state: TestState) => state.currentQuestionIndex
// );

// export const selectSelectedAnswers = createSelector(
//   selectTestState,
//   (state: TestState) => state.selectedAnswers
// );

// export const selectTestProgress = createSelector(
//   selectCurrentTest,
//   selectSelectedAnswers,
//   (test, answers) => {
//     if (!test?.questions?.length) return 0;
//     const answered = test.questions.filter((q) => answers[q.uuid]).length;
//     return (answered / test.questions.length) * 100;
//   }
// );
