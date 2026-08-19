import type { CourseStatus, FileRef, NamedRef } from '../../catalog/models/catalog.model';

export type LessonType = 'LESSON' | 'ACTIVITY';
export type ContentType = 'ARTICLE' | 'VIDEO' | 'PDF';
export type QuestionType = 'MULTIPLE_CHOICE' | 'TRUE_FALSE';

export interface MunicipalCourseSummary {
  id: string;
  courseId: string;
  courseTitle: string;
  courseCover: FileRef | null;
  courseStatus: CourseStatus;
  moduleCount: number;
  lessonCount: number;
}

export interface Lesson {
  id: string;
  title: string;
  type: LessonType;
  position: number;
  createdBy: string;
}

export interface Module {
  id: string;
  title: string;
  description: string | null;
  position: number;
  hasEvaluation: boolean;
  createdBy: string;
  lessons: Lesson[];
}

export interface MunicipalCourse extends MunicipalCourseSummary {
  modules: Module[];
}

export interface Answer {
  id: string;
  description: string;
  correct: boolean;
}

export interface Question {
  id: string;
  statement: string;
  type: QuestionType;
  answers: Answer[];
}

export interface Evaluation {
  id: string;
  moduleId: string;
  title: string;
  description: string | null;
  minimumScore: number;
  createdBy: string;
  questions: Question[];
}

export interface MainContent {
  type: ContentType;
  article: { id: string; content: string } | null;
  video: FileRef | null;
  documentPdf: FileRef | null;
}

export interface Resource {
  id: string;
  name: string;
  fileName: string;
  fileKey: string;
  fileType: string;
}

export interface LessonDetail {
  id: string;
  moduleId: string;
  title: string;
  description: string | null;
  type: LessonType;
  order: number;
  mainContent: MainContent | null;
  resources: Resource[];
}

export interface Paginated<T> {
  data: T[];
  total: number;
}
