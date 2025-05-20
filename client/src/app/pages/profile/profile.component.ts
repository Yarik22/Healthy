import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { User } from '../../../../types/UserType';
import { loadUser } from '../../store/user/user.actions';
import {
  selectUser,
  selectUserLoading,
  selectUserError,
} from '../../store/user/user.selectors';
import { LoaderComponent } from '../../components/loader/loader.component';
import { CommonModule } from '@angular/common';
import { ProfileBadgeComponent } from '../../components/profile-badge/profile-badge.component';
import { RecommendationComponent } from "../../components/recommendation/recommendation.component";

@Component({
  selector: 'app-profile-page',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css'],
  imports: [LoaderComponent, CommonModule, ProfileBadgeComponent, RecommendationComponent],
})
export class ProfileComponent implements OnInit {
  user$: Observable<User | null>;
  loading$: Observable<boolean>;
  error$: Observable<any>;

  constructor(private store: Store) {
    this.user$ = this.store.select(selectUser);
    this.loading$ = this.store.select(selectUserLoading);
    this.error$ = this.store.select(selectUserError);
  }

  ngOnInit(): void {
    this.store.dispatch(loadUser());
  }
}
