import { Component } from '@angular/core';
import { environment } from '../../../../environments/environment';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
})
export class LoginComponent {
  loginUrl: string;

  constructor() {
    this.loginUrl = `http://localhost:${environment.API_PORT}/${environment.API_PREFIX}/auth/google/login`;
  }

  login() {
    window.location.href = this.loginUrl;
  }
}
