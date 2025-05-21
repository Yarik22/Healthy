import { Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';
import { ErrorComponent } from './pages/error/error.component';
import { ProfileComponent } from './pages/profile/profile.component';
import { authGuard } from './guard/auth.guard';
import { TherapyComponent } from './pages/therapy/therapy.component';
import { TherapyListComponent } from './pages/therapyList/therapies.component';
import { TestListComponent } from './pages/testList/tests.component';
import { TestComponent } from './pages/test/test.component';
import { unsavedTestGuard } from './guard/unsaved-test.guard';
import { PrivacyComponent } from './pages/privacy/privacy.component';
import { TestCreateComponent } from './pages/test-create/test-create.component';
import { roleGuard } from './guard/role.guard';
import { FindUserComponent } from './pages/find-user/find-user.component';
import { UserStatsComponent } from './pages/user-stats/user-stats.component';

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

  {
    path: 'user',
    children: [
      {
        path: 'find',
        component: FindUserComponent,
        canActivate: [roleGuard(['admin', 'moderator'])],
      },
      {
        path: ':userId/stats',
        component: UserStatsComponent,
        canActivate: [roleGuard(['admin', 'moderator'])],
      },
    ],
  },

  {
    path: 'tests',
    children: [
      { path: '', component: TestListComponent, canActivate: [authGuard] },
      {
        path: 'create',
        component: TestCreateComponent,
        canActivate: [roleGuard(['admin', 'moderator'])],
      },
      {
        path: ':id',
        component: TestComponent,
        canActivate: [authGuard],
        canDeactivate: [unsavedTestGuard],
      },
    ],
  },
  {
    path: 'privacy',
    component: PrivacyComponent,
  },
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
