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
      },
      {
        path: 'formation',
        loadChildren: () => import('./modules/formation/formation.routes').then((m) => m.formationRoutes)
      },
      {
        path: 'culture',
        loadChildren: () => import('./modules/culture/culture.routes').then((m) => m.cultureRoutes)
      }
    ]
  },
  { path: '**', redirectTo: '' }
];