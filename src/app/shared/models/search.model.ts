export interface ProductDto {
  id: string;
  name: string;
  categoryName: string;
  minPrice: number;
  maxPrice: number;
  averageRating: number;
  reviewsCount: number;
  attributes: Record<string, string>;
  imageUrl: string;
}

export interface ProductSearchRequest {
  keyword?: string;
  categoryId?: string;
  minPrice?: number;
  maxPrice?: number;
  attributes?: Record<string, string>;
  sortBy?: string;
  page: number;
  size: number;
}

export interface ProductSearchResponse {
  products: ProductDto[];
  totalElements: number;
  totalPages: number;
  availableFacets: Record<string, string[]>;
  minAvailablePrice: number;
  maxAvailablePrice: number;
}
