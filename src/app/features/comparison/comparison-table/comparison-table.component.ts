import { Component, Input, computed, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import {
  ComparedProductItem,
  ProductComparisonResponse,
} from '../../../shared/models/product.model';

@Component({
  selector: 'app-comparison-table',
  standalone: true,
  imports: [CommonModule, RouterLink, MatIconModule, MatButtonModule],
  templateUrl: './comparison-table.component.html',
  styleUrl: './comparison-table.component.scss',
})
export class ComparisonTableComponent {
  @Input({ required: true }) data!: ProductComparisonResponse;

  /** Toggle between showing all attributes or only differing ones */
  showOnlyDiffs = signal(false);

  visibleAttributes = computed(() =>
    this.showOnlyDiffs()
      ? this.data.differingAttributes
      : this.data.allAttributes
  );

  isDiffering(attr: string): boolean {
    return this.data.differingAttributes.includes(attr);
  }

  getAttribute(item: ComparedProductItem, attr: string): string {
    return item.product.attributes[attr] ?? '—';
  }

  toggleDiffs(): void {
    this.showOnlyDiffs.update(v => !v);
  }
}
