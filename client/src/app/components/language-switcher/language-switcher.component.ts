import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-language-switcher',
  standalone: true,
  templateUrl: './language-switcher.component.html',
  styleUrls: ['./language-switcher.component.css'],
  imports: [CommonModule],
})
export class LanguageSwitcherComponent {
  availableLanguages = ['en', 'uk'];
  currentLang: string;

  constructor(private translate: TranslateService) {
    this.currentLang = translate.currentLang || translate.getDefaultLang();
  }

  switchLanguage(lang: string) {
    localStorage.setItem('lang', lang);
    this.translate.use(lang);
    this.currentLang = lang;
  }
}
