import { Routes } from '@angular/router';

import { AppShell } from './core/layout/app-shell';

export const routes: Routes = [
  {
    path: '',
    component: AppShell,
    children: [
      { path: '', redirectTo: 'catalog/courses', pathMatch: 'full' },
      {
        path: 'catalog',
        loadChildren: () => import('./modules/catalog/catalog.routes').then((m) => m.catalogRoutes)
      }
    ]
  },
  { path: '**', redirectTo: '' }
];