import { Routes } from '@angular/router';
import { authGuard } from './guard/auth.guard';
import { HomeComponent } from './pages/home/home.component';
import { LoginComponent } from './pages/login/login.component';
import { NotAuthorizedComponent } from './pages/not-authorized/not-authorized.component';
import { ForbiddenComponent } from './pages/forbidden/forbidden.component';

export const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: 'home', component: HomeComponent, canActivate: [authGuard] },
  { path: 'not-authorized', component: NotAuthorizedComponent },
  { path: 'forbidden', component: ForbiddenComponent },
  { path: '**', redirectTo: 'login' },
  
];
