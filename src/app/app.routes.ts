import { Routes } from '@angular/router';
import { LayoutComponent } from './shared/components/layout/layout.component';
import { authGuard } from './core/guards/auth.guard';
import { adminGuard } from './core/guards/admin.guard';

export const routes: Routes = [
  {
    path: '',
    component: LayoutComponent,
    children: [
      {
        path: '',
        pathMatch: 'full',
        loadChildren: () =>
          import('./features/home/home.routes').then(
            (m) => m.homeRoutes
          ),
      },
      {
        path: 'search',
        loadChildren: () =>
          import('./features/search/search.routes').then(
            (m) => m.searchRoutes
          ),
      },
      {
        path: 'product',
        loadChildren: () =>
          import('./features/product/product.routes').then(
            (m) => m.productRoutes
          ),
      },
      {
        path: 'compare',
        loadChildren: () =>
          import('./features/comparison/comparison.routes').then(
            (m) => m.comparisonRoutes
          ),
      },
      {
        path: 'account',
        canActivate: [authGuard],
        loadChildren: () =>
          import('./features/account/account.routes').then(
            (m) => m.accountRoutes
          ),
      },
      {
        path: 'admin',
        canActivate: [adminGuard],
        loadChildren: () =>
          import('./features/admin/admin.routes').then(
            (m) => m.adminRoutes
          ),
      },
    ],
  },
];
