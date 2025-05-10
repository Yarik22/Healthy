// guards/unsaved-test.guard.ts
import { inject } from '@angular/core';
import { Store } from '@ngrx/store';
import { selectIsFinished } from '../store/test/test.selectors';
import { map, take } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { CanDeactivateFn } from '@angular/router';
import { TestComponent } from '../pages/test/test.component';

export const unsavedTestGuard: CanDeactivateFn<TestComponent> = (
  component,
  currentRoute,
  currentState,
  nextState
): Observable<boolean> => {
  const store = inject(Store);

  return store.select(selectIsFinished).pipe(
    take(1),
    map((isFinished) => {
      return (
        isFinished ||
        confirm('Ви ще не завершили тест. Ви впевнені, що хочете вийти?')
      );
    })
  );
};
