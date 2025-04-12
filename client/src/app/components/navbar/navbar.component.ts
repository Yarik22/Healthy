import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { LanguageSwitcherComponent } from '../language-switcher/language-switcher.component';
import { ThemeSwitcherComponent } from '../theme-switcher/theme-switcher.component';
import { environment } from '../../../../environments/environment';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css'],
  imports: [
    CommonModule,
    LanguageSwitcherComponent,
    ThemeSwitcherComponent,
    TranslateModule,
  ],
})
export class NavbarComponent {
  isMenuOpen = false;
  loginUrl: string;

  toggleMenu() {
    this.isMenuOpen = !this.isMenuOpen;
  }

  constructor() {
    this.loginUrl = `http://localhost:${environment.API_PORT}/${environment.API_PREFIX}/auth/google/login`;
  }

  login() {
    window.location.href = this.loginUrl;
  }
}
