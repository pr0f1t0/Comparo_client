import { Injectable, signal, computed } from '@angular/core';

const STORAGE_KEY = 'comparo_compare_ids';
const MAX_ITEMS = 4;

@Injectable({ providedIn: 'root' })
export class CompareService {
  private readonly _ids = signal<string[]>(this.load());

  readonly selectedIds = this._ids.asReadonly();
  readonly count = computed(() => this._ids().length);
  readonly canCompare = computed(() => this._ids().length >= 2);
  readonly isFull = computed(() => this._ids().length >= MAX_ITEMS);

  toggle(id: string): void {
    if (this.isSelected(id)) {
      this.remove(id);
    } else {
      this.add(id);
    }
  }

  add(id: string): void {
    const ids = this._ids();
    if (ids.includes(id) || ids.length >= MAX_ITEMS) return;
    const next = [...ids, id];
    this._ids.set(next);
    this.save(next);
  }

  remove(id: string): void {
    const next = this._ids().filter(i => i !== id);
    this._ids.set(next);
    this.save(next);
  }

  isSelected(id: string): boolean {
    return this._ids().includes(id);
  }

  clear(): void {
    this._ids.set([]);
    this.save([]);
  }

  private load(): string[] {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      return raw ? JSON.parse(raw) : [];
    } catch {
      return [];
    }
  }

  private save(ids: string[]): void {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(ids));
  }
}
