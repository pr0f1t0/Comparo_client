import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-admin-layout',
  standalone: true,
  imports: [CommonModule, RouterModule, MatIconModule],
  templateUrl: './admin-layout.component.html',
  styleUrl: './admin-layout.component.scss',
})
export class AdminLayoutComponent {
  navItems = [
    { path: '/admin', label: 'Dashboard', icon: 'dashboard', exact: true },
    { path: '/admin/users', label: 'Users', icon: 'people' },
    { path: '/admin/reviews', label: 'Reviews', icon: 'rate_review' },
    { path: '/admin/products', label: 'Products', icon: 'inventory_2' },
    { path: '/admin/offers', label: 'Offers', icon: 'local_offer' },
  ];
}
