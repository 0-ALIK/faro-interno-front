import type {
  CourseLevel,
  CourseModality,
  CourseOrigin,
  CourseStatus,
  EnrollmentMode,
  FileRef,
  NamedRef,
  Provider,
  StateHistoryEntry
} from './catalog.model';

export interface CourseSummary {
  id: string;
  title: string;
  modality: CourseModality | null;
  level: CourseLevel | null;
  origin: CourseOrigin | null;
  status: CourseStatus;
  enrollmentMode: EnrollmentMode;
  durationHours: number | null;
  cover: FileRef | null;
  publishedAt: string | null;
}

export interface Course extends CourseSummary {
  description: string | null;
  category: NamedRef | null;
  provider: Provider | null;
  competencies: NamedRef[];
  tags: NamedRef[];
  createdBy: string | null;
  stateHistory: StateHistoryEntry[];
  createdAt: string;
  updatedAt: string;
}