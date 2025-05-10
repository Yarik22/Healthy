import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Question } from '../../../types/QuestionType';

export interface SubmitResult {
  question_uuid: string;
  answer_uuid: string;
}

@Injectable({
  providedIn: 'root',
})
export class QuestionService {
  private apiUrl = `http://localhost:${environment.API_PORT}/${environment.API_PREFIX}/questions`;

  constructor(private http: HttpClient) {}

  getQuestionById(id: string): Observable<Question> {
    return this.http.get<Question>(`${this.apiUrl}/${id}`);
  }

  submitResults(results: SubmitResult[], testId: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/submit-results`, {
      results,
      testId,
    });
  }
}
