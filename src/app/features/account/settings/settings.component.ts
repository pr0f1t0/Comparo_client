import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { UserService } from '../../../shared/services/user.service';
import { UserProfileResponse } from '../../../shared/models/user.model';
import { AuthService } from '../../../core/auth/auth.service';

@Component({
  selector: 'app-settings',
  standalone: true,
  imports: [CommonModule, FormsModule, MatIconModule, MatButtonModule, MatProgressSpinnerModule],
  templateUrl: './settings.component.html',
  styleUrl: './settings.component.scss',
})
export class SettingsComponent implements OnInit {
  private readonly userService = inject(UserService);
  private readonly authService = inject(AuthService);

  loading = signal(true);
  saving = signal(false);
  profile = signal<UserProfileResponse | null>(null);

  firstName = '';
  lastName = '';
  email = '';

  ngOnInit(): void {
    this.userService.getProfile().subscribe({
      next: (data) => {
        this.profile.set(data);
        this.firstName = data.firstName;
        this.lastName = data.lastName;
        this.email = data.email;
        this.loading.set(false);
      },
      error: () => this.loading.set(false),
    });
  }

  save(): void {
    this.saving.set(true);
    this.userService
      .updateProfile({ firstName: this.firstName, lastName: this.lastName })
      .subscribe({
        next: (data) => {
          this.profile.set(data);
          this.authService.updateDisplayName(data.firstName, data.lastName);
          this.saving.set(false);
        },
        error: () => this.saving.set(false),
      });
  }
}
