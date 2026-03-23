import { inject, Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { map, Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { StatsResponse, AdminUserResponse } from '../models/admin.model';
import { ReviewResponse } from '../models/review.model';

@Injectable({ providedIn: 'root' })
export class AdminService {
  private readonly http = inject(HttpClient);
  private readonly adminBase = `${environment.gatewayUrl}/api/v1/admin`;
  private readonly reviewBase = `${environment.gatewayUrl}${environment.api.review}`;

  // Stats
  getStats(): Observable<StatsResponse> {
    return this.http.get<StatsResponse>(`${this.adminBase}/stats`);
  }

  // Users
  getUsers(): Observable<AdminUserResponse[]> {
    return this.http.get<AdminUserResponse[]>(`${this.adminBase}/users`);
  }

  banUser(userId: string, reason?: string): Observable<void> {
    let params = new HttpParams();
    if (reason) params = params.set('reason', reason);
    return this.http.post(`${this.adminBase}/users/${userId}/ban`, null, { params, responseType: 'text' }).pipe(map(() => {}));
  }

  unbanUser(userId: string, reason?: string): Observable<void> {
    let params = new HttpParams();
    if (reason) params = params.set('reason', reason);
    return this.http.post(`${this.adminBase}/users/${userId}/unban`, null, { params, responseType: 'text' }).pipe(map(() => {}));
  }

  // Reviews
  getPendingReviews(): Observable<ReviewResponse[]> {
    return this.http.get<ReviewResponse[]>(`${this.reviewBase}/pending`);
  }

  approveReview(reviewId: string): Observable<void> {
    return this.http.patch(`${this.reviewBase}/${reviewId}/approve`, null, { responseType: 'text' }).pipe(map(() => {}));
  }

  rejectReview(reviewId: string): Observable<void> {
    return this.http.patch(`${this.reviewBase}/${reviewId}/reject`, null, { responseType: 'text' }).pipe(map(() => {}));
  }
}
