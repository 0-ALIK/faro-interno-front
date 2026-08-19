import type { ContentType, LessonType, QuestionType } from './formation.model';

export const LESSON_TYPE_LABELS: Record<LessonType, string> = {
  LESSON: 'Lección',
  ACTIVITY: 'Actividad'
};

export const CONTENT_TYPE_LABELS: Record<ContentType, string> = {
  ARTICLE: 'Artículo',
  VIDEO: 'Video',
  PDF: 'Documento PDF'
};

export const QUESTION_TYPE_LABELS: Record<QuestionType, string> = {
  MULTIPLE_CHOICE: 'Opción múltiple',
  TRUE_FALSE: 'Verdadero / Falso'
};

export function labelOf<T extends string>(labels: Record<T, string>, value: T | null | undefined): string {
  return value ? labels[value] : '—';
}
