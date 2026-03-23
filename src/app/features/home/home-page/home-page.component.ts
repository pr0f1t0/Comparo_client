import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { CatalogService } from '../../../shared/services/catalog.service';
import { CategoryResponse } from '../../../shared/models/category.model';
import { ProductResponse } from '../../../shared/models/product.model';
import { getCategoryIcon } from '../../../shared/utils/category-icons';

@Component({
  selector: 'app-home-page',
  standalone: true,
  imports: [CommonModule, MatIconModule, MatButtonModule, MatProgressSpinnerModule],
  templateUrl: './home-page.component.html',
  styleUrl: './home-page.component.scss',
})
export class HomePageComponent implements OnInit {
  private readonly catalogService = inject(CatalogService);
  private readonly router = inject(Router);

  categories = signal<CategoryResponse[]>([]);
  trending = signal<ProductResponse[]>([]);
  loadingCategories = signal(true);
  loadingTrending = signal(true);

  searchQuery = '';

  ngOnInit(): void {
    this.catalogService.getCategories().subscribe({
      next: (data) => {
        this.categories.set(data);
        this.loadingCategories.set(false);
      },
      error: () => this.loadingCategories.set(false),
    });

    this.catalogService.getTrendingProducts(8).subscribe({
      next: (data) => {
        this.trending.set(data);
        this.loadingTrending.set(false);
      },
      error: () => this.loadingTrending.set(false),
    });
  }

  onSearch(query: string): void {
    const trimmed = query.trim();
    if (trimmed) {
      this.router.navigate(['/search'], { queryParams: { q: trimmed } });
    }
  }

  getCategoryIcon(name: string): string {
    return getCategoryIcon(name);
  }

  onCategoryClick(categoryId: string): void {
    this.router.navigate(['/search'], { queryParams: { category: categoryId } });
  }

  getSubcategoryNames(category: CategoryResponse): string {
    if (category.subcategories?.length) {
      return category.subcategories.map((s) => s.name).slice(0, 3).join(', ');
    }
    return '';
  }

  getProductImage(product: ProductResponse): string {
    return product.images?.[0] || 'assets/placeholder.png';
  }
}
