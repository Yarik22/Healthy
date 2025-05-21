// user.service.ts
import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { User } from '../../../types/UserType';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private apiUrl = `http://localhost:${environment.API_PORT}/${environment.API_PREFIX}/users`;

  constructor(private http: HttpClient) {}

  getMe(): Observable<User> {
    return this.http.get<User>(`${this.apiUrl}/me`);
  }

  updateMe(updatedUser: Partial<User>): Observable<User> {
    return this.http.patch<User>(`${this.apiUrl}/me`, updatedUser);
  }

  searchUsers(nickname: string): Observable<User[]> {
    const params = new HttpParams().set('nickname', nickname);
    return this.http.get<User[]>(`${this.apiUrl}/search`, { params });
  }
}
