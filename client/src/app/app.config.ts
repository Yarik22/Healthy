import {
  ApplicationConfig,
  provideZoneChangeDetection,
  isDevMode,
  importProvidersFrom,
} from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { provideStore } from '@ngrx/store';
import { provideEffects } from '@ngrx/effects';
import { provideStoreDevtools } from '@ngrx/store-devtools';
import {
  HTTP_INTERCEPTORS,
  HttpClient,
  provideHttpClient,
  withInterceptorsFromDi,
} from '@angular/common/http';
import { CredentialsInterceptor } from './middleware/cred.interceptor';
import { userReducer } from './store/user/user.reducer';
import { UserEffects } from './store/user/user.effects';
import { therapyReducer } from './store/therapy/therapy.reducer';
import { TherapyEffects } from './store/therapy/therapy.effects';
import { testReducer } from './store/test/test.reducer';
import { TestEffects } from './store/test/test.effects';

export const appConfig: ApplicationConfig = {
  providers: [
    provideHttpClient(withInterceptorsFromDi()),
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    provideStore({
      user: userReducer,
      therapy: therapyReducer,
      test: testReducer,
    }),
    provideEffects(UserEffects, TherapyEffects, TestEffects),
    provideStoreDevtools({ maxAge: 25, logOnly: !isDevMode() }),
    {
      provide: HTTP_INTERCEPTORS,
      useClass: CredentialsInterceptor,
      multi: true,
    },
  ],
};
