import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
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
}
