import { Routes } from '@angular/router';

export const formationRoutes: Routes = [
  { path: '', redirectTo: 'courses', pathMatch: 'full' },
  {
    path: 'courses',
    loadComponent: () => import('./ui/pages/formation-course-list').then((m) => m.FormationCourseList)
  },
  {
    path: 'courses/:id',
    loadComponent: () => import('./ui/pages/formation-course-detail').then((m) => m.FormationCourseDetail)
  },
  {
    path: 'courses/:courseId/modules/:moduleId/evaluation',
    loadComponent: () => import('./ui/pages/evaluation-page').then((m) => m.EvaluationPage)
  },
  {
    path: 'lessons/:id',
    loadComponent: () => import('./ui/pages/lesson-editor').then((m) => m.LessonEditor)
  }
];
