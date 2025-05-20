import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map, Observable } from 'rxjs';
import { Test } from '../../../types/TestType';
import { environment } from '../../../environments/environment';

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
}

@Injectable({
  providedIn: 'root',
})
export class TestService {
  private apiUrl = `http://localhost:${environment.API_PORT}/${environment.API_PREFIX}/tests`;

  constructor(private http: HttpClient) {}

  getTests(
    page: number = 1,
    limit: number = 5,
    search?: string
  ): Observable<PaginatedResponse<Test>> {
    let url = `${this.apiUrl}?page=${page}&limit=${limit}`;
    if (search && search.trim().length > 0) {
      url += `&search=${encodeURIComponent(search.trim())}`;
    }
    return this.http.get<{ data: Test[]; total: number }>(url);
  }

  getTestById(id: string): Observable<Test> {
    return this.http.get<Test>(`${this.apiUrl}/${id}`);
  }

  submitAnswers(answers: { [questionId: string]: string }): Observable<any> {
    return this.http.post(`${this.apiUrl}/submit`, { answers });
  }

  getTestInfo(id: string): Observable<{
    testId: string;
    totalQuestions: number;
    usersPassed: number;
  }> {
    return this.http.get<{
      testId: string;
      totalQuestions: number;
      usersPassed: number;
    }>(`${this.apiUrl}/${id}/info`);
  }

  hasSubmitedTest(): Observable<boolean> {
    return this.http
      .get<{ hasTests: boolean }>(`${this.apiUrl}/user/has-tests`)
      .pipe(map((response) => response.hasTests));
  }
}
