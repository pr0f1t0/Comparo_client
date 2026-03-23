import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { OfferResponse } from '../models/offer.model';

@Injectable({ providedIn: 'root' })
export class OfferService {
  private readonly http = inject(HttpClient);
  private readonly base = `${environment.gatewayUrl}${environment.api.offer}`;

  getOffersByProduct(productId: string): Observable<OfferResponse[]> {
    return this.http.get<OfferResponse[]>(`${this.base}/product/${productId}`);
  }

  getOfferById(id: string): Observable<OfferResponse> {
    return this.http.get<OfferResponse>(`${this.base}/${id}`);
  }

  deleteOffer(id: string): Observable<void> {
    return this.http.delete<void>(`${this.base}/${id}`);
  }
}
