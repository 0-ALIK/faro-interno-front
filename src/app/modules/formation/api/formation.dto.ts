import type { CourseStatusDto } from '../../catalog/api/catalog.dto';

export interface PaginatedDto<T> {
  data: T[];
  pagination: { total: number };
}

export interface IdResponseDto {
  id: string;
}

export interface FileRefDto {
  key: string;
  name: string;
  type: string;
}

export interface MunicipalCourseListItemDto {
  id: string;
  courseId: string;
  courseTitle: string;
  courseCover: FileRefDto | null;
  courseStatus: CourseStatusDto;
  moduleCount: number;
  lessonCount: number;
}

export interface LessonDto {
  id: string;
  title: string;
  type: 'LESSON' | 'ACTIVITY';
  position: number;
  createdBy: string;
}

export interface ModuleDto {
  id: string;
  title: string;
  description: string | null;
  position: number;
  hasEvaluation: boolean;
  createdBy: string;
  lessons: LessonDto[];
}

export interface MunicipalCourseDetailDto extends MunicipalCourseListItemDto {
  modules: ModuleDto[];
}

export interface QuestionAnswerDto {
  id: string;
  description: string;
  correct: boolean;
}

export interface QuestionDto {
  id: string;
  statement: string;
  type: 'MULTIPLE_CHOICE' | 'TRUE_FALSE';
  answers: QuestionAnswerDto[];
}

export interface EvaluationDto {
  id: string;
  moduleId: string;
  title: string;
  description: string | null;
  minimumScore: number;
  createdBy: string;
  questions: QuestionDto[];
}

export interface MainContentDto {
  type: 'ARTICLE' | 'VIDEO' | 'PDF';
  article: { id: string; content: string } | null;
  video: FileRefDto | null;
  documentPdf: FileRefDto | null;
}

export interface ResourceDto {
  id: string;
  name: string;
  fileName: string;
  fileKey: string;
  fileType: string;
}

export interface LessonDetailDto {
  id: string;
  moduleId: string;
  title: string;
  description: string | null;
  type: 'LESSON' | 'ACTIVITY';
  order: number;
  mainContent: MainContentDto | null;
  resources: ResourceDto[];
}

export interface FormationQueryParams {
  page?: number;
  limit?: number;
  search?: string;
  courseId?: string;
}
