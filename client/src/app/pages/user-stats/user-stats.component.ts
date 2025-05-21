import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../../environments/environment';
import { TherapyService } from '../../service/therapy.service';
import { MentalState } from '../../../../shared/enums/therapy.enum';
import { CommonModule } from '@angular/common';

interface EvaluationStat {
  mentalState: MentalState;
  value: number;
}

@Component({
  selector: 'app-user-stats',
  templateUrl: './user-stats.component.html',
  styleUrls: ['./user-stats.component.css'],
  imports: [CommonModule],
})
export class UserStatsComponent implements OnInit {
  userId: string = '';
  stats: EvaluationStat[] = [];
  loading: boolean = true;
  error: string | null = null;

  constructor(
    private route: ActivatedRoute,
    private http: HttpClient,
    private therapyService: TherapyService
  ) {}

  ngOnInit(): void {
    this.userId = this.route.snapshot.paramMap.get('userId') || '';
    this.loadStats();
  }

  loadStats(): void {
    this.loading = true;
    this.error = null;

    this.http
      .get<EvaluationStat[]>(
        `http://localhost:${environment.API_PORT}/${environment.API_PREFIX}/evaluations/stats?uuid=${this.userId}`
      )
      .subscribe({
        next: (stats) => {
          this.stats = stats;
          this.loading = false;
        },
        error: (err) => {
          this.error = 'Не вдалося завантажити статистику';
          this.loading = false;
          console.error('Error loading stats:', err);
        },
      });
  }

  getTranslatedState(state: MentalState): string {
    return this.therapyService.getTranslatedMentalState(state);
  }

  getStateColor(state: MentalState): string {
    return this.therapyService.getColorForState(state);
  }
}
