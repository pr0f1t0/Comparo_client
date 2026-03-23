import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { AuthService } from '../../../core/auth/auth.service';

@Component({
  selector: 'app-account-shell',
  standalone: true,
  imports: [CommonModule, RouterOutlet, RouterLink, RouterLinkActive, MatIconModule],
  templateUrl: './account-shell.component.html',
  styleUrl: './account-shell.component.scss',
})
export class AccountShellComponent {
  private readonly authService = inject(AuthService);

  readonly fullName = this.authService.fullName;
  readonly profile = this.authService.userProfile;

  readonly navItems = [
    { label: 'Account Settings', icon: 'person', route: 'settings' },
    { label: 'My Saved Lists', icon: 'list_alt', route: 'lists' },
    { label: 'Favorite Products', icon: 'favorite', route: 'favorites' },
  ];

  logout(): void {
    this.authService.logout();
  }
}
