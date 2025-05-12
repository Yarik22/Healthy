import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { Therapy } from '../../../../types/TherapyType';
import { CommonModule } from '@angular/common';
import { TherapyBadgeComponent } from '../../components/therapy-badge/therapy-badge.component';
import { FormsModule } from '@angular/forms';
import { MentalState } from '../../../../shared/enums/therapy.enum';
import { LoaderComponent } from '../../components/loader/loader.component';
import { TherapyService } from '../../service/therapy.service';

@Component({
  selector: 'app-therapies',
  standalone: true,
  imports: [CommonModule, TherapyBadgeComponent, FormsModule, LoaderComponent],
  templateUrl: './therapies.component.html',
  styleUrls: ['./therapies.component.css'],
})
export class TherapyListComponent {
  therapies: Therapy[] = [];
  filteredTherapies: Therapy[] = [];
  searchTerm: string = '';
  selectedMentalState: MentalState | null = null;
  isLoading: boolean = true;
  error: string | null = null;

  constructor(
    private http: HttpClient,
    private therapyService: TherapyService
  ) {}

  ngOnInit(): void {
    this.loadTherapies();
  }

  loadTherapies(): void {
    this.isLoading = true;
    this.error = null;

    this.http.get<Therapy[]>('assets/therapies.json').subscribe({
      next: (data) => {
        this.therapies = data.map((therapy) => this.normalizeTherapy(therapy));
        this.filteredTherapies = [...this.therapies];
        this.isLoading = false;
      },
      error: (err) => {
        this.error = 'Failed to load therapies. Please try again later.';
        this.isLoading = false;
        console.error('Error loading therapies:', err);
      },
    });
  }

  private normalizeTherapy(therapy: Therapy): Therapy {
    return {
      ...therapy,
      title: therapy.title ?? 'Untitled Therapy',
      description: therapy.description ?? 'No description available',
      url: therapy.url ?? null,
      img: therapy.img ?? './assets/default-therapy.jpg',
      mentalStates: therapy.mentalStates ?? [],
    };
  }

  filterTherapies(): void {
    if (!this.therapies) {
      this.filteredTherapies = [];
      return;
    }

    const searchTermLower = this.searchTerm?.toLowerCase() ?? '';

    this.filteredTherapies = this.therapies.filter((therapy) => {
      const matchesSearch =
        therapy.title.toLowerCase().includes(searchTermLower) ||
        (therapy.description &&
          therapy.description.toLowerCase().includes(searchTermLower));

      const matchesMentalState =
        !this.selectedMentalState ||
        therapy.mentalStates.includes(this.selectedMentalState);

      return matchesSearch && matchesMentalState;
    });
  }

  get allMentalStates(): MentalState[] {
    if (!this.therapies) return [];

    const states = new Set<MentalState>();
    this.therapies.forEach((therapy) => {
      therapy.mentalStates?.forEach((state) => states.add(state));
    });
    return Array.from(states).sort();
  }

  trackByTherapy(index: number, therapy: Therapy): string {
    return `${therapy.title}-${index}`;
  }

  getTranslatedMentalState(state: MentalState): string {
    return this.therapyService.getTranslatedMentalState(state);
  }
}
