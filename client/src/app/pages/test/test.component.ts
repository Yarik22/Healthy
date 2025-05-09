import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { Question } from '../../../../types/QuestionType';
import { CommonModule } from '@angular/common';
import * as TestSelectors from '../../store/test/test.selectors';
import * as TestActions from '../../store/test/test.actions';

@Component({
  selector: 'app-test',
  templateUrl: './test.component.html',
  imports: [CommonModule],
})
export class TestComponent implements OnInit {
  currentQuestion$: Observable<Question | null>;
  isFinished$: Observable<boolean>;

  constructor(private route: ActivatedRoute, private store: Store) {
    this.currentQuestion$ = this.store.select(
      TestSelectors.selectCurrentQuestion
    );
    this.isFinished$ = this.store.select(TestSelectors.selectIsFinished);
  }

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.store.dispatch(TestActions.loadTest({ id }));
    }
  }

  selectAnswer(questionId: string, answerId: string): void {
    this.store.dispatch(TestActions.selectAnswer({ questionId, answerId }));
    this.store.dispatch(TestActions.goToNextQuestion());
  }
}
