import { Component, OnDestroy, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../../environments/environment';
import { TestService } from '../../service/test.service';
import { CommonModule } from '@angular/common';
import { LoaderComponent } from '../loader/loader.component';
import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';

interface CachedRecommendation {
  recommendation: string;
  timestamp: number;
}

@Component({
  selector: 'app-recommendation',
  templateUrl: './recommendation.component.html',
  styleUrls: ['./recommendation.component.css'],
  imports: [CommonModule, LoaderComponent],
})
export class RecommendationComponent implements OnInit, OnDestroy {
  hasTests: boolean = false;
  loading: boolean = false;
  recommendation: string | null = null;
  tooltipVisible: boolean = false;
  cooldownMinutes = 5;
  lastRequestTime: number | null = null;
  timeLeft: number = 0;
  private cooldownInterval: any;
  private tooltipTimeout: any;
  private destroy$ = new Subject<void>();

  private apiUrl = `http://localhost:${environment.API_PORT}/${environment.API_PREFIX}/evaluations/recommendation`;

  constructor(private testService: TestService, private http: HttpClient) {}

  ngOnInit() {
    this.loading = true;
    this.loadFromCache();

    this.testService
      .hasSubmitedTest()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (result) => {
          this.hasTests = result;
          this.loading = false;
        },
        error: () => {
          this.hasTests = false;
          this.loading = false;
        },
      });
  }

  loadFromCache(): void {
    const cached = localStorage.getItem('recommendationData');
    if (cached) {
      const { recommendation, timestamp }: CachedRecommendation =
        JSON.parse(cached);
      const age = (Date.now() - timestamp) / 60000;
      if (age < this.cooldownMinutes) {
        this.recommendation = recommendation;
        this.lastRequestTime = timestamp;
        this.timeLeft = Math.ceil(this.cooldownMinutes - age);
        this.startCooldownTimer();
      }
    }
  }

  getRecommendation(): void {
    if (!this.hasTests) {
      this.showTooltip();
      return;
    }

    if (this.loading || this.timeLeft > 0) return;

    this.loading = true;
    this.http.get<{ recommendation: string }>(this.apiUrl).subscribe({
      next: (response) => {
        this.recommendation = response.recommendation;
        this.lastRequestTime = Date.now();
        this.timeLeft = this.cooldownMinutes;
        this.startCooldownTimer();
        localStorage.setItem(
          'recommendationData',
          JSON.stringify({
            recommendation: response.recommendation,
            timestamp: this.lastRequestTime,
          })
        );
        this.loading = false;
      },
      error: (err) => {
        console.error('Recommendation fetch error:', err);
        this.recommendation =
          'Не вдалося отримати рекомендацію. Спробуйте пізніше.';
        this.loading = false;
      },
    });
  }

  showTooltip(): void {
    this.tooltipVisible = true;
    clearTimeout(this.tooltipTimeout);
    this.tooltipTimeout = setTimeout(() => {
      this.tooltipVisible = false;
    }, 3000);
  }

  startCooldownTimer(): void {
    if (this.cooldownInterval) {
      clearInterval(this.cooldownInterval);
    }

    this.cooldownInterval = setInterval(() => {
      this.timeLeft--;
      if (this.timeLeft <= 0) {
        clearInterval(this.cooldownInterval);
        this.cooldownInterval = null;
      }
    }, 60000);
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
    clearInterval(this.cooldownInterval);
    clearTimeout(this.tooltipTimeout);
  }
}
