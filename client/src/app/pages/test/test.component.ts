// import { Component, OnInit } from '@angular/core';
// import { ActivatedRoute } from '@angular/router';
// import { Store } from '@ngrx/store';
// import { Observable } from 'rxjs';
// import { CommonModule } from '@angular/common';
// import { LoaderComponent } from '../../components/loader/loader.component';
// import { Question } from '../../../../types/QuestionType';
// import { Test } from '../../../../types/TestType';
// import { selectLoading, selectError } from '../../store/therapy/therapy.selectors';
// import { selectCurrentTest, selectTestProgress } from '../../store/test/test.selector';
// import { loadTest, submitTestAnswers } from '../../store/test/test.actions';

// @Component({
//   selector: 'app-test',
//   standalone: true,
//   templateUrl: './test.component.html',
//   styleUrls: ['./test.component.css'],
//   imports: [CommonModule, LoaderComponent],
// })
// export class TestComponent implements OnInit {
//   test$: Observable<Test | null>;
//   loading$: Observable<boolean>;
//   error$: Observable<string | null>;
//   progress$: Observable<number>;
//   currentQuestionIndex = 0;
//   selectedAnswers: { [questionId: string]: string } = {};

//   constructor(private route: ActivatedRoute, private store: Store) {
//     this.test$ = this.store.select(selectCurrentTest);
//     this.loading$ = this.store.select(selectLoading);
//     this.error$ = this.store.select(selectError);
//     this.progress$ = this.store.select(selectTestProgress);
//   }

//   ngOnInit(): void {
//     this.route.paramMap.subscribe((params) => {
//       const testId = params.get('id');
//       if (testId) {
//         this.store.dispatch(loadTest({ testId }));
//       }
//     });
//   }

//   selectAnswer(questionId: string, answerId: string): void {
//     this.selectedAnswers[questionId] = answerId;
//   }

//   nextQuestion(): void {
//     this.currentQuestionIndex++;
//   }

//   prevQuestion(): void {
//     this.currentQuestionIndex--;
//   }

//   submitTest(): void {
//     this.store.dispatch(submitTestAnswers({ answers: this.selectedAnswers }));
//   }

//   getCurrentQuestion(questions: Question[] | undefined): Question | null {
//     return questions?.[this.currentQuestionIndex] || null;
//   }

//   isLastQuestion(questions: Question[] | undefined): boolean {
//     return questions
//       ? this.currentQuestionIndex === questions.length - 1
//       : false;
//   }

//   isTestComplete(questions: Question[] | undefined): boolean {
//     if (!questions) return false;
//     return questions.every((q) => this.selectedAnswers[q.uuid]);
//   }
// }
