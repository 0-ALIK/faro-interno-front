import type {
  Answer,
  Evaluation,
  Lesson,
  LessonDetail,
  MainContent,
  Module,
  MunicipalCourse,
  MunicipalCourseSummary,
  Question,
  Resource
} from '../models/formation.model';
import type {
  QuestionAnswerDto as AnswerDto,
  EvaluationDto,
  LessonDetailDto,
  LessonDto,
  MainContentDto,
  ModuleDto,
  MunicipalCourseDetailDto,
  MunicipalCourseListItemDto,
  PaginatedDto,
  QuestionDto,
  ResourceDto
} from './formation.dto';

export function mapMunicipalCourseSummary(dto: MunicipalCourseListItemDto): MunicipalCourseSummary {
  return {
    id: dto.id,
    courseId: dto.courseId,
    courseTitle: dto.courseTitle,
    courseCover: dto.courseCover ?? null,
    courseStatus: dto.courseStatus,
    moduleCount: dto.moduleCount,
    lessonCount: dto.lessonCount
  };
}

export function mapLesson(dto: LessonDto): Lesson {
  return {
    id: dto.id,
    title: dto.title,
    type: dto.type,
    position: dto.position,
    createdBy: dto.createdBy
  };
}

export function mapModule(dto: ModuleDto): Module {
  return {
    id: dto.id,
    title: dto.title,
    description: dto.description ?? null,
    position: dto.position,
    hasEvaluation: dto.hasEvaluation,
    createdBy: dto.createdBy,
    lessons: dto.lessons.map(mapLesson)
  };
}

export function mapMunicipalCourse(dto: MunicipalCourseDetailDto): MunicipalCourse {
  return {
    ...mapMunicipalCourseSummary(dto),
    modules: dto.modules.map(mapModule)
  };
}

export function mapMunicipalCourseList(dto: PaginatedDto<MunicipalCourseListItemDto>) {
  return {
    data: dto.data.map(mapMunicipalCourseSummary),
    total: dto.pagination.total
  };
}

export function mapAnswer(dto: AnswerDto): Answer {
  return { id: dto.id, description: dto.description, correct: dto.correct };
}

export function mapQuestion(dto: QuestionDto): Question {
  return {
    id: dto.id,
    statement: dto.statement,
    type: dto.type,
    answers: dto.answers.map(mapAnswer)
  };
}

export function mapEvaluation(dto: EvaluationDto): Evaluation {
  return {
    id: dto.id,
    moduleId: dto.moduleId,
    title: dto.title,
    description: dto.description ?? null,
    minimumScore: dto.minimumScore,
    createdBy: dto.createdBy,
    questions: dto.questions.map(mapQuestion)
  };
}

export function mapMainContent(dto: MainContentDto | null): MainContent | null {
  if (!dto) return null;
  return {
    type: dto.type,
    article: dto.article ?? null,
    video: dto.video ?? null,
    documentPdf: dto.documentPdf ?? null
  };
}

export function mapResource(dto: ResourceDto): Resource {
  return {
    id: dto.id,
    name: dto.name,
    fileName: dto.fileName,
    fileKey: dto.fileKey,
    fileType: dto.fileType
  };
}

export function mapLessonDetail(dto: LessonDetailDto): LessonDetail {
  return {
    id: dto.id,
    moduleId: dto.moduleId,
    title: dto.title,
    description: dto.description ?? null,
    type: dto.type,
    order: dto.order,
    mainContent: mapMainContent(dto.mainContent),
    resources: dto.resources.map(mapResource)
  };
}
