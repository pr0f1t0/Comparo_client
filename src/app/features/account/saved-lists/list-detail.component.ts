import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { SavedListService } from '../../../shared/services/saved-list.service';
import { CatalogService } from '../../../shared/services/catalog.service';
import { ProductResponse } from '../../../shared/models/product.model';
import { SavedList } from '../../../shared/models/saved-list.model';

@Component({
  selector: 'app-list-detail',
  standalone: true,
  imports: [CommonModule, MatIconModule, MatButtonModule, MatProgressSpinnerModule],
  templateUrl: './list-detail.component.html',
  styleUrl: './list-detail.component.scss',
})
export class ListDetailComponent implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly savedListService = inject(SavedListService);
  private readonly catalogService = inject(CatalogService);

  list = signal<SavedList | null>(null);
  products = signal<ProductResponse[]>([]);
  loading = signal(false);

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (!id) {
      this.router.navigate(['/account/lists']);
      return;
    }

    const found = this.savedListService.getById(id);
    if (!found) {
      this.router.navigate(['/account/lists']);
      return;
    }

    this.list.set(found);

    if (found.productIds.length > 0) {
      this.loading.set(true);
      this.catalogService.getProductsByIds(found.productIds).subscribe({
        next: (products) => {
          this.products.set(products);
          this.loading.set(false);
        },
        error: () => this.loading.set(false),
      });
    }
  }

  removeProduct(productId: string): void {
    const current = this.list();
    if (!current) return;
    this.savedListService.removeProduct(current.id, productId);
    this.list.set(this.savedListService.getById(current.id) ?? null);
    this.products.update((p) => p.filter((prod) => prod.id !== productId));
  }

  getProductImage(product: ProductResponse): string {
    return product.images?.[0] || 'assets/placeholder.png';
  }

  goBack(): void {
    this.router.navigate(['/account/lists']);
  }
}
