import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';

import { apiConfig } from '../../../core/config/api.config';
import type {
  CategoryDetailDto,
  CategoryDto,
  CatalogQueryParams,
  CompetencyDetailDto,
  CompetencyDto,
  CourseDetailDto,
  CourseListItemDto,
  IdResponseDto,
  PaginatedDto,
  ProviderDetailDto,
  ProviderDto,
  TagDetailDto,
  TagDto
} from './catalog.dto';

@Injectable({ providedIn: 'root' })
export class CatalogApi {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = `${apiConfig.baseUrl}/catalog`;

  listCategories(params?: CatalogQueryParams): Observable<PaginatedDto<CategoryDto>> {
    return this.http.get<PaginatedDto<CategoryDto>>(`${this.baseUrl}/categories`, { params: toHttpParams(params) });
  }

  getCategory(id: string): Observable<CategoryDetailDto> {
    return this.http.get<CategoryDetailDto>(`${this.baseUrl}/categories/${id}`);
  }

  createCategory(name: string): Observable<IdResponseDto> {
    return this.http.post<IdResponseDto>(`${this.baseUrl}/categories`, { name });
  }

  renameCategory(id: string, name: string): Observable<IdResponseDto> {
    return this.http.patch<IdResponseDto>(`${this.baseUrl}/categories/${id}`, { name });
  }

  listProviders(params?: CatalogQueryParams): Observable<PaginatedDto<ProviderDto>> {
    return this.http.get<PaginatedDto<ProviderDto>>(`${this.baseUrl}/providers`, { params: toHttpParams(params) });
  }

  getProvider(id: string): Observable<ProviderDetailDto> {
    return this.http.get<ProviderDetailDto>(`${this.baseUrl}/providers/${id}`);
  }

  createProvider(name: string, type: ProviderDto['type']): Observable<IdResponseDto> {
    return this.http.post<IdResponseDto>(`${this.baseUrl}/providers`, { name, type });
  }

  renameProvider(id: string, name: string): Observable<IdResponseDto> {
    return this.http.patch<IdResponseDto>(`${this.baseUrl}/providers/${id}`, { name });
  }

  changeProviderType(id: string, type: ProviderDto['type']): Observable<IdResponseDto> {
    return this.http.patch<IdResponseDto>(`${this.baseUrl}/providers/${id}/type`, { type });
  }

  listCompetencies(params?: CatalogQueryParams): Observable<PaginatedDto<CompetencyDto>> {
    return this.http.get<PaginatedDto<CompetencyDto>>(`${this.baseUrl}/competencies`, { params: toHttpParams(params) });
  }

  getCompetency(id: string): Observable<CompetencyDetailDto> {
    return this.http.get<CompetencyDetailDto>(`${this.baseUrl}/competencies/${id}`);
  }

  createCompetency(name: string): Observable<IdResponseDto> {
    return this.http.post<IdResponseDto>(`${this.baseUrl}/competencies`, { name });
  }

  renameCompetency(id: string, name: string): Observable<IdResponseDto> {
    return this.http.patch<IdResponseDto>(`${this.baseUrl}/competencies/${id}`, { name });
  }

  listTags(params?: CatalogQueryParams): Observable<PaginatedDto<TagDto>> {
    return this.http.get<PaginatedDto<TagDto>>(`${this.baseUrl}/tags`, { params: toHttpParams(params) });
  }

  getTag(id: string): Observable<TagDetailDto> {
    return this.http.get<TagDetailDto>(`${this.baseUrl}/tags/${id}`);
  }

  createTag(name: string): Observable<IdResponseDto> {
    return this.http.post<IdResponseDto>(`${this.baseUrl}/tags`, { name });
  }

  renameTag(id: string, name: string): Observable<IdResponseDto> {
    return this.http.patch<IdResponseDto>(`${this.baseUrl}/tags/${id}`, { name });
  }

  listCourses(params?: CatalogQueryParams): Observable<PaginatedDto<CourseListItemDto>> {
    return this.http.get<PaginatedDto<CourseListItemDto>>(`${this.baseUrl}/courses`, { params: toHttpParams(params) });
  }

  getCourse(id: string): Observable<CourseDetailDto> {
    return this.http.get<CourseDetailDto>(`${this.baseUrl}/courses/${id}`);
  }

