import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Test } from '../../../types/TestType';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class TestService {
  private apiUrl = `http://localhost:${environment.API_PORT}/${environment.API_PREFIX}/therapies`;

  constructor(private http: HttpClient) {}

  getTests(
    page: number = 1,
    limit: number = 10
  ): Observable<{ tests: Test[]; total: number }> {
    return this.http.get<{ tests: Test[]; total: number }>(
      `${this.apiUrl}?page=${page}&limit=${limit}`
    );
  }

  getTestById(id: string): Observable<Test> {
    console.log('getTestById');
    return this.http.get<Test>(`${this.apiUrl}/${id}`);
  }

  submitAnswers(answers: { [questionId: string]: string }): Observable<any> {
    console.log('submitAnswers');
    return this.http.post(`${this.apiUrl}/submit`, { answers });
  }
}
