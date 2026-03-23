import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { AdminService } from '../../../shared/services/admin.service';
import { AdminUserResponse } from '../../../shared/models/admin.model';

@Component({
  selector: 'app-admin-users',
  standalone: true,
  imports: [CommonModule, MatIconModule, MatProgressSpinnerModule],
  templateUrl: './admin-users.component.html',
  styleUrl: './admin-users.component.scss',
})
export class AdminUsersComponent implements OnInit {
  private readonly adminService = inject(AdminService);

  loading = signal(true);
  users = signal<AdminUserResponse[]>([]);
  actionInProgress = signal<string | null>(null);

  ngOnInit(): void {
    this.loadUsers();
  }

  toggleUserStatus(user: AdminUserResponse): void {
    this.actionInProgress.set(user.id);
    const action$ = user.enabled
      ? this.adminService.banUser(user.id)
      : this.adminService.unbanUser(user.id);

    action$.subscribe({
      next: () => {
        this.users.update((users) =>
          users.map((u) =>
            u.id === user.id ? { ...u, enabled: !u.enabled } : u
          )
        );
        this.actionInProgress.set(null);
      },
      error: () => this.actionInProgress.set(null),
    });
  }

  private loadUsers(): void {
    this.adminService.getUsers().subscribe({
      next: (data) => {
        this.users.set(data);
        this.loading.set(false);
      },
      error: () => this.loading.set(false),
    });
  }
}
