import { Component, inject, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { CompareService } from '../../services/compare.service';
import { CatalogService } from '../../services/catalog.service';
import { ProductResponse } from '../../models/product.model';

@Component({
  selector: 'app-compare-bar',
  standalone: true,
  imports: [CommonModule, MatIconModule],
  templateUrl: './compare-bar.component.html',
  styleUrl: './compare-bar.component.scss',
})
export class CompareBarComponent {
  private readonly router = inject(Router);
  readonly compareService = inject(CompareService);
  private readonly catalogService = inject(CatalogService);

  products: Map<string, ProductResponse> = new Map();

  readonly visible = computed(() => this.compareService.count() > 0);
  readonly canCompare = this.compareService.canCompare;

  constructor() {
    // Reactively fetch product info when IDs change
    // Use a simple approach: re-fetch when needed
  }

  getProduct(id: string): ProductResponse | undefined {
    const cached = this.products.get(id);
    if (!cached) {
      this.catalogService.getProduct(id).subscribe({
        next: (p) => this.products.set(id, p),
      });
    }
    return cached;
  }

  getProductName(id: string): string {
    return this.getProduct(id)?.name ?? 'Loading...';
  }

  getProductImage(id: string): string {
    const p = this.getProduct(id);
    return p?.images?.[0] ?? 'assets/placeholder.png';
  }

  remove(id: string): void {
    this.compareService.remove(id);
    this.products.delete(id);
  }

  clear(): void {
    this.compareService.clear();
    this.products.clear();
  }

  compare(): void {
    const ids = this.compareService.selectedIds();
    this.router.navigate(['/compare'], {
      queryParams: { ids },
    });
  }
}
