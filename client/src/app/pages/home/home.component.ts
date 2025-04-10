import { Component, OnInit } from '@angular/core';
import { Store, select } from '@ngrx/store';
import { Observable } from 'rxjs';
import { User } from '../../../../types/UserType';
import { loadUsers } from '../../store/users/users.actions';
import {
  selectAllUsers,
  selectUsersLoading,
} from '../../store/users/users.selectors';
import { CommonModule } from '@angular/common';
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-home',
  imports: [CommonModule],
  template: `
    <div class="p-6 text-xl">
      ✅ You are authenticated and can see this page.
    </div>

    <!-- Loading State -->
    <div *ngIf="loading$ | async" class="loading">Loading...</div>

    <!-- Users List -->
    <div *ngIf="users$ | async as users; else noUsers">
      <ul *ngIf="users.length > 0; else noUsers">
        <li *ngFor="let user of users">
          <span>{{ user.nickname }}</span>
        </li>
      </ul>
    </div>
    <ng-template #noUsers>No users available</ng-template>
  `,
  styles: [
    `
      .loading {
        font-size: 20px;
        color: #999;
      }
    `,
  ],
})
export class HomeComponent implements OnInit {
  users$: Observable<User[] | null>;
  loading$: Observable<boolean>;

  constructor(private store: Store) {
    // Select the users data and loading state from the store
    this.users$ = store.pipe(
      select(selectAllUsers),
      map((users) => users || []) // Default to an empty array if null
    );
    this.loading$ = store.pipe(select(selectUsersLoading)); // Loading state observable
  }

  ngOnInit(): void {
    // Dispatch the action to load users when the component is initialized
    this.store.dispatch(loadUsers());
  }
}
