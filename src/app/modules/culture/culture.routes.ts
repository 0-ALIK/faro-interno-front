import { Routes } from '@angular/router';

export const cultureRoutes: Routes = [
  { path: '', redirectTo: 'bibliotecas', pathMatch: 'full' },
  {
    path: 'bibliotecas',
    loadComponent: () => import('./ui/pages/bibliotecas-list').then((m) => m.BibliotecasList)
  },
  {
    path: 'bibliotecas/:id',
    loadComponent: () => import('./ui/pages/biblioteca-detail').then((m) => m.BibliotecaDetail)
  },
  {
    path: 'eventos',
    loadComponent: () => import('./ui/pages/eventos-list').then((m) => m.EventosList)
  },
  {
    path: 'mapa',
    loadComponent: () => import('./ui/pages/puntos-mapa').then((m) => m.PuntosMapa)
  },
  {
    path: 'tipo-bibliotecas',
    loadComponent: () => import('./ui/pages/type-libraries-list').then((m) => m.TypeLibrariesList)
  },
  {
    path: 'tipo-eventos',
    loadComponent: () => import('./ui/pages/type-events-list').then((m) => m.TypeEventsList)
  },
  {
    path: 'categorias-actividades',
    loadComponent: () => import('./ui/pages/category-activities-list').then((m) => m.CategoryActivitiesList)
  },
  {
    path: 'servicios',
    loadComponent: () => import('./ui/pages/service-libraries-list').then((m) => m.ServiceLibrariesList)
  },
  {
    path: 'corregimientos',
    loadComponent: () => import('./ui/pages/corregimientos-list').then((m) => m.CorregimientosList)
  },
  {
    path: 'actividades',
    loadComponent: () => import('./ui/pages/activity-libraries-list').then((m) => m.ActivityLibrariesList)
  }
];
