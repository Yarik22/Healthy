import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { environment } from '../../../../environments/environment';
import { LoaderComponent } from '../../components/loader/loader.component';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-home',
  imports: [CommonModule, TranslateModule],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
})
export class HomeComponent {
  // users$: Observable<User[] | null>;
  // loading$: Observable<boolean>;

  // constructor(private store: Store) {
  //   this.users$ = store.pipe(
  //     select(selectAllUsers),
  //     map((users) => users || [])
  //   );
  //   this.loading$ = store.pipe(select(selectUsersLoading));
  // }

  // ngOnInit(): void {
  //   this.store.dispatch(loadUsers());
  // }
}
