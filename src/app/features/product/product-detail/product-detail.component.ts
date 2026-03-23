import { Component, inject, OnInit, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { forkJoin, of } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { CatalogService } from '../../../shared/services/catalog.service';
import { OfferService } from '../../../shared/services/offer.service';
import { ReviewService } from '../../../shared/services/review.service';
import { AuthService } from '../../../core/auth/auth.service';
import { FavoriteService } from '../../../shared/services/favorite.service';
import { CompareService } from '../../../shared/services/compare.service';
import { ProductResponse } from '../../../shared/models/product.model';
import { OfferResponse } from '../../../shared/models/offer.model';
import { ReviewResponse, ReviewCreateRequest } from '../../../shared/models/review.model';

@Component({
  selector: 'app-product-detail',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatIconModule,
    MatButtonModule,
    MatProgressSpinnerModule,
  ],
  templateUrl: './product-detail.component.html',
  styleUrl: './product-detail.component.scss',
})
export class ProductDetailComponent implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly catalogService = inject(CatalogService);
  private readonly offerService = inject(OfferService);
  private readonly reviewService = inject(ReviewService);
  private readonly authService = inject(AuthService);
  private readonly favoriteService = inject(FavoriteService);
  readonly compareService = inject(CompareService);

  loading = signal(true);
  product = signal<ProductResponse | null>(null);
  offers = signal<OfferResponse[]>([]);
  reviews = signal<ReviewResponse[]>([]);

  selectedImageIndex = signal(0);
  activeTab = signal<'specs' | 'offers' | 'reviews'>('specs');

  // Review form
  showReviewForm = signal(false);
  reviewRating = 5;
  reviewComment = '';
  submittingReview = signal(false);
  reviewError = signal<string | null>(null);

  readonly isAuthenticated = computed(() => this.authService.authenticated());

  readonly averageRating = computed(() => {
    const r = this.reviews().filter((rev) => rev.status === 'APPROVED');
    if (!r.length) return 0;
    return r.reduce((sum, rev) => sum + rev.rating, 0) / r.length;
  });

  readonly approvedReviews = computed(() =>
    this.reviews().filter((rev) => rev.status === 'APPROVED')
  );

  readonly pendingReviews = computed(() =>
    this.reviews().filter((rev) => rev.status === 'PENDING')
  );

  readonly sortedOffers = computed(() =>
    [...this.offers()].sort((a, b) => a.price - b.price)
  );

  readonly attributeEntries = computed(() => {
    const p = this.product();
    if (!p?.attributes) return [];
    return Object.entries(p.attributes);
  });

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id')!;
    forkJoin({
      product: this.catalogService.getProduct(id),
      offers: this.offerService.getOffersByProduct(id).pipe(catchError(() => of([]))),
      reviews: this.reviewService.getProductReviews(id).pipe(catchError(() => of([]))),
    }).subscribe({
      next: ({ product, offers, reviews }) => {
        this.product.set(product);
        this.offers.set(offers);
        this.reviews.set(reviews);
        this.loading.set(false);
      },
      error: () => {
        this.loading.set(false);
      },
    });
  }

  selectImage(index: number): void {
    this.selectedImageIndex.set(index);
  }

  getImage(index: number): string {
    const images = this.product()?.images;
    if (images && images[index]) return images[index];
    return 'assets/placeholder.png';
  }

  get currentImage(): string {
    return this.getImage(this.selectedImageIndex());
  }

  prevImage(): void {
    const images = this.product()?.images;
    if (!images?.length) return;
    const i = this.selectedImageIndex();
    this.selectedImageIndex.set(i > 0 ? i - 1 : images.length - 1);
  }

  nextImage(): void {
    const images = this.product()?.images;
    if (!images?.length) return;
    const i = this.selectedImageIndex();
    this.selectedImageIndex.set(i < images.length - 1 ? i + 1 : 0);
  }

  setTab(tab: 'specs' | 'offers' | 'reviews'): void {
    this.activeTab.set(tab);
  }

  toggleFavorite(): void {
    const p = this.product();
    if (p) this.favoriteService.toggle(p.id);
  }

  isFavorite(): boolean {
    const p = this.product();
    return p ? this.favoriteService.isFavorite(p.id) : false;
  }

  getRatingStars(rating: number): number[] {
    return Array.from({ length: 5 }, (_, i) => (i < Math.round(rating) ? 1 : 0));
  }

  getStarArray(): number[] {
    return [1, 2, 3, 4, 5];
  }

  setReviewRating(star: number): void {
    this.reviewRating = star;
  }

  submitReview(): void {
    const p = this.product();
    if (!p) return;
    this.submittingReview.set(true);
    const request: ReviewCreateRequest = {
      productId: p.id,
      rating: this.reviewRating,
      comment: this.reviewComment,
    };
    this.reviewService.createReview(request).subscribe({
      next: (review) => {
        this.reviews.update((r) => [review, ...r]);
        this.showReviewForm.set(false);
        this.reviewComment = '';
        this.reviewRating = 5;
        this.submittingReview.set(false);
        this.reviewError.set(null);
      },
      error: (err) => {
        this.submittingReview.set(false);
        if (err.status === 409) {
          this.reviewError.set('You have already reviewed this product.');
        } else {
          this.reviewError.set('Failed to submit review. Please try again.');
        }
      },
    });
  }

  formatDate(iso: string): string {
    return new Date(iso).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
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

  getAvailabilityClass(status: string): string {
    const map: Record<string, string> = {
      IN_STOCK: 'available',
      OUT_OF_STOCK: 'unavailable',
      PREORDER: 'preorder',
      DISCONTINUED: 'unavailable',
    };
    return map[status] || '';
  }
}
