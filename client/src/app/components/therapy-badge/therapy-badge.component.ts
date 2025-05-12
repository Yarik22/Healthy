import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { MentalState } from '../../../../shared/enums/therapy.enum';
import { TherapyService } from '../../service/therapy.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-therapy-badge',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './therapy-badge.component.html',
  styleUrls: ['./therapy-badge.component.css'],
})
export class TherapyBadgeComponent {
  @Input() title: string = 'Untitled Therapy';
  @Input() description: string = 'No description available';
  @Input() img: string | null = './assets/default-therapy.jpg';
  @Input() mentalStates: MentalState[] = [];

  constructor(private therapyService: TherapyService, private router: Router) {}
  get safeImg(): string {
    return this.img ?? './assets/default_therapy.jpg';
  }

  get safeDescription(): string {
    return this.description ?? 'No description available';
  }

  get hasMentalStates(): boolean {
    return this.mentalStates?.length > 0;
  }

  therapyImageError(event: Event): void {
    const imgElement = event.target as HTMLImageElement;
    imgElement.src = './assets/default-therapy.jpg';
  }

  getColorForState(state: MentalState): string {
    return this.therapyService.getColorForState(state);
  }

  onBadgeClick(): void {
    this.router.navigate(['/therapies', this.encodeTitle(this.title)]);
  }

  private encodeTitle(title: string): string {
    return title.toLowerCase();
  }

  getTranslatedMentalState(state: MentalState): string {
    return this.therapyService.getTranslatedMentalState(state);
  }
}
