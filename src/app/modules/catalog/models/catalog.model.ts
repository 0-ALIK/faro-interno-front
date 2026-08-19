export type CourseStatus = 'DRAFT' | 'UNDER_REVIEW' | 'PUBLISHED' | 'SUSPENDED' | 'ARCHIVED';
export type CourseModality = 'VIRTUAL' | 'IN_PERSON' | 'HYBRID';
export type CourseLevel = 'BASIC' | 'INTERMEDIATE' | 'ADVANCED';
export type CourseOrigin = 'MUNICIPAL' | 'EXTERNAL';
export type EnrollmentMode = 'OPEN' | 'SCHOLARSHIP_ONLY';
export type ProviderType =
  | 'EDUCATIONAL_INSTITUTION'
  | 'PRIVATE_COMPANY'
  | 'NGO'
  | 'GOVERNMENT'
  | 'DIGITAL_PLATFORM';

export interface FileRef {
  key: string;
  name: string;
  type: string;
}

export interface NamedRef {
  id: string;
  name: string;
}

export interface Category extends NamedRef {}

export interface Competency extends NamedRef {}

export interface Tag extends NamedRef {}

export interface Provider extends NamedRef {
  type: ProviderType;
}

export interface StateHistoryEntry {
  id: string;
  official: { id: string; name: string; lastName: string; photo: string | null };
  from: CourseStatus | null;
  to: CourseStatus;
  date: string;
  time: string;
}

export interface Paginated<T> {
  data: T[];
  total: number;
}