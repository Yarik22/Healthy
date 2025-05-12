import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { loadTherapyByName } from '../../store/therapy/therapy.actions';
import { Therapy } from '../../../../types/TherapyType';
import {
  selectTherapy,
  selectLoading,
  selectError,
} from '../../store/therapy/therapy.selectors';
import { LoaderComponent } from '../../components/loader/loader.component';
import { CommonModule } from '@angular/common';
import { MentalState } from '../../../../shared/enums/therapy.enum';
import { TherapyService } from '../../service/therapy.service';

@Component({
  selector: 'app-therapy',
  standalone: true,
  templateUrl: './therapy.component.html',
  styleUrls: ['./therapy.component.css'],
  imports: [LoaderComponent, CommonModule],
})
export class TherapyComponent implements OnInit {
  therapy$: Observable<Therapy | null>;
  loading$: Observable<boolean>;
  error$: Observable<string | null>;

  constructor(
    private route: ActivatedRoute,
    private store: Store,
    private therapyService: TherapyService
  ) {
    this.therapy$ = this.store.select(selectTherapy);
    this.loading$ = this.store.select(selectLoading);
    this.error$ = this.store.select(selectError);
  }

  ngOnInit(): void {
    this.route.paramMap.subscribe((params) => {
      const name = params.get('name');
      if (name) {
        this.store.dispatch(loadTherapyByName({ name }));
      }
    });
  }

  handleImageError(event: Event) {
    const imgElement = event.target as HTMLImageElement;
    imgElement.src = './assets/default-therapy.jpg';
  }

  getColorForState(state: MentalState): string {
    return this.therapyService.getColorForState(state);
  }

  reload() {
    this.route.paramMap.subscribe((params) => {
      const name = params.get('name');
      if (name) {
        this.store.dispatch(loadTherapyByName({ name }));
      }
    });
  }
}
