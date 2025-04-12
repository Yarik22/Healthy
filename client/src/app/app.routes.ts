import { Routes } from '@angular/router';
import { authGuard } from './guard/auth.guard';
import { HomeComponent } from './pages/home/home.component';
import { NotAuthorizedComponent } from './pages/not-authorized/not-authorized.component';
import { ForbiddenComponent } from './pages/forbidden/forbidden.component';

export const routes: Routes = [
  { path: 'home', component: HomeComponent },
  { path: 'not-authorized', component: NotAuthorizedComponent },
  { path: 'forbidden', component: ForbiddenComponent },
  { path: '**', redirectTo: 'home' },
];
