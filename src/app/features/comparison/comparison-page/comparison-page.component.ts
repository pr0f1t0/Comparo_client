import {
  Component,
  inject,
  OnInit,
  signal,
  computed,
} from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatTooltipModule } from '@angular/material/tooltip';
import { CatalogService } from '../../../shared/services/catalog.service';
import {
  ComparedProductItem,
  ProductComparisonResponse,
} from '../../../shared/models/product.model';
import { ComparisonTableComponent } from '../comparison-table/comparison-table.component';

@Component({
  selector: 'app-comparison-page',
  standalone: true,
  imports: [
    CommonModule,
    MatProgressSpinnerModule,
    MatIconModule,
    MatButtonModule,
    MatTooltipModule,
    RouterLink,
    ComparisonTableComponent,
  ],
  templateUrl: './comparison-page.component.html',
  styleUrl: './comparison-page.component.scss',
})
export class ComparisonPageComponent implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly catalogService = inject(CatalogService);

  loading = signal(true);
  error = signal<string | null>(null);
  comparison = signal<ProductComparisonResponse | null>(null);

  bestChoice = computed<ComparedProductItem | null>(() => {
    const data = this.comparison();
    if (!data?.products.length) return null;
    const scored = data.products.filter(p => p.scoreResult != null);
    if (!scored.length) return null;
    return scored.reduce((best, current) =>
      current.scoreResult.score > best.scoreResult.score ? current : best
    );
  });

  ngOnInit(): void {
    const ids = this.route.snapshot.queryParamMap.getAll('ids');
    const useCase = this.route.snapshot.queryParamMap.get('useCase') ?? undefined;

    if (ids.length < 2) {
      this.error.set('Please select at least 2 products to compare.');
      this.loading.set(false);
      return;
    }

    this.catalogService.compareProducts(ids, useCase).subscribe({
      next: (data) => {
        this.comparison.set(data);
        this.loading.set(false);
      },
      error: () => {
        this.error.set('Failed to load comparison. Please try again.');
        this.loading.set(false);
      },
    });
  }
}
