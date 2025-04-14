import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { UserService } from '../service/user.service';
import { Store } from '@ngrx/store';
import { of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { environment } from '../../../environments/environment';
import { loadUserSuccess } from '../store/user/user.actions';

export const authGuard: CanActivateFn = () => {
  const userService = inject(UserService);
  const store = inject(Store);
  const router = inject(Router);

  const apiUrl = `http://localhost:${environment.API_PORT}/${environment.API_PREFIX}`;

  return userService.getMe().pipe(
    map((user) => {
      store.dispatch(loadUserSuccess({ user }));
      return true;
    }),
    catchError(() => {
      router.navigate([
        '/error',
        '401',
        'Unauthorized',
        'Please login to continue.',
        '🔒',
        'Login with Google',
        `${apiUrl}/auth/google/login`,
      ]);
      return of(false);
    })
  );
};
