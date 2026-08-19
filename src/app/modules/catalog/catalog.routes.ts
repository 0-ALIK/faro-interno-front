import { Routes } from '@angular/router';

export const catalogRoutes: Routes = [
  { path: '', redirectTo: 'courses', pathMatch: 'full' },
  {
    path: 'courses',
    loadComponent: () => import('./ui/pages/course-list').then((m) => m.CourseList)
  },
  {
    path: 'courses/new',
    loadComponent: () => import('./ui/pages/course-form').then((m) => m.CourseForm)
  },
  {
    path: 'courses/:id',
    loadComponent: () => import('./ui/pages/course-detail').then((m) => m.CourseDetail)
  },
  {
    path: 'courses/:id/edit',
    loadComponent: () => import('./ui/pages/course-form').then((m) => m.CourseForm)
  },
  {
    path: 'categories',
    loadComponent: () => import('./ui/pages/category-list').then((m) => m.CategoryList)
  },
  {
    path: 'providers',
    loadComponent: () => import('./ui/pages/provider-list').then((m) => m.ProviderList)
  },
  {
    path: 'competencies',
    loadComponent: () => import('./ui/pages/competency-list').then((m) => m.CompetencyList)
  },
  {
    path: 'tags',
    loadComponent: () => import('./ui/pages/tag-list').then((m) => m.TagList)
  }
];