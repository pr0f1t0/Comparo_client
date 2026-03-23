import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { ProductSearchRequest, ProductSearchResponse } from '../models/search.model';

@Injectable({ providedIn: 'root' })
export class SearchService {
  private readonly http = inject(HttpClient);
  private readonly base = `${environment.gatewayUrl}${environment.api.search}`;

  search(request: ProductSearchRequest): Observable<ProductSearchResponse> {
    return this.http.post<ProductSearchResponse>(this.base, request);
  }
}
