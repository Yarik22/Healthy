// import { inject } from '@angular/core';
// import { Actions, createEffect, ofType } from '@ngrx/effects';
// import { catchError, map, of, switchMap } from 'rxjs';
// import * as TestActions from './test.actions';
// import { TestService } from '../../service/test.service';

// export const loadTestsEffect = createEffect(
//   () => {
//     const actions$ = inject(Actions);
//     const testService = inject(TestService);

//     return actions$.pipe(
//       ofType(TestActions.loadTests),
//       switchMap(({ page, limit }) =>
//         testService.getTests(page, limit).pipe(
//           map(({ tests, total }) =>
//             TestActions.loadTestsSuccess({ tests, total, page })
//           ),
//           catchError((error) =>
//             of(TestActions.loadTestsFailure({ error: error.message }))
//           )
//         )
//       )
//     );
//   },
//   { functional: true }
// );

// export const loadTestEffect = createEffect(
//   () => {
//     const actions$ = inject(Actions);
//     const testService = inject(TestService);

//     return actions$.pipe(
//       ofType(TestActions.loadTest),
//       switchMap(({ testId }) =>
//         testService.getTestById(testId).pipe(
//           map((test) => TestActions.loadTestSuccess({ test })),
//           catchError((error) =>
//             of(TestActions.loadTestFailure({ error: error.message }))
//           )
//         )
//       )
//     );
//   },
//   { functional: true }
// );

// export const submitTestAnswersEffect = createEffect(
//   () => {
//     const actions$ = inject(Actions);
//     const testService = inject(TestService);

//     return actions$.pipe(
//       ofType(TestActions.submitTestAnswers),
//       switchMap(({ answers }) =>
//         testService.submitAnswers(answers).pipe(
//           map(() => TestActions.submitTestAnswersSuccess()),
//           catchError((error) =>
//             of(TestActions.submitTestAnswersFailure({ error: error.message }))
//           )
//         )
//       )
//     );
//   },
//   { functional: true }
// );

// export const TestEffects = {
//   loadTestsEffect,
//   loadTestEffect,
//   submitTestAnswersEffect,
// };
