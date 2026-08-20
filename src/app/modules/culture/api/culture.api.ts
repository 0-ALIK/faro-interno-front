import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable, map } from 'rxjs';

import { apiConfig } from '../../../core/config/api.config';
import type {
  ActivityLibraryItemDto,
  ActivityLibraryQueryParams,
  CatalogItemDto,
  CatalogQueryParams,
  CreateActivityLibraryDto,
  CreateCatalogDto,
  CreateEventDto,
  CreateLibraryDto,
  EventDetailDto,
  EventListItemDto,
  EventQueryParams,
  IdResponseDto,
  LibraryDetailDto,
  LibraryListItemDto,
  LibraryLocationDto,
  LibraryQueryParams,
  PaginatedDto,
  SuccessResponseDto,
  UpdateEventDto,
  UpdateLibraryDirectionDto,
  UpdateLibraryInfoDto,
  UpdateScheduleDto
} from './culture.dto';

@Injectable({ providedIn: 'root' })
export class CultureApi {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = `${apiConfig.baseUrl}/culture`;

  listLibraries(params?: LibraryQueryParams): Observable<PaginatedDto<LibraryListItemDto>> {
    return this.http.get<PaginatedDto<LibraryListItemDto>>(`${this.baseUrl}/libraries`, { params: toHttpParams(params) });
  }

  getLibrary(id: string): Observable<LibraryDetailDto> {
    return this.http.get<LibraryDetailDto>(`${this.baseUrl}/libraries/${id}`);
  }

  createLibrary(dto: CreateLibraryDto): Observable<IdResponseDto> {
    return this.http.post<IdResponseDto>(`${this.baseUrl}/libraries`, dto);
  }

  deleteLibrary(id: string): Observable<SuccessResponseDto> {
    return this.http.delete<SuccessResponseDto>(`${this.baseUrl}/libraries/${id}`);
  }

  updateInfo(id: string, dto: UpdateLibraryInfoDto): Observable<IdResponseDto> {
    return this.http.patch<IdResponseDto>(`${this.baseUrl}/libraries/${id}/info`, dto);
  }

  updateDirection(id: string, dto: UpdateLibraryDirectionDto): Observable<IdResponseDto> {
    return this.http.patch<IdResponseDto>(`${this.baseUrl}/libraries/${id}/direction`, dto);
  }

  updateSchedule(id: string, schedule: UpdateScheduleDto): Observable<IdResponseDto> {
    return this.http.patch<IdResponseDto>(`${this.baseUrl}/libraries/${id}/schedule`, schedule);
  }

  activate(id: string): Observable<IdResponseDto> {
    return this.http.post<IdResponseDto>(`${this.baseUrl}/libraries/${id}/activate`, {});
  }

  deactivate(id: string): Observable<IdResponseDto> {
    return this.http.post<IdResponseDto>(`${this.baseUrl}/libraries/${id}/deactivate`, {});
  }

  standout(id: string): Observable<IdResponseDto> {
    return this.http.post<IdResponseDto>(`${this.baseUrl}/libraries/${id}/standout`, {});
  }

  addActivity(id: string, activityId: string): Observable<IdResponseDto> {
    return this.http.post<IdResponseDto>(`${this.baseUrl}/libraries/${id}/activities`, { activityId });
  }

  removeActivity(id: string, activityId: string): Observable<IdResponseDto> {
    return this.http.delete<IdResponseDto>(`${this.baseUrl}/libraries/${id}/activities/${activityId}`);
  }

  addService(id: string, serviceId: string): Observable<IdResponseDto> {
    return this.http.post<IdResponseDto>(`${this.baseUrl}/libraries/${id}/services`, { serviceId });
  }

  removeService(id: string, serviceId: string): Observable<IdResponseDto> {
    return this.http.delete<IdResponseDto>(`${this.baseUrl}/libraries/${id}/services/${serviceId}`);
  }

  addPicture(id: string, formData: FormData): Observable<IdResponseDto> {
    return this.http.post<IdResponseDto>(`${this.baseUrl}/libraries/${id}/pictures`, formData);
  }

  removePicture(id: string, key: string): Observable<IdResponseDto> {
    return this.http.delete<IdResponseDto>(`${this.baseUrl}/libraries/${id}/pictures/${key}`);
  }

  getLocations(): Observable<LibraryLocationDto[]> {
    return this.http.get<LibraryLocationDto[] | { data: LibraryLocationDto[] }>(`${this.baseUrl}/libraries/locations`).pipe(
      map((res) => Array.isArray(res) ? res : res.data)
    );
  }

  listEvents(params?: EventQueryParams): Observable<PaginatedDto<EventListItemDto>> {
    return this.http.get<PaginatedDto<EventListItemDto>>(`${this.baseUrl}/events`, { params: toEventHttpParams(params) });
  }

  getEvent(id: string): Observable<EventDetailDto> {
    return this.http.get<EventDetailDto>(`${this.baseUrl}/events/${id}`);
  }

  createEvent(dto: CreateEventDto): Observable<IdResponseDto> {
    return this.http.post<IdResponseDto>(`${this.baseUrl}/events`, dto);
  }

  updateEvent(id: string, dto: UpdateEventDto): Observable<IdResponseDto> {
    return this.http.patch<IdResponseDto>(`${this.baseUrl}/events/${id}`, dto);
  }

  deleteEvent(id: string): Observable<SuccessResponseDto> {
    return this.http.delete<SuccessResponseDto>(`${this.baseUrl}/events/${id}`);
  }

  changePicture(id: string, formData: FormData): Observable<IdResponseDto> {
    return this.http.patch<IdResponseDto>(`${this.baseUrl}/events/${id}/picture`, formData);
  }

  listTypeLibraries(params?: CatalogQueryParams): Observable<PaginatedDto<CatalogItemDto>> {
    return this.http.get<PaginatedDto<CatalogItemDto>>(`${this.baseUrl}/type-libraries`, { params: toCatalogHttpParams(params) });
  }

  getTypeLibrary(id: string): Observable<CatalogItemDto> {
    return this.http.get<CatalogItemDto>(`${this.baseUrl}/type-libraries/${id}`);
  }

  createTypeLibrary(dto: CreateCatalogDto): Observable<IdResponseDto> {
    return this.http.post<IdResponseDto>(`${this.baseUrl}/type-libraries`, dto);
  }

  renameTypeLibrary(id: string, name: string): Observable<IdResponseDto> {
    return this.http.patch<IdResponseDto>(`${this.baseUrl}/type-libraries/${id}`, { name });
  }

  deleteTypeLibrary(id: string): Observable<SuccessResponseDto> {
    return this.http.delete<SuccessResponseDto>(`${this.baseUrl}/type-libraries/${id}`);
  }

  listTypeEvents(params?: CatalogQueryParams): Observable<PaginatedDto<CatalogItemDto>> {
    return this.http.get<PaginatedDto<CatalogItemDto>>(`${this.baseUrl}/type-events`, { params: toCatalogHttpParams(params) });
  }

  getTypeEvent(id: string): Observable<CatalogItemDto> {
    return this.http.get<CatalogItemDto>(`${this.baseUrl}/type-events/${id}`);
  }

  createTypeEvent(dto: CreateCatalogDto): Observable<IdResponseDto> {
    return this.http.post<IdResponseDto>(`${this.baseUrl}/type-events`, dto);
  }

  renameTypeEvent(id: string, name: string): Observable<IdResponseDto> {
    return this.http.patch<IdResponseDto>(`${this.baseUrl}/type-events/${id}`, { name });
  }

  deleteTypeEvent(id: string): Observable<SuccessResponseDto> {
    return this.http.delete<SuccessResponseDto>(`${this.baseUrl}/type-events/${id}`);
  }

  listCategoryActivities(params?: CatalogQueryParams): Observable<PaginatedDto<CatalogItemDto>> {
    return this.http.get<PaginatedDto<CatalogItemDto>>(`${this.baseUrl}/category-activities`, { params: toCatalogHttpParams(params) });
  }

  getCategoryActivity(id: string): Observable<CatalogItemDto> {
    return this.http.get<CatalogItemDto>(`${this.baseUrl}/category-activities/${id}`);
  }

  createCategoryActivity(dto: CreateCatalogDto): Observable<IdResponseDto> {
    return this.http.post<IdResponseDto>(`${this.baseUrl}/category-activities`, dto);
  }

  renameCategoryActivity(id: string, name: string): Observable<IdResponseDto> {
    return this.http.patch<IdResponseDto>(`${this.baseUrl}/category-activities/${id}`, { name });
  }

  deleteCategoryActivity(id: string): Observable<SuccessResponseDto> {
    return this.http.delete<SuccessResponseDto>(`${this.baseUrl}/category-activities/${id}`);
  }

  listServiceLibraries(params?: CatalogQueryParams): Observable<PaginatedDto<CatalogItemDto>> {
    return this.http.get<PaginatedDto<CatalogItemDto>>(`${this.baseUrl}/service-libraries`, { params: toCatalogHttpParams(params) });
  }

  getServiceLibrary(id: string): Observable<CatalogItemDto> {
    return this.http.get<CatalogItemDto>(`${this.baseUrl}/service-libraries/${id}`);
  }

  createServiceLibrary(dto: CreateCatalogDto): Observable<IdResponseDto> {
    return this.http.post<IdResponseDto>(`${this.baseUrl}/service-libraries`, dto);
  }

  renameServiceLibrary(id: string, name: string): Observable<IdResponseDto> {
    return this.http.patch<IdResponseDto>(`${this.baseUrl}/service-libraries/${id}`, { name });
  }

  deleteServiceLibrary(id: string): Observable<SuccessResponseDto> {
    return this.http.delete<SuccessResponseDto>(`${this.baseUrl}/service-libraries/${id}`);
  }

  listCorregimientos(params?: CatalogQueryParams): Observable<PaginatedDto<CatalogItemDto>> {
    return this.http.get<PaginatedDto<CatalogItemDto>>(`${this.baseUrl}/corregimientos`, { params: toCatalogHttpParams(params) });
  }

  getCorregimiento(id: string): Observable<CatalogItemDto> {
    return this.http.get<CatalogItemDto>(`${this.baseUrl}/corregimientos/${id}`);
  }

  createCorregimiento(dto: CreateCatalogDto): Observable<IdResponseDto> {
    return this.http.post<IdResponseDto>(`${this.baseUrl}/corregimientos`, dto);
  }

  deleteCorregimiento(id: string): Observable<SuccessResponseDto> {
    return this.http.delete<SuccessResponseDto>(`${this.baseUrl}/corregimientos/${id}`);
  }

  listActivityLibraries(params?: ActivityLibraryQueryParams): Observable<PaginatedDto<ActivityLibraryItemDto>> {
    return this.http.get<PaginatedDto<ActivityLibraryItemDto>>(`${this.baseUrl}/activity-libraries`, { params: toActivityHttpParams(params) });
  }

  getActivityLibrary(id: string): Observable<ActivityLibraryItemDto> {
    return this.http.get<ActivityLibraryItemDto>(`${this.baseUrl}/activity-libraries/${id}`);
  }

  createActivityLibrary(dto: CreateActivityLibraryDto): Observable<IdResponseDto> {
    return this.http.post<IdResponseDto>(`${this.baseUrl}/activity-libraries`, dto);
  }

  deleteActivityLibrary(id: string): Observable<SuccessResponseDto> {
    return this.http.delete<SuccessResponseDto>(`${this.baseUrl}/activity-libraries/${id}`);
  }
}

function toHttpParams(params?: LibraryQueryParams): HttpParams {
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
  if (params.name) {
    httpParams = httpParams.set('name', params.name);
  }
  if (params.typeId) {
    httpParams = httpParams.set('typeId', params.typeId);
  }
  if (params.corregimientoId) {
    httpParams = httpParams.set('corregimientoId', params.corregimientoId);
  }
  if (params.status) {
    httpParams = httpParams.set('status', params.status);
  }
  if (params.zone) {
    httpParams = httpParams.set('zone', params.zone);
  }
  if (params.activityId) {
    httpParams = httpParams.set('activityId', params.activityId);
  }
  if (params.serviceId) {
    httpParams = httpParams.set('serviceId', params.serviceId);
  }
  if (params.open != null) {
    httpParams = httpParams.set('open', String(params.open));
  }
  return httpParams;
}

function toEventHttpParams(params?: EventQueryParams): HttpParams {
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
  if (params.name) {
    httpParams = httpParams.set('name', params.name);
  }
  if (params.typeId) {
    httpParams = httpParams.set('typeId', params.typeId);
  }
  if (params.libraryId) {
    httpParams = httpParams.set('libraryId', params.libraryId);
  }
  return httpParams;
}

function toCatalogHttpParams(params?: CatalogQueryParams): HttpParams {
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
  if (params.name) {
    httpParams = httpParams.set('name', params.name);
  }
  return httpParams;
}

function toActivityHttpParams(params?: ActivityLibraryQueryParams): HttpParams {
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
  if (params.name) {
    httpParams = httpParams.set('name', params.name);
  }
  if (params.categoryId) {
    httpParams = httpParams.set('categoryId', params.categoryId);
  }
  return httpParams;
}
