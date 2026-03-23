import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { AuthService } from '../../../core/auth/auth.service';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive, MatIconModule, MatButtonModule],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.scss',
})
export class NavbarComponent {
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);

  readonly authenticated = this.authService.authenticated;
  readonly fullName = this.authService.fullName;

  get isAdmin(): boolean {
    return this.authService.isAdmin();
  }

  login(): void {
    this.authService.login();
  }

  register(): void {
    this.authService.register();
  }

  logout(): void {
    this.authService.logout();
  }

  onSearch(query: string): void {
    const trimmed = query.trim();
    if (trimmed) {
      this.router.navigate(['/search'], { queryParams: { q: trimmed } });
    }
  }
}
