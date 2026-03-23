import { Component, inject, OnInit, signal, computed, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { SearchService } from '../../../shared/services/search.service';
import { FavoriteService } from '../../../shared/services/favorite.service';
import { SavedListService } from '../../../shared/services/saved-list.service';
import { CompareService } from '../../../shared/services/compare.service';
import { AuthService } from '../../../core/auth/auth.service';
import {
  ProductDto,
  ProductSearchRequest,
  ProductSearchResponse,
} from '../../../shared/models/search.model';

@Component({
  selector: 'app-search-page',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatIconModule,
    MatButtonModule,
    MatProgressSpinnerModule,
  ],
  templateUrl: './search-page.component.html',
  styleUrl: './search-page.component.scss',
})
export class SearchPageComponent implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly searchService = inject(SearchService);
  private readonly favoriteService = inject(FavoriteService);
  private readonly savedListService = inject(SavedListService);
  private readonly authService = inject(AuthService);
  readonly compareService = inject(CompareService);

  readonly isAuthenticated = this.authService.authenticated;

  loading = signal(false);
  response = signal<ProductSearchResponse | null>(null);

  keyword = '';
  sortBy = '';
  currentPage = 0;
  pageSize = 12;

  // Filters
  selectedCategory = '';
  minPrice: number | null = null;
  maxPrice: number | null = null;
  selectedAttributes: Record<string, string> = {};

  // Add-to-list state
  openDropdownProductId: string | null = null;
  creatingNewList = false;
  newListName = '';
  savedLists = this.savedListService.lists;

  products = computed(() => this.response()?.products ?? []);
  totalElements = computed(() => this.response()?.totalElements ?? 0);
  totalPages = computed(() => this.response()?.totalPages ?? 0);
  facets = computed(() => this.response()?.availableFacets ?? {});
  facetKeys = computed(() => Object.keys(this.facets()));
  priceRange = computed(() => ({
    min: this.response()?.minAvailablePrice ?? 0,
    max: this.response()?.maxAvailablePrice ?? 0,
  }));

  @HostListener('document:click')
  onDocumentClick(): void {
    this.closeListDropdown();
  }

  ngOnInit(): void {
    this.route.queryParams.subscribe((params) => {
      this.keyword = params['q'] ?? '';
      this.selectedCategory = params['category'] ?? '';
      this.currentPage = +(params['page'] ?? 0);
      this.sortBy = params['sort'] ?? '';
      this.performSearch();
    });
  }

  performSearch(): void {
    this.loading.set(true);

    const request: ProductSearchRequest = {
      keyword: this.keyword || undefined,
      categoryId: this.selectedCategory || undefined,
      minPrice: this.minPrice ?? undefined,
      maxPrice: this.maxPrice ?? undefined,
      attributes: Object.keys(this.selectedAttributes).length
        ? this.selectedAttributes
        : undefined,
      sortBy: this.sortBy || undefined,
      page: this.currentPage,
      size: this.pageSize,
    };

    this.searchService.search(request).subscribe({
      next: (data) => {
        this.response.set(data);
        this.loading.set(false);
      },
      error: () => {
        this.response.set(null);
        this.loading.set(false);
      },
    });
  }

  onSortChange(sort: string): void {
    this.sortBy = sort;
    this.currentPage = 0;
    this.updateUrlAndSearch();
  }

  onCategoryFilter(categoryId: string): void {
    this.selectedCategory = this.selectedCategory === categoryId ? '' : categoryId;
    this.currentPage = 0;
    this.updateUrlAndSearch();
  }

  onFacetSelect(key: string, value: string): void {
    if (this.selectedAttributes[key] === value) {
      delete this.selectedAttributes[key];
    } else {
      this.selectedAttributes[key] = value;
    }
    this.currentPage = 0;
    this.performSearch();
  }

  applyPriceFilter(): void {
    this.currentPage = 0;
    this.performSearch();
  }

  clearFilters(): void {
    this.selectedCategory = '';
    this.minPrice = null;
    this.maxPrice = null;
    this.selectedAttributes = {};
    this.currentPage = 0;
    this.updateUrlAndSearch();
  }

  goToPage(page: number): void {
    this.currentPage = page;
    this.updateUrlAndSearch();
  }

  toggleFavorite(productId: string): void {
    this.favoriteService.toggle(productId);
  }

  isFavorite(productId: string): boolean {
    return this.favoriteService.isFavorite(productId);
  }

  openProduct(productId: string): void {
    this.router.navigate(['/product', productId]);
  }

  toggleCompare(productId: string): void {
    this.compareService.toggle(productId);
  }

  getProductImage(product: ProductDto): string {
    return product.imageUrl || 'assets/placeholder.png';
  }

  getRatingStars(rating: number): number[] {
    return Array.from({ length: 5 }, (_, i) => i < Math.round(rating) ? 1 : 0);
  }

  isFacetSelected(key: string, value: string): boolean {
    return this.selectedAttributes[key] === value;
  }

  toggleListDropdown(productId: string): void {
    if (this.openDropdownProductId === productId) {
      this.closeListDropdown();
    } else {
      this.openDropdownProductId = productId;
      this.creatingNewList = false;
      this.newListName = '';
    }
  }

  addToList(listId: string, productId: string): void {
    this.savedListService.addProduct(listId, productId);
  }

  isProductInList(listId: string, productId: string): boolean {
    const list = this.savedListService.getById(listId);
    return list?.productIds.includes(productId) ?? false;
  }

  createListAndAdd(productId: string): void {
    const name = this.newListName.trim();
    if (!name) return;
    const list = this.savedListService.create(name);
    this.savedListService.addProduct(list.id, productId);
    this.closeListDropdown();
  }

  private closeListDropdown(): void {
    this.openDropdownProductId = null;
    this.creatingNewList = false;
    this.newListName = '';
  }

  get hasActiveFilters(): boolean {
    return !!(
      this.selectedCategory ||
      this.minPrice !== null ||
      this.maxPrice !== null ||
      Object.keys(this.selectedAttributes).length
    );
  }

  get pageNumbers(): number[] {
    const total = this.totalPages();
    const current = this.currentPage;
    const pages: number[] = [];
    const start = Math.max(0, current - 2);
    const end = Math.min(total - 1, current + 2);
    for (let i = start; i <= end; i++) {
      pages.push(i);
    }
    return pages;
  }

  private updateUrlAndSearch(): void {
    const queryParams: Record<string, string> = {};
    if (this.keyword) queryParams['q'] = this.keyword;
    if (this.selectedCategory) queryParams['category'] = this.selectedCategory;
    if (this.currentPage > 0) queryParams['page'] = String(this.currentPage);
    if (this.sortBy) queryParams['sort'] = this.sortBy;

    this.router.navigate([], {
      relativeTo: this.route,
      queryParams,
      queryParamsHandling: 'replace',
    });
  }
}
