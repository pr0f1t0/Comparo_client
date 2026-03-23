import { Routes } from '@angular/router';

export const accountRoutes: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./account-shell/account-shell.component').then(
        (m) => m.AccountShellComponent
      ),
    children: [
      {
        path: 'settings',
        loadComponent: () =>
          import('./settings/settings.component').then(
            (m) => m.SettingsComponent
          ),
      },
      {
        path: 'lists',
        loadComponent: () =>
          import('./saved-lists/saved-lists.component').then(
            (m) => m.SavedListsComponent
          ),
      },
      {
        path: 'lists/:id',
        loadComponent: () =>
          import('./saved-lists/list-detail.component').then(
            (m) => m.ListDetailComponent
          ),
      },
      {
        path: 'favorites',
        loadComponent: () =>
          import('./favorites/favorites.component').then(
            (m) => m.FavoritesComponent
          ),
      },
      {
        path: '',
        pathMatch: 'full',
        redirectTo: 'settings',
      },
    ],
  },
];
