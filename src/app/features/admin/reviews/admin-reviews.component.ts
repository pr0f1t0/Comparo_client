import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { AdminService } from '../../../shared/services/admin.service';
import { ReviewResponse } from '../../../shared/models/review.model';

@Component({
  selector: 'app-admin-reviews',
  standalone: true,
  imports: [CommonModule, MatIconModule, MatProgressSpinnerModule],
  templateUrl: './admin-reviews.component.html',
  styleUrl: './admin-reviews.component.scss',
})
export class AdminReviewsComponent implements OnInit {
  private readonly adminService = inject(AdminService);

  loading = signal(true);
  reviews = signal<ReviewResponse[]>([]);
  actionInProgress = signal<string | null>(null);

  ngOnInit(): void {
    this.loadReviews();
  }

  approve(reviewId: string): void {
    this.actionInProgress.set(reviewId);
    this.adminService.approveReview(reviewId).subscribe({
      next: () => this.removeReview(reviewId),
      error: () => this.actionInProgress.set(null),
    });
  }

  reject(reviewId: string): void {
    this.actionInProgress.set(reviewId);
    this.adminService.rejectReview(reviewId).subscribe({
      next: () => this.removeReview(reviewId),
      error: () => this.actionInProgress.set(null),
    });
  }

  getRatingStars(rating: number): number[] {
    return Array.from({ length: 5 }, (_, i) => (i < rating ? 1 : 0));
  }

  formatDate(iso: string): string {
    return new Date(iso).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  }

  private removeReview(reviewId: string): void {
    this.reviews.update((r) => r.filter((rev) => rev.id !== reviewId));
    this.actionInProgress.set(null);
  }

  private loadReviews(): void {
    this.adminService.getPendingReviews().subscribe({
      next: (data) => {
        this.reviews.set(data);
        this.loading.set(false);
      },
      error: () => this.loading.set(false),
    });
  }
}
