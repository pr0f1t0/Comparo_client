import { Routes } from '@angular/router';

export const searchRoutes: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./search-page/search-page.component').then(
        (m) => m.SearchPageComponent
      ),
  },
];