  createCourse(formData: FormData): Observable<IdResponseDto> {
    return this.http.post<IdResponseDto>(`${this.baseUrl}/courses`, formData);
  }

  updateCourse(id: string, patch: Partial<CourseDetailDto>): Observable<IdResponseDto> {
    return this.http.patch<IdResponseDto>(`${this.baseUrl}/courses/${id}`, patch);
  }

  updateCourseCover(id: string, formData: FormData): Observable<IdResponseDto> {
    return this.http.patch<IdResponseDto>(`${this.baseUrl}/courses/${id}/cover`, formData);
  }

  submitForReview(id: string): Observable<IdResponseDto> {
    return this.http.post<IdResponseDto>(`${this.baseUrl}/courses/${id}/submit-review`, {});
  }

  returnToDraft(id: string): Observable<IdResponseDto> {
    return this.http.post<IdResponseDto>(`${this.baseUrl}/courses/${id}/return-draft`, {});
  }

  publish(id: string): Observable<IdResponseDto> {
    return this.http.post<IdResponseDto>(`${this.baseUrl}/courses/${id}/publish`, {});
  }

  suspend(id: string): Observable<IdResponseDto> {
    return this.http.post<IdResponseDto>(`${this.baseUrl}/courses/${id}/suspend`, {});
  }

  archive(id: string): Observable<IdResponseDto> {
    return this.http.post<IdResponseDto>(`${this.baseUrl}/courses/${id}/archive`, {});
  }

  resubmitForReview(id: string): Observable<IdResponseDto> {
    return this.http.post<IdResponseDto>(`${this.baseUrl}/courses/${id}/resubmit-review`, {});
  }

  assignCategory(id: string, categoryId: string): Observable<IdResponseDto> {
    return this.http.patch<IdResponseDto>(`${this.baseUrl}/courses/${id}/category`, { categoryId });
  }

  assignProvider(id: string, providerId: string): Observable<IdResponseDto> {
    return this.http.patch<IdResponseDto>(`${this.baseUrl}/courses/${id}/provider`, { providerId });
  }

  updateDuration(id: string, hours: number): Observable<IdResponseDto> {
    return this.http.patch<IdResponseDto>(`${this.baseUrl}/courses/${id}/duration`, { hours });
  }

  addCompetencies(id: string, competencyIds: string[]): Observable<IdResponseDto> {
    return this.http.post<IdResponseDto>(`${this.baseUrl}/courses/${id}/competencies`, { competencyIds });
  }

  removeCompetencies(id: string, competencyIds: string[]): Observable<IdResponseDto> {
    return this.http.delete<IdResponseDto>(`${this.baseUrl}/courses/${id}/competencies`, { body: { competencyIds } });
  }

  addTags(id: string, tagIds: string[]): Observable<IdResponseDto> {
    return this.http.post<IdResponseDto>(`${this.baseUrl}/courses/${id}/tags`, { tagIds });
  }

  removeTags(id: string, tagIds: string[]): Observable<IdResponseDto> {
    return this.http.delete<IdResponseDto>(`${this.baseUrl}/courses/${id}/tags`, { body: { tagIds } });
  }
}

function toHttpParams(params?: CatalogQueryParams): HttpParams {
  let httpParams = new HttpParams();
  if (!params) {
    return httpParams;
  }

  if (params.page != null) {
    httpParams = httpParams.set('page', String(params.page));
  }
  if (params.limit != null) {
    httpParams = httpParams.set('limit', String(params.limit));
  }
  if (params.search) {
    httpParams = httpParams.set('search', params.search);
  }
  for (const id of params.categoryIds ?? []) {
    httpParams = httpParams.append('categoryIds', id);
  }
  for (const id of params.providerIds ?? []) {
    httpParams = httpParams.append('providerIds', id);
  }
  for (const id of params.competencyIds ?? []) {
    httpParams = httpParams.append('competencyIds', id);
  }
  for (const id of params.tagIds ?? []) {
    httpParams = httpParams.append('tagIds', id);
  }
  for (const status of params.statuses ?? []) {
    httpParams = httpParams.append('statuses', status);
  }
  return httpParams;
}