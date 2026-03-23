import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { CatalogService } from '../../../shared/services/catalog.service';
import { OfferService } from '../../../shared/services/offer.service';
import { ProductResponse } from '../../../shared/models/product.model';
import { OfferResponse } from '../../../shared/models/offer.model';

@Component({
  selector: 'app-admin-offers',
  standalone: true,
  imports: [CommonModule, FormsModule, MatIconModule, MatProgressSpinnerModule],
  templateUrl: './admin-offers.component.html',
  styleUrl: './admin-offers.component.scss',
})
export class AdminOffersComponent implements OnInit {
  private readonly catalogService = inject(CatalogService);
  private readonly offerService = inject(OfferService);

  loading = signal(true);
  products = signal<ProductResponse[]>([]);
  selectedProductId = signal<string | null>(null);
  offers = signal<OfferResponse[]>([]);
  loadingOffers = signal(false);
  deletingId = signal<string | null>(null);

  ngOnInit(): void {
    this.catalogService.getAllProducts().subscribe({
      next: (data) => {
        this.products.set(data);
        this.loading.set(false);
      },
      error: () => this.loading.set(false),
    });
  }

  selectProduct(productId: string): void {
    this.selectedProductId.set(productId);
    this.loadingOffers.set(true);
    this.offerService.getOffersByProduct(productId).subscribe({
      next: (data) => {
        this.offers.set(data);
        this.loadingOffers.set(false);
      },
      error: () => this.loadingOffers.set(false),
    });
  }

  deleteOffer(offerId: string): void {
    this.deletingId.set(offerId);
    this.offerService.deleteOffer(offerId).subscribe({
      next: () => {
        this.offers.update((o) => o.filter((offer) => offer.id !== offerId));
        this.deletingId.set(null);
      },
      error: () => this.deletingId.set(null),
    });
  }

  getSelectedProductName(): string {
    const id = this.selectedProductId();
    const product = this.products().find((p) => p.id === id);
    return product?.name || '';
  }

  getAvailabilityLabel(status: string): string {
    const map: Record<string, string> = {
      IN_STOCK: 'In Stock',
      OUT_OF_STOCK: 'Out of Stock',
      PREORDER: 'Pre-order',
      DISCONTINUED: 'Discontinued',
    };
    return map[status] || status;
  }
}
