import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import {
  ReviewCreateRequest,
  ReviewResponse,
  ReviewUpdateRequest,
} from '../models/review.model';

@Injectable({ providedIn: 'root' })
export class ReviewService {
  private readonly http = inject(HttpClient);
  private readonly base = `${environment.gatewayUrl}${environment.api.review}`;

  getProductReviews(productId: string): Observable<ReviewResponse[]> {
    return this.http.get<ReviewResponse[]>(`${this.base}/product/${productId}`);
  }

  createReview(request: ReviewCreateRequest): Observable<ReviewResponse> {
    return this.http.post<ReviewResponse>(this.base, request);
  }

  updateReview(id: string, request: ReviewUpdateRequest): Observable<ReviewResponse> {
    return this.http.put<ReviewResponse>(`${this.base}/${id}`, request);
  }

  deleteReview(id: string): Observable<void> {
    return this.http.delete<void>(`${this.base}/${id}`);
  }
}
