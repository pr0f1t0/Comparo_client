import { Routes } from '@angular/router';
import { AdminLayoutComponent } from './layout/admin-layout.component';
import { AdminDashboardComponent } from './dashboard/admin-dashboard.component';
import { AdminUsersComponent } from './users/admin-users.component';
import { AdminReviewsComponent } from './reviews/admin-reviews.component';
import { AdminProductsComponent } from './products/admin-products.component';
import { AdminOffersComponent } from './offers/admin-offers.component';

export const adminRoutes: Routes = [
  {
    path: '',
    component: AdminLayoutComponent,
    children: [
      { path: '', component: AdminDashboardComponent },
      { path: 'users', component: AdminUsersComponent },
      { path: 'reviews', component: AdminReviewsComponent },
      { path: 'products', component: AdminProductsComponent },
      { path: 'offers', component: AdminOffersComponent },
    ],
  },
];
