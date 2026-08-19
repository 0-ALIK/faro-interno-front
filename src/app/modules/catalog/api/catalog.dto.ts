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

export interface CategoryDto {
  id: string;
  name: string;
}

export interface CategoryDetailDto extends CategoryDto {
  createdAt: string;
  updatedAt: string;
}

export type ProviderTypeDto =
  | 'EDUCATIONAL_INSTITUTION'
  | 'PRIVATE_COMPANY'
  | 'NGO'
  | 'GOVERNMENT'
  | 'DIGITAL_PLATFORM';

export interface ProviderDto {
  id: string;
  name: string;
  type: ProviderTypeDto;
}

export interface ProviderDetailDto extends ProviderDto {
  createdAt: string;
  updatedAt: string;
}

export interface CompetencyDto {
  id: string;
  name: string;
}

export interface CompetencyDetailDto extends CompetencyDto {
  createdAt: string;
  updatedAt: string;
}

export interface TagDto {
  id: string;
  name: string;
}

export interface TagDetailDto extends TagDto {
  createdAt: string;
  updatedAt: string;
}

export type CourseModalityDto = 'VIRTUAL' | 'IN_PERSON' | 'HYBRID';
export type CourseLevelDto = 'BASIC' | 'INTERMEDIATE' | 'ADVANCED';
export type CourseOriginDto = 'MUNICIPAL' | 'EXTERNAL';
export type CourseStatusDto = 'DRAFT' | 'UNDER_REVIEW' | 'PUBLISHED' | 'SUSPENDED' | 'ARCHIVED';
export type EnrollmentModeDto = 'OPEN' | 'SCHOLARSHIP_ONLY';

export interface CourseListItemDto {
  id: string;
  title: string;
  modality: CourseModalityDto | null;
  level: CourseLevelDto | null;
  origin: CourseOriginDto | null;
  status: CourseStatusDto;
  enrollmentMode: EnrollmentModeDto;
  durationHours: number | null;
  cover: FileRefDto | null;
  publishedAt: string | null;
}

export interface StateHistoryEntryDto {
  id: string;
  official: { id: string; name: string; lastName: string; photo: string | null };
  from: CourseStatusDto | null;
  to: CourseStatusDto;
  date: string;
  time: string;
}

export interface CourseDetailDto extends CourseListItemDto {
  description: string | null;
  category: CategoryDto | null;
  provider: ProviderDto | null;
  competencies: CompetencyDto[];
  tags: TagDto[];
  createdBy: string | null;
  stateHistory: StateHistoryEntryDto[];
  createdAt: string;
  updatedAt: string;
}

export interface CatalogQueryParams {
  page?: number;
  limit?: number;
  search?: string;
  categoryIds?: string[];
  providerIds?: string[];
  competencyIds?: string[];
  tagIds?: string[];
  statuses?: CourseStatusDto[];
}