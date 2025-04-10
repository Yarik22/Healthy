import { Injectable } from '@angular/core';
import {
  HttpInterceptor,
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpErrorResponse,
} from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { Router } from '@angular/router';
import { catchError, tap } from 'rxjs/operators';

@Injectable()
export class WithCredentialsInterceptor implements HttpInterceptor {
  constructor(private router: Router) {}

  intercept(
    req: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    const clonedRequest = req.clone({
      withCredentials: true,
    });

    return next.handle(clonedRequest).pipe(
      tap((event) => {
      }),
      catchError((error: HttpErrorResponse) => {
        if (error.status === 403) {
          this.router.navigate(['/forbidden']);
        }
        return throwError(error);
      })
    );
  }
}
