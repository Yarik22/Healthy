import { Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';
import { ErrorComponent } from './pages/error/error.component';
import { ProfileComponent } from './pages/profile/profile.component';
import { authGuard } from './guard/auth.guard';
import { TherapyListComponent } from './pages/therapyList/therapies.component';
import { TherapyComponent } from './pages/therapy/therapy.component';
// import { TestListComponent } from './pages/testList/tests.component';

export const routes: Routes = [
  { path: 'home', component: HomeComponent },
  { path: 'me', component: ProfileComponent, canActivate: [authGuard] },
  {
    path: 'therapies',
    children: [
      { path: '', component: TherapyListComponent },
      { path: ':name', component: TherapyComponent, canActivate: [authGuard] },
    ],
  },
  // { path: 'tests', component: TestListComponent, canActivate: [authGuard] },
  {
    path: 'error/:code/:title/:message/:icon/:buttonText/:buttonLink',
    component: ErrorComponent,
  },
  {
    path: 'error',
    component: ErrorComponent,
  },
  { path: '**', redirectTo: 'home' },
];
