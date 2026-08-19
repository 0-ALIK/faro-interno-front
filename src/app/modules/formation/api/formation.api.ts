import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';

import { apiConfig } from '../../../core/config/api.config';
import type {
  EvaluationDto,
  FormationQueryParams,
  IdResponseDto,
  LessonDetailDto,
  MunicipalCourseDetailDto,
  MunicipalCourseListItemDto,
  PaginatedDto
} from './formation.dto';

@Injectable({ providedIn: 'root' })
export class FormationApi {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = `${apiConfig.baseUrl}/formation`;

  listCourses(params?: FormationQueryParams): Observable<PaginatedDto<MunicipalCourseListItemDto>> {
    return this.http.get<PaginatedDto<MunicipalCourseListItemDto>>(`${this.baseUrl}/courses`, { params: toHttpParams(params) });
  }

  getCourse(id: string): Observable<MunicipalCourseDetailDto> {
    return this.http.get<MunicipalCourseDetailDto>(`${this.baseUrl}/courses/${id}`);
  }

  addModule(courseId: string, body: { title: string; description: string | null; order: number }): Observable<IdResponseDto> {
    return this.http.post<IdResponseDto>(`${this.baseUrl}/courses/${courseId}/modules`, body);
  }

  updateModule(id: string, body: { title: string; description: string | null }): Observable<IdResponseDto> {
    return this.http.patch<IdResponseDto>(`${this.baseUrl}/modules/${id}`, body);
  }

  deleteModule(courseId: string, moduleId: string): Observable<IdResponseDto> {
    return this.http.delete<IdResponseDto>(`${this.baseUrl}/courses/${courseId}/modules/${moduleId}`);
  }

  reorderModule(courseId: string, moduleId: string, newOrder: number): Observable<IdResponseDto> {
    return this.http.patch<IdResponseDto>(`${this.baseUrl}/courses/${courseId}/modules/${moduleId}/order`, { newOrder });
  }

  validateCourse(courseId: string): Observable<IdResponseDto> {
    return this.http.post<IdResponseDto>(`${this.baseUrl}/courses/${courseId}/validate`, {});
  }

  addLesson(moduleId: string, body: { title: string; description: string | null; type: string; order: number }): Observable<IdResponseDto> {
    return this.http.post<IdResponseDto>(`${this.baseUrl}/modules/${moduleId}/lessons`, body);
  }

  getLesson(id: string): Observable<LessonDetailDto> {
    return this.http.get<LessonDetailDto>(`${this.baseUrl}/lessons/${id}`);
  }

  updateLesson(id: string, body: { title: string; description: string | null; type: string }): Observable<IdResponseDto> {
    return this.http.patch<IdResponseDto>(`${this.baseUrl}/lessons/${id}`, body);
  }

  deleteLesson(moduleId: string, lessonId: string): Observable<IdResponseDto> {
    return this.http.delete<IdResponseDto>(`${this.baseUrl}/modules/${moduleId}/lessons/${lessonId}`);
  }

  reorderLesson(moduleId: string, lessonId: string, newOrder: number): Observable<IdResponseDto> {
    return this.http.patch<IdResponseDto>(`${this.baseUrl}/modules/${moduleId}/lessons/${lessonId}/order`, { newOrder });
  }

  assignMainContent(lessonId: string, formData: FormData): Observable<IdResponseDto> {
    return this.http.put<IdResponseDto>(`${this.baseUrl}/lessons/${lessonId}/main-content`, formData);
  }

  updateArticle(lessonId: string, articleId: string, content: string): Observable<IdResponseDto> {
    return this.http.patch<IdResponseDto>(`${this.baseUrl}/lessons/${lessonId}/main-content/article/${articleId}`, { content });
  }

  addResource(lessonId: string, formData: FormData): Observable<IdResponseDto> {
    return this.http.post<IdResponseDto>(`${this.baseUrl}/lessons/${lessonId}/resources`, formData);
  }

  deleteResource(lessonId: string, resourceId: string): Observable<IdResponseDto> {
    return this.http.delete<IdResponseDto>(`${this.baseUrl}/lessons/${lessonId}/resources/${resourceId}`);
  }

  getEvaluation(moduleId: string): Observable<EvaluationDto> {
    return this.http.get<EvaluationDto>(`${this.baseUrl}/modules/${moduleId}/evaluation`);
  }

  createEvaluation(moduleId: string, body: { title: string; description: string | null; minimumScore: number }): Observable<IdResponseDto> {
    return this.http.post<IdResponseDto>(`${this.baseUrl}/modules/${moduleId}/evaluation`, body);
  }

  updateEvaluation(moduleId: string, body: { title: string; description: string | null; minimumScore: number }): Observable<IdResponseDto> {
    return this.http.patch<IdResponseDto>(`${this.baseUrl}/modules/${moduleId}/evaluation`, body);
  }

  addQuestion(moduleId: string, body: { statement: string; type: string; correctAnswer?: string }): Observable<IdResponseDto> {
    return this.http.post<IdResponseDto>(`${this.baseUrl}/modules/${moduleId}/evaluation/questions`, body);
  }

  deleteQuestion(moduleId: string, questionId: string): Observable<IdResponseDto> {
    return this.http.delete<IdResponseDto>(`${this.baseUrl}/modules/${moduleId}/evaluation/questions/${questionId}`);
  }

  updateQuestionStatement(moduleId: string, questionId: string, statement: string): Observable<IdResponseDto> {
    return this.http.patch<IdResponseDto>(`${this.baseUrl}/modules/${moduleId}/evaluation/questions/${questionId}/statement`, { statement });
  }

  updateQuestionType(moduleId: string, questionId: string, type: string): Observable<IdResponseDto> {
    return this.http.patch<IdResponseDto>(`${this.baseUrl}/modules/${moduleId}/evaluation/questions/${questionId}/type`, { type });
  }

  addAnswer(moduleId: string, questionId: string, body: { description: string; correct: boolean }): Observable<IdResponseDto> {
    return this.http.post<IdResponseDto>(`${this.baseUrl}/modules/${moduleId}/evaluation/questions/${questionId}/answers`, body);
  }

  deleteAnswer(moduleId: string, questionId: string, answerId: string): Observable<IdResponseDto> {
    return this.http.delete<IdResponseDto>(`${this.baseUrl}/modules/${moduleId}/evaluation/questions/${questionId}/answers/${answerId}`);
  }

  setCorrectAnswer(moduleId: string, questionId: string, answerId: string): Observable<IdResponseDto> {
    return this.http.patch<IdResponseDto>(`${this.baseUrl}/modules/${moduleId}/evaluation/questions/${questionId}/correct-answer`, { answerId });
  }
}

function toHttpParams(params?: FormationQueryParams): HttpParams {
  let httpParams = new HttpParams();
  if (!params) return httpParams;
  if (params.page != null) httpParams = httpParams.set('page', String(params.page));
  if (params.limit != null) httpParams = httpParams.set('limit', String(params.limit));
  if (params.search) httpParams = httpParams.set('search', params.search);
  if (params.courseId) httpParams = httpParams.set('courseId', params.courseId);
  return httpParams;
}
