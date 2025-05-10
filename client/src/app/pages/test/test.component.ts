import { Component, OnInit, inject } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { Observable, take } from 'rxjs';
import { Question } from '../../../../types/QuestionType';
import { CommonModule } from '@angular/common';
import * as TestSelectors from '../../store/test/test.selectors';
import * as TestActions from '../../store/test/test.actions';
import { QuestionService, SubmitResult } from '../../service/question.service';

@Component({
  selector: 'app-test',
  templateUrl: './test.component.html',
  styleUrls: ['./test.component.css'],
  imports: [CommonModule],
  standalone: true,
})
export class TestComponent implements OnInit {
  private store = inject(Store);
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private questionService = inject(QuestionService);

  currentQuestion$: Observable<Question | null>;
  isFinished$: Observable<boolean>;
  currentQuestionIndex$: Observable<number>;
  totalQuestions$: Observable<number>;
  testId: string | null = null;

  constructor() {
    this.currentQuestion$ = this.store.select(
      TestSelectors.selectCurrentQuestion
    );
    this.isFinished$ = this.store.select(TestSelectors.selectIsFinished);
    this.currentQuestionIndex$ = this.store.select(
      TestSelectors.selectCurrentQuestionIndex
    );
    this.totalQuestions$ = this.store.select(
      TestSelectors.selectTotalQuestions
    );
  }

  ngOnInit(): void {
    this.testId = this.route.snapshot.paramMap.get('id');
    if (!this.testId) return;

    const savedState = localStorage.getItem(`test-progress-${this.testId}`);
    const savedProgress = savedState ? JSON.parse(savedState) : undefined;

    this.store.dispatch(
      TestActions.loadTest({ id: this.testId, savedProgress })
    );
  }

  selectAnswer(questionId: string, answerId: string): void {
    this.store.dispatch(TestActions.selectAnswer({ questionId, answerId }));
    this.store.dispatch(TestActions.goToNextQuestion());
    this.saveProgress();
  }

  goToPreviousQuestion(): void {
    this.store.dispatch(TestActions.goToPreviousQuestion());
    this.saveProgress();
  }

  saveProgress(): void {
    this.store
      .select(TestSelectors.selectTestState)
      .pipe(take(1))
      .subscribe((state) => {
        if (this.testId && state.test) {
          localStorage.setItem(
            `test-progress-${this.testId}`,
            JSON.stringify({
              currentQuestionIndex: state.currentQuestionIndex,
              answers: state.answers,
            })
          );
        }
      });
  }

  submitTest(): void {
    if (!this.testId) return;

    const savedState = localStorage.getItem(`test-progress-${this.testId}`);
    if (!savedState) {
      console.warn('No saved answers to submit.');
      this.router.navigate(['/tests']);
      return;
    }

    const parsed = JSON.parse(savedState);
    const answers: { [questionId: string]: string } = parsed.answers;

    const results: SubmitResult[] = Object.keys(answers).map(
      (question_uuid) => ({
        question_uuid,
        answer_uuid: answers[question_uuid],
      })
    );

    this.questionService.submitResults(results, this.testId).subscribe({
      next: () => {
        console.log('Results submitted successfully');
        localStorage.removeItem(`test-progress-${this.testId}`);
        this.router.navigate(['/tests']);
      },
      error: (err) => {
        console.error('Error submitting results:', err);
      },
    });
  }

  cancelTest(): void {
    if (this.testId) {
      localStorage.removeItem(`test-progress-${this.testId}`);
    }
    this.router.navigate(['/tests']);
  }
}
