import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';

export const authGuard: CanActivateFn = () => {
  const cookieService = inject(CookieService);
  const router = inject(Router);

  const isAuthenticated = cookieService.check('connect.sid');
  console.log(cookieService.get('connect.sid'));
  if (isAuthenticated) {
    return true;
  } else {
    router.navigate(['/not-authorized']);
    return false;
  }
};
