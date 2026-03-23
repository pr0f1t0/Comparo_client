import { Injectable, signal, computed } from '@angular/core';
import { SavedList } from '../models/saved-list.model';

const STORAGE_PREFIX = 'comparo_saved_lists_';

@Injectable({ providedIn: 'root' })
export class SavedListService {
  private readonly _lists = signal<SavedList[]>([]);
  private _userId: string | null = null;

  readonly lists = this._lists.asReadonly();
  readonly count = computed(() => this._lists().length);

  initForUser(userId: string): void {
    this._userId = userId;
    this._lists.set(this.load());
  }

  clear(): void {
    this._userId = null;
    this._lists.set([]);
  }

  getById(id: string): SavedList | undefined {
    return this._lists().find((l) => l.id === id);
  }

  create(name: string): SavedList {
    const list: SavedList = {
      id: crypto.randomUUID(),
      name,
      productIds: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    this._lists.update((lists) => [...lists, list]);
    this.persist();
    return list;
  }

  rename(id: string, name: string): void {
    this._lists.update((lists) =>
      lists.map((l) =>
        l.id === id ? { ...l, name, updatedAt: new Date().toISOString() } : l
      )
    );
    this.persist();
  }

  delete(id: string): void {
    this._lists.update((lists) => lists.filter((l) => l.id !== id));
    this.persist();
  }

  addProduct(listId: string, productId: string): void {
    this._lists.update((lists) =>
      lists.map((l) =>
        l.id === listId && !l.productIds.includes(productId)
          ? { ...l, productIds: [...l.productIds, productId], updatedAt: new Date().toISOString() }
          : l
      )
    );
    this.persist();
  }

  removeProduct(listId: string, productId: string): void {
    this._lists.update((lists) =>
      lists.map((l) =>
        l.id === listId
          ? { ...l, productIds: l.productIds.filter((p) => p !== productId), updatedAt: new Date().toISOString() }
          : l
      )
    );
    this.persist();
  }

  private get storageKey(): string {
    return this._userId ? `${STORAGE_PREFIX}${this._userId}` : '';
  }

  private load(): SavedList[] {
    if (!this._userId) return [];
    const raw = localStorage.getItem(this.storageKey);
    return raw ? JSON.parse(raw) : [];
  }

  private persist(): void {
    if (!this._userId) return;
    localStorage.setItem(this.storageKey, JSON.stringify(this._lists()));
  }
}
