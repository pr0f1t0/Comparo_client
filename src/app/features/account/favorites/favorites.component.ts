import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { FavoriteService } from '../../../shared/services/favorite.service';
import { CatalogService } from '../../../shared/services/catalog.service';
import { ProductResponse } from '../../../shared/models/product.model';

@Component({
  selector: 'app-favorites',
  standalone: true,
  imports: [CommonModule, MatIconModule, MatButtonModule, MatProgressSpinnerModule],
  templateUrl: './favorites.component.html',
  styleUrl: './favorites.component.scss',
})
export class FavoritesComponent implements OnInit {
  private readonly favoriteService = inject(FavoriteService);
  private readonly catalogService = inject(CatalogService);

  readonly favoriteIds = this.favoriteService.favoriteIds;
  products = signal<ProductResponse[]>([]);
  loading = signal(true);

  ngOnInit(): void {
    const ids = this.favoriteIds();
    if (!ids.length) {
      this.loading.set(false);
      return;
    }

    this.catalogService.getProductsByIds(ids).subscribe({
      next: (data) => {
        this.products.set(data);
        this.loading.set(false);
      },
      error: () => this.loading.set(false),
    });
  }

  removeFavorite(productId: string): void {
    this.favoriteService.toggle(productId);
    this.products.update((list) => list.filter((p) => p.id !== productId));
  }
}
