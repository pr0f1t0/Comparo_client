import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { SavedListService } from '../../../shared/services/saved-list.service';

@Component({
  selector: 'app-saved-lists',
  standalone: true,
  imports: [CommonModule, MatIconModule, MatButtonModule],
  templateUrl: './saved-lists.component.html',
  styleUrl: './saved-lists.component.scss',
})
export class SavedListsComponent {
  private readonly savedListService = inject(SavedListService);
  private readonly router = inject(Router);

  readonly lists = this.savedListService.lists;

  showNewInput = signal(false);

  createList(name: string): void {
    if (name.trim()) {
      this.savedListService.create(name.trim());
      this.showNewInput.set(false);
    }
  }

  deleteList(id: string, event: Event): void {
    event.stopPropagation();
    this.savedListService.delete(id);
  }

  openList(id: string): void {
    this.router.navigate(['/account/lists', id]);
  }

  formatDate(iso: string): string {
    return new Date(iso).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  }
}
