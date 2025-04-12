import { Component, OnInit } from '@angular/core';
import { ThemeService } from '../../service/theme.service';

@Component({
  selector: 'app-theme-switcher',
  templateUrl: './theme-switcher.component.html',
  styleUrls: ['./theme-switcher.component.css'],
  standalone: true,
})
export class ThemeSwitcherComponent implements OnInit {
  isDarkTheme = false;

  constructor(private themeService: ThemeService) {}

  ngOnInit(): void {
    this.isDarkTheme = this.themeService.getCurrentTheme() === 'dark';
  }

  onToggleTheme(event: Event): void {
    this.themeService.toggleTheme();
    this.isDarkTheme = (event.target as HTMLInputElement).checked;
  }
}
