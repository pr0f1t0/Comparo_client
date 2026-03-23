import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { Router } from '@angular/router';
import { CatalogService } from '../../../shared/services/catalog.service';
import { ProductResponse } from '../../../shared/models/product.model';

@Component({
  selector: 'app-admin-products',
  standalone: true,
  imports: [CommonModule, MatIconModule, MatProgressSpinnerModule],
  templateUrl: './admin-products.component.html',
  styleUrl: './admin-products.component.scss',
})
export class AdminProductsComponent implements OnInit {
  private readonly catalogService = inject(CatalogService);
  private readonly router = inject(Router);

  loading = signal(true);
  products = signal<ProductResponse[]>([]);
  deletingId = signal<string | null>(null);

  ngOnInit(): void {
    this.loadProducts();
  }

  viewProduct(id: string): void {
    this.router.navigate(['/product', id]);
  }

  deleteProduct(id: string): void {
    this.deletingId.set(id);
    this.catalogService.deleteProduct(id).subscribe({
      next: () => {
        this.products.update((p) => p.filter((prod) => prod.id !== id));
        this.deletingId.set(null);
      },
      error: () => this.deletingId.set(null),
    });
  }

  private loadProducts(): void {
    this.catalogService.getAllProducts().subscribe({
      next: (data) => {
        this.products.set(data);
        this.loading.set(false);
      },
      error: () => this.loading.set(false),
    });
  }
}
