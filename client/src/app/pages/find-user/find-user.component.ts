import { Component } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import {
  debounceTime,
  distinctUntilChanged,
  switchMap,
  tap,
} from 'rxjs/operators';
import { Observable, of } from 'rxjs';
import { User } from '../../../../types/UserType';
import { UserService } from '../../service/user.service';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { Sex } from '../../../../shared/enums/user.enum';

@Component({
  selector: 'app-find-user',
  templateUrl: './find-user.component.html',
  styleUrls: ['./find-user.component.css'],
  imports: [ReactiveFormsModule, CommonModule],
})
export class FindUserComponent {
  searchControl = new FormControl('');
  users$: Observable<User[]> = of([]);
  isLoading = false;

  constructor(private userService: UserService, private router: Router) {
    this.users$ = this.searchControl.valueChanges.pipe(
      tap(() => (this.isLoading = true)),
      debounceTime(500),
      distinctUntilChanged(),
      switchMap((nickname) =>
        nickname!.trim() ? this.userService.searchUsers(nickname!) : of([])
      ),
      tap(() => (this.isLoading = false))
    );
  }

  navigateToUserStats(userId: string) {
    this.router.navigate(['/user', userId, 'stats']);
  }

  formatBirthdate(date: Date | string | null | undefined): string {
    if (!date) return 'Not specified';
    const d = new Date(date);
    return isNaN(d.getTime()) ? 'Invalid date' : d.toLocaleDateString();
  }

  getSexLabel(sex?: Sex | null): string {
    switch (sex) {
      case Sex.Male:
        return 'Чоловік';
      case Sex.Female:
        return 'Жінка';
      case Sex.Other:
        return 'Інша';
      default:
        return 'Не вказано';
    }
  }
}
