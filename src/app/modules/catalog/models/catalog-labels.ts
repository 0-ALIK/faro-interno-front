import type {
  CourseLevel,
  CourseModality,
  CourseOrigin,
  CourseStatus,
  EnrollmentMode,
  ProviderType
} from './catalog.model';

export const COURSE_STATUS_LABELS: Record<CourseStatus, string> = {
  DRAFT: 'Borrador',
  UNDER_REVIEW: 'En revisión',
  PUBLISHED: 'Publicado',
  SUSPENDED: 'Suspendido',
  ARCHIVED: 'Archivado'
};

export const COURSE_MODALITY_LABELS: Record<CourseModality, string> = {
  VIRTUAL: 'Virtual',
  IN_PERSON: 'Presencial',
  HYBRID: 'Híbrido'
};

export const COURSE_LEVEL_LABELS: Record<CourseLevel, string> = {
  BASIC: 'Básico',
  INTERMEDIATE: 'Intermedio',
  ADVANCED: 'Avanzado'
};

export const COURSE_ORIGIN_LABELS: Record<CourseOrigin, string> = {
  MUNICIPAL: 'Municipal',
  EXTERNAL: 'Externo'
};

export const ENROLLMENT_MODE_LABELS: Record<EnrollmentMode, string> = {
  OPEN: 'Inscripción abierta',
  SCHOLARSHIP_ONLY: 'Solo becas'
};

export const PROVIDER_TYPE_LABELS: Record<ProviderType, string> = {
  EDUCATIONAL_INSTITUTION: 'Institución educativa',
  PRIVATE_COMPANY: 'Empresa privada',
  NGO: 'ONG',
  GOVERNMENT: 'Gobierno',
  DIGITAL_PLATFORM: 'Plataforma digital'
};

export interface LifecycleAction {
  label: string;
  icon: string;
  severity: string;
  action: string;
}

const LIFECYCLE_MAP: Record<CourseStatus, LifecycleAction[]> = {
  DRAFT: [
    { label: 'Enviar a revisión', icon: 'pi pi-send', severity: 'info', action: 'submitReview' }
  ],
  UNDER_REVIEW: [
    { label: 'Devolver a borrador', icon: 'pi pi-arrow-left', severity: 'secondary', action: 'returnToDraft' },
    { label: 'Publicar', icon: 'pi pi-check', severity: 'success', action: 'publish' }
  ],
  PUBLISHED: [
    { label: 'Suspender', icon: 'pi pi-pause', severity: 'warn', action: 'suspend' }
  ],
  SUSPENDED: [
    { label: 'Reenviar a revisión', icon: 'pi pi-refresh', severity: 'info', action: 'resubmitReview' },
    { label: 'Archivar', icon: 'pi pi-inbox', severity: 'secondary', action: 'archive' }
  ],
  ARCHIVED: []
};

export function getLifecycleActions(status: CourseStatus): LifecycleAction[] {
  return LIFECYCLE_MAP[status];
}

export function labelOf<T extends string>(
  labels: Record<T, string>,
  value: T | null | undefined
): string {
  return value ? labels[value] : '—';
}