import { inject, Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { CategoryResponse } from '../models/category.model';
import { ProductComparisonResponse, ProductResponse } from '../models/product.model';

@Injectable({ providedIn: 'root' })
export class CatalogService {
  private readonly http = inject(HttpClient);
  private readonly base = `${environment.gatewayUrl}${environment.api.catalog}`;

  getCategories(): Observable<CategoryResponse[]> {
    return this.http.get<CategoryResponse[]>(`${this.base}/categories`);
  }

  getCategoryAttributes(categoryId: string): Observable<string[]> {
    return this.http.get<string[]>(
      `${this.base}/categories/${categoryId}/attributes`
    );
  }

  getProduct(id: string): Observable<ProductResponse> {
    return this.http.get<ProductResponse>(
      `${this.base}/products/${id}`
    );
  }

  getProductsByIds(ids: string[]): Observable<ProductResponse[]> {
    const params = new HttpParams().set('ids', ids.join(','));
    return this.http.get<ProductResponse[]>(
      `${this.base}/products/bulk`,
      { params }
    );
  }

  getTrendingProducts(limit = 10): Observable<ProductResponse[]> {
    const params = new HttpParams().set('limit', limit);
    return this.http.get<ProductResponse[]>(
      `${this.base}/products/trending`,
      { params }
    );
  }

  getAllProducts(): Observable<ProductResponse[]> {
    return this.http.get<ProductResponse[]>(`${this.base}/products`);
  }

  deleteProduct(id: string): Observable<void> {
    return this.http.delete<void>(`${this.base}/products/${id}`);
  }

  compareProducts(ids: string[], useCase?: string): Observable<ProductComparisonResponse> {
    let params = new HttpParams().set('ids', ids.join(','));
    if (useCase) params = params.set('useCase', useCase);
    return this.http.get<ProductComparisonResponse>(
      `${this.base}/products/compare`,
      { params }
    );
  }
}