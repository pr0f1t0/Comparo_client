import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { UserProfileResponse, UserUpdateRequest } from '../models/user.model';

@Injectable({ providedIn: 'root' })
export class UserService {
  private readonly http = inject(HttpClient);
  private readonly base = `${environment.gatewayUrl}${environment.api.user}`;

  getProfile(): Observable<UserProfileResponse> {
    return this.http.get<UserProfileResponse>(`${this.base}/me`);
  }

  updateProfile(request: UserUpdateRequest): Observable<UserProfileResponse> {
    return this.http.put<UserProfileResponse>(`${this.base}/me`, request);
  }
}
