import type { Course, CourseSummary } from '../models/course.model';
import type { Category, Competency, Provider, Tag } from '../models/catalog.model';
import type {
  CategoryDetailDto,
  CategoryDto,
  CompetencyDetailDto,
  CompetencyDto,
  CourseDetailDto,
  CourseListItemDto,
  PaginatedDto,
  ProviderDetailDto,
  ProviderDto,
  TagDetailDto,
  TagDto
} from './catalog.dto';

export function mapCategory(dto: CategoryDto): Category {
  return { id: dto.id, name: dto.name };
}

export function mapProvider(dto: ProviderDto): Provider {
  return { id: dto.id, name: dto.name, type: dto.type };
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
    modality: dto.modality,
    level: dto.level,
    origin: dto.origin,
    status: dto.status,
    enrollmentMode: dto.enrollmentMode,
    durationHours: dto.durationHours,
    cover: dto.cover,
    publishedAt: dto.publishedAt ? new Date(dto.publishedAt) : null
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
    stateHistory: dto.stateHistory,
    createdAt: new Date(dto.createdAt),
    updatedAt: new Date(dto.updatedAt)
  };
}

export function mapCourseList(dto: PaginatedDto<CourseListItemDto>) {
  return {
    data: dto.data.map(mapCourseSummary),
    total: dto.pagination.total
  };
}