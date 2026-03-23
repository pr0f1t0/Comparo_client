import { Injectable, signal, computed } from '@angular/core';

const STORAGE_KEY = 'comparo_favorites';

@Injectable({ providedIn: 'root' })
export class FavoriteService {
  private readonly _favoriteIds = signal<Set<string>>(this.load());

  readonly favoriteIds = computed(() => [...this._favoriteIds()]);
  readonly count = computed(() => this._favoriteIds().size);

  isFavorite(productId: string): boolean {
    return this._favoriteIds().has(productId);
  }

  toggle(productId: string): void {
    this._favoriteIds.update((ids) => {
      const next = new Set(ids);
      if (next.has(productId)) {
        next.delete(productId);
      } else {
        next.add(productId);
      }
      return next;
    });
    this.persist();
  }

  private load(): Set<string> {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? new Set(JSON.parse(raw)) : new Set();
  }

  private persist(): void {
    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify([...this._favoriteIds()])
    );
  }
}
