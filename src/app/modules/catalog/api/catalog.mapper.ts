import type { Course, CourseSummary } from '../models/course.model';
import type {
  Category,
  Competency,
  CourseLevel,
  CourseModality,
  CourseOrigin,
  CourseStatus,
  Provider,
  ProviderType,
  Tag
} from '../models/catalog.model';
import type {
  CategoryDetailDto,
  CategoryDto,
  CompetencyDetailDto,
  CompetencyDto,
  CourseDetailDto,
  CourseListItemDto,
  CourseLevelDto,
  CourseModalityDto,
  CourseOriginDto,
  CourseStatusDto,
  PaginatedDto,
  ProviderDetailDto,
  ProviderDto,
  ProviderTypeDto,
  TagDetailDto,
  TagDto
} from './catalog.dto';

const MODALITY_MAP: Record<CourseModalityDto, CourseModality> = {
  virtual: 'VIRTUAL',
  presencial: 'IN_PERSON',
  hibrido: 'HYBRID'
};

const LEVEL_MAP: Record<CourseLevelDto, CourseLevel> = {
  basico: 'BASIC',
  intermedio: 'INTERMEDIATE',
  avanzado: 'ADVANCED'
};

const ORIGIN_MAP: Record<CourseOriginDto, CourseOrigin> = {
  municipal: 'MUNICIPAL',
  externo: 'EXTERNAL'
};

const STATUS_MAP: Record<CourseStatusDto, CourseStatus> = {
  borrador: 'DRAFT',
  'en revision': 'UNDER_REVIEW',
  publicado: 'PUBLISHED',
  suspendido: 'SUSPENDED',
  archivado: 'ARCHIVED'
};

const PROVIDER_TYPE_MAP: Record<ProviderTypeDto, ProviderType> = {
  'institucion educativa': 'EDUCATIONAL_INSTITUTION',
  'empresa privada': 'PRIVATE_COMPANY',
  ong: 'NGO',
  gobierno: 'GOVERNMENT',
  'plataforma digital': 'DIGITAL_PLATFORM'
};

function parseBackendDate(dateStr: string): Date {
  const [day, month, year] = dateStr.split('-').map(Number);
  return new Date(year, month - 1, day);
}

export function mapCategory(dto: CategoryDto): Category {
  return { id: dto.id, name: dto.name };
}

export function mapProvider(dto: ProviderDto): Provider {
  return { id: dto.id, name: dto.name, type: PROVIDER_TYPE_MAP[dto.type] };
}

export function mapCompetency(dto: CompetencyDto): Competency {
  return { id: dto.id, name: dto.name };
}

export function mapTag(dto: TagDto): Tag {
  return { id: dto.id, name: dto.name };
}

export function mapCourseSummary(dto: CourseListItemDto): CourseSummary {
  return {
    id: dto.id,
    title: dto.title,
    modality: dto.modality ? MODALITY_MAP[dto.modality] : null,
    level: dto.level ? LEVEL_MAP[dto.level] : null,
    origin: dto.origin ? ORIGIN_MAP[dto.origin] : null,
    status: STATUS_MAP[dto.status],
    enrollmentMode: dto.enrollmentMode,
    durationHours: dto.durationHours,
    cover: dto.cover,
    publishedAt: dto.publishedAt
  };
}

export function mapCourse(dto: CourseDetailDto): Course {
  return {
    ...mapCourseSummary(dto),
    description: dto.description,
    category: dto.category ? mapCategory(dto.category) : null,
    provider: dto.provider ? mapProvider(dto.provider) : null,
    competencies: dto.competencies.map(mapCompetency),
    tags: dto.tags.map(mapTag),
    createdBy: dto.createdBy,
    stateHistory: dto.stateHistory.map((entry) => ({
      ...entry,
      from: entry.from ? STATUS_MAP[entry.from] : null,
      to: STATUS_MAP[entry.to]
    })),
    createdAt: dto.createdAt,
    updatedAt: dto.updatedAt
  };
}

export function mapCourseList(dto: PaginatedDto<CourseListItemDto>) {
  return {
    data: dto.data.map(mapCourseSummary),
    total: dto.pagination.total
  };
}