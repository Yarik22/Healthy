import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Therapy } from '../../../types/TherapyType';
import { environment } from '../../../environments/environment';
import { MentalState } from '../../../shared/enums/therapy.enum';

@Injectable({
  providedIn: 'root',
})
export class TherapyService {
  private apiUrl = `http://localhost:${environment.API_PORT}/${environment.API_PREFIX}/therapies`;

  constructor(private http: HttpClient) {}

  getTherapyByName(name: string): Observable<Therapy> {
    return this.http.get<Therapy>(`${this.apiUrl}/${encodeURIComponent(name)}`);
  }
  getColorForState(state: MentalState): string {
    const colors: Record<MentalState, string> = {
      [MentalState.Anxiety]: '#f39c12',
      [MentalState.Depression]: '#3498db',
      [MentalState.Stress]: '#bea895',
      [MentalState.Fear]: '#9b59b6',
      [MentalState.Guilt]: '#1abc9c',
      [MentalState.Shame]: '#16a085',
      [MentalState.Anger]: '#c0392b',
      [MentalState.Hopelessness]: '#7f8c8d',
      [MentalState.Isolation]: '#34495e',
      [MentalState.Confusion]: '#f1c40f',
      [MentalState.Frustration]: '#c154c1',
      [MentalState.Insecurity]: '#8e44ad',
      [MentalState.Pessimism]: '#2c3e50',
      [MentalState.Apathy]: '#95a5a6',
      [MentalState.Loneliness]: '#2980b9',
    };
    return colors[state] || '#7f8c8d';
  }

  getTranslatedMentalState(state: MentalState): string {
    const translations: Record<MentalState, string> = {
      [MentalState.Anxiety]: 'Тривожність',
      [MentalState.Depression]: 'Депресія',
      [MentalState.Stress]: 'Стрес',
      [MentalState.Fear]: 'Страх',
      [MentalState.Guilt]: 'Почуття провини',
      [MentalState.Shame]: 'Сором',
      [MentalState.Anger]: 'Злість',
      [MentalState.Hopelessness]: 'Безнадійність',
      [MentalState.Isolation]: 'Ізоляція',
      [MentalState.Confusion]: 'Розгубленість',
      [MentalState.Frustration]: 'Фрустрація',
      [MentalState.Insecurity]: 'Невпевненість',
      [MentalState.Pessimism]: 'Песимізм',
      [MentalState.Apathy]: 'Апатія',
      [MentalState.Loneliness]: 'Самотність',
    };
    return translations[state] || state;
  }
}
