import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { environment } from '../../../../environments/environment';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-home',
  imports: [CommonModule, RouterLink],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
})
export class HomeComponent {
  apiUrl = `http://localhost:${environment.API_PORT}/${environment.API_PREFIX}`;

  onLoginClick() {
    window.location.href = `${this.apiUrl}/auth/google/login`;
  }
}
