import { Routes } from '@angular/router';

export const comparisonRoutes: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./comparison-page/comparison-page.component').then(
        (m) => m.ComparisonPageComponent
      ),
  },
];
