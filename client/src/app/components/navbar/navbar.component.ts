import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ThemeSwitcherComponent } from '../theme-switcher/theme-switcher.component';
import { RouterLink } from '@angular/router';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { User } from '../../../../types/UserType';
import { selectUser } from '../../store/user/user.selectors';
import { RoleName } from '../../../../shared/enums/user.enum';
import { loadUser } from '../../store/user/user.actions';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css'],
  imports: [CommonModule, RouterLink, ThemeSwitcherComponent],
})
export class NavbarComponent implements OnInit {
  isMenuOpen = false;
  user$: Observable<User | null>;
  readonly RoleName = RoleName;

  ngOnInit(): void {
    this.store.dispatch(loadUser());
  }

  constructor(private store: Store) {
    this.user$ = this.store.select(selectUser);
  }

  toggleMenu() {
    this.isMenuOpen = !this.isMenuOpen;
  }

  hasAdminOrModeratorRole(user: User | null): boolean {
    if (!user) return false;
    return user.roles.some(
      (role) => role.name === RoleName.Admin || role.name === RoleName.Moderator
    );
  }
}
