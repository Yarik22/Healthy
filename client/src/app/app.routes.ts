import { Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';
import { ErrorComponent } from './pages/error/error.component';
import { ProfileComponent } from './pages/profile/profile.component';
import { authGuard } from './guard/auth.guard';
import { TherapiesComponent } from './pages/therapies/therapies.component';

export const routes: Routes = [
  {
    path: 'therapies',
    component: TherapiesComponent,
    canActivate: [authGuard],
  },
  { path: 'home', component: HomeComponent },
  { path: 'me', component: ProfileComponent, canActivate: [authGuard] },
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
