import { Injectable, computed, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import { firstValueFrom } from 'rxjs';

import { FormationApi } from '../api/formation.api';
import { mapEvaluation, mapLessonDetail, mapMunicipalCourse, mapMunicipalCourseList } from '../api/formation.mapper';
import type { CourseStatus } from '../../catalog/models/catalog.model';
import type { Evaluation, LessonDetail, Module, MunicipalCourse, MunicipalCourseSummary } from '../models/formation.model';
import { FileApi } from '../../../core/http/file.api';

@Injectable({ providedIn: 'root' })
export class FormationStateService {
  private readonly api = inject(FormationApi);
  private readonly fileApi = inject(FileApi);
  private readonly router = inject(Router);

  readonly courses = signal<MunicipalCourseSummary[]>([]);
  readonly loading = signal(false);
  readonly error = signal<string | null>(null);
  readonly search = signal('');
  readonly coverUrls = signal<Map<string, string>>(new Map());

  readonly filteredCourses = computed(() => {
    const query = this.search().trim().toLowerCase();
    return this.courses().filter((c) => !query || c.courseTitle.toLowerCase().includes(query));
  });

  readonly currentCourse = signal<MunicipalCourse | null>(null);
  readonly detailLoading = signal(false);
  readonly detailError = signal<string | null>(null);
  readonly saving = signal(false);

  readonly currentLesson = signal<LessonDetail | null>(null);
  readonly lessonLoading = signal(false);
  readonly lessonError = signal<string | null>(null);

  readonly currentEvaluation = signal<Evaluation | null>(null);
  readonly evaluationLoading = signal(false);
  readonly evaluationError = signal<string | null>(null);

  async load(): Promise<void> {
    this.loading.set(true);
    this.error.set(null);
    try {
      const page = await firstValueFrom(this.api.listCourses({ limit: 100 }));
      const courses = mapMunicipalCourseList(page).data;
      this.courses.set(courses);
      await this.resolveCoverUrls(courses.map((c) => c.courseCover?.key).filter((k): k is string => !!k));
    } catch {
      this.error.set('No se pudo cargar la lista de cursos municipales.');
    } finally {
      this.loading.set(false);
    }
  }

  async loadCourse(id: string): Promise<void> {
    this.detailLoading.set(true);
    this.detailError.set(null);
    try {
      const dto = await firstValueFrom(this.api.getCourse(id));
      const course = mapMunicipalCourse(dto);
      this.currentCourse.set(course);
      if (course.courseCover?.key) {
        await this.resolveCoverUrls([course.courseCover.key]);
      }
    } catch {
      this.detailError.set('No se pudo cargar el curso municipal.');
    } finally {
      this.detailLoading.set(false);
    }
  }

  async addModule(courseId: string, title: string, description: string | null): Promise<void> {
    this.saving.set(true);
    try {
      const course = this.currentCourse();
      const order = (course?.modules.length ?? 0) + 1;
      await firstValueFrom(this.api.addModule(courseId, { title, description, order }));
      await this.loadCourse(courseId);
    } finally {
      this.saving.set(false);
    }
  }

  async updateModule(moduleId: string, title: string, description: string | null): Promise<void> {
    this.saving.set(true);
    try {
      await firstValueFrom(this.api.updateModule(moduleId, { title, description }));
      const course = this.currentCourse();
      if (course) await this.loadCourse(course.id);
    } finally {
      this.saving.set(false);
    }
  }

  async deleteModule(courseId: string, moduleId: string): Promise<void> {
    this.saving.set(true);
    try {
      await firstValueFrom(this.api.deleteModule(courseId, moduleId));
      await this.loadCourse(courseId);
    } finally {
      this.saving.set(false);
    }
  }

  async reorderModule(courseId: string, moduleId: string, newOrder: number): Promise<void> {
    await firstValueFrom(this.api.reorderModule(courseId, moduleId, newOrder));
    await this.loadCourse(courseId);
  }

  async moveModule(courseId: string, modules: Module[], index: number, direction: 'up' | 'down'): Promise<void> {
    const newIndex = direction === 'up' ? index - 1 : index + 1;
    if (newIndex < 0 || newIndex >= modules.length) return;
    const targetModule = modules[newIndex];
    const movedModule = modules[index];
    await firstValueFrom(this.api.reorderModule(courseId, movedModule.id, newIndex + 1));
    await firstValueFrom(this.api.reorderModule(courseId, targetModule.id, index + 1));
    await this.loadCourse(courseId);
  }

  async validateCourse(courseId: string): Promise<boolean> {
    this.saving.set(true);
    try {
      await firstValueFrom(this.api.validateCourse(courseId));
      await this.loadCourse(courseId);
      return true;
    } catch {
      return false;
    } finally {
      this.saving.set(false);
    }
  }

  async addLesson(moduleId: string, title: string, description: string | null, type: string): Promise<void> {
    this.saving.set(true);
    try {
      const course = this.currentCourse();
      const mod = course?.modules.find((m) => m.id === moduleId);
      const order = (mod?.lessons.length ?? 0) + 1;
      await firstValueFrom(this.api.addLesson(moduleId, { title, description, type, order }));
      if (course) await this.loadCourse(course.id);
    } finally {
      this.saving.set(false);
    }
  }

  async deleteLesson(moduleId: string, lessonId: string): Promise<void> {
    this.saving.set(true);
    try {
      await firstValueFrom(this.api.deleteLesson(moduleId, lessonId));
      const course = this.currentCourse();
      if (course) await this.loadCourse(course.id);
    } finally {
      this.saving.set(false);
    }
  }

  async moveLesson(moduleId: string, lessons: { id: string; position: number }[], index: number, direction: 'up' | 'down'): Promise<void> {
    const newIndex = direction === 'up' ? index - 1 : index + 1;
    if (newIndex < 0 || newIndex >= lessons.length) return;
    const target = lessons[newIndex];
    const moved = lessons[index];
    await firstValueFrom(this.api.reorderLesson(moduleId, moved.id, newIndex + 1));
    await firstValueFrom(this.api.reorderLesson(moduleId, target.id, index + 1));
    const course = this.currentCourse();
    if (course) await this.loadCourse(course.id);
  }

  async loadLesson(id: string): Promise<void> {
    this.lessonLoading.set(true);
    this.lessonError.set(null);
    try {
      const dto = await firstValueFrom(this.api.getLesson(id));
      this.currentLesson.set(mapLessonDetail(dto));
    } catch {
      this.lessonError.set('No se pudo cargar la lección.');
    } finally {
      this.lessonLoading.set(false);
    }
  }

  async updateLesson(id: string, title: string, description: string | null, type: string): Promise<void> {
    this.saving.set(true);
    try {
      await firstValueFrom(this.api.updateLesson(id, { title, description, type }));
      await this.loadLesson(id);
    } finally {
      this.saving.set(false);
    }
  }

  async assignMainContent(lessonId: string, formData: FormData): Promise<void> {
    this.saving.set(true);
    try {
      await firstValueFrom(this.api.assignMainContent(lessonId, formData));
      await this.loadLesson(lessonId);
    } finally {
      this.saving.set(false);
    }
  }

  async updateArticle(lessonId: string, articleId: string, content: string): Promise<void> {
    this.saving.set(true);
    try {
      await firstValueFrom(this.api.updateArticle(lessonId, articleId, content));
      await this.loadLesson(lessonId);
    } finally {
      this.saving.set(false);
    }
  }

  async addResource(lessonId: string, formData: FormData): Promise<void> {
    this.saving.set(true);
    try {
      await firstValueFrom(this.api.addResource(lessonId, formData));
      await this.loadLesson(lessonId);
    } finally {
      this.saving.set(false);
    }
  }

  async deleteResource(lessonId: string, resourceId: string): Promise<void> {
    this.saving.set(true);
    try {
      await firstValueFrom(this.api.deleteResource(lessonId, resourceId));
      await this.loadLesson(lessonId);
    } finally {
      this.saving.set(false);
    }
  }

  async loadEvaluation(moduleId: string): Promise<void> {
    this.evaluationLoading.set(true);
    this.evaluationError.set(null);
    try {
      const dto = await firstValueFrom(this.api.getEvaluation(moduleId));
      this.currentEvaluation.set(mapEvaluation(dto));
    } catch {
      this.currentEvaluation.set(null);
    } finally {
      this.evaluationLoading.set(false);
    }
  }

  async createEvaluation(moduleId: string, title: string, description: string | null, minimumScore: number): Promise<void> {
    this.saving.set(true);
    try {
      await firstValueFrom(this.api.createEvaluation(moduleId, { title, description, minimumScore }));
      await this.loadEvaluation(moduleId);
      const course = this.currentCourse();
      if (course) await this.loadCourse(course.id);
    } finally {
      this.saving.set(false);
    }
  }

  async updateEvaluation(moduleId: string, title: string, description: string | null, minimumScore: number): Promise<void> {
    this.saving.set(true);
    try {
      await firstValueFrom(this.api.updateEvaluation(moduleId, { title, description, minimumScore }));
      await this.loadEvaluation(moduleId);
    } finally {
      this.saving.set(false);
    }
  }

  async addQuestion(moduleId: string, statement: string, type: string, correctAnswer?: string): Promise<void> {
    this.saving.set(true);
    try {
      await firstValueFrom(this.api.addQuestion(moduleId, { statement, type, correctAnswer }));
      await this.loadEvaluation(moduleId);
    } finally {
      this.saving.set(false);
    }
  }

  async deleteQuestion(moduleId: string, questionId: string): Promise<void> {
    this.saving.set(true);
    try {
      await firstValueFrom(this.api.deleteQuestion(moduleId, questionId));
      await this.loadEvaluation(moduleId);
    } finally {
      this.saving.set(false);
    }
  }

  async addAnswer(moduleId: string, questionId: string, description: string, correct: boolean): Promise<void> {
    this.saving.set(true);
    try {
      await firstValueFrom(this.api.addAnswer(moduleId, questionId, { description, correct }));
      await this.loadEvaluation(moduleId);
    } finally {
      this.saving.set(false);
    }
  }

  async deleteAnswer(moduleId: string, questionId: string, answerId: string): Promise<void> {
    this.saving.set(true);
    try {
      await firstValueFrom(this.api.deleteAnswer(moduleId, questionId, answerId));
      await this.loadEvaluation(moduleId);
    } finally {
      this.saving.set(false);
    }
  }

  async setCorrectAnswer(moduleId: string, questionId: string, answerId: string): Promise<void> {
    this.saving.set(true);
    try {
      await firstValueFrom(this.api.setCorrectAnswer(moduleId, questionId, answerId));
      this.currentEvaluation.update((eval_) => {
        if (!eval_) return eval_;
        return {
          ...eval_,
          questions: eval_.questions.map((q) => {
            if (q.id !== questionId) return q;
            const isTrueFalse = q.type === 'TRUE_FALSE';
            return {
              ...q,
              answers: q.answers.map((a) => {
                if (isTrueFalse) {
                  return { ...a, correct: a.id === answerId };
                }
                if (a.id === answerId) {
                  return { ...a, correct: !a.correct };
                }
                return a;
              })
            };
          })
        };
      });
    } finally {
      this.saving.set(false);
    }
  }

  private async resolveCoverUrls(keys: string[]): Promise<void> {
    const uniqueKeys = [...new Set(keys)].filter(
      (k) => !this.coverUrls().has(k),
    );
    if (uniqueKeys.length === 0) return;

    const signed = await firstValueFrom(this.fileApi.batchSign(uniqueKeys));
    this.coverUrls.update((prev) => {
      const next = new Map(prev);
      for (const file of signed) {
        next.set(file.key, file.url);
      }
      return next;
    });
  }

  getCoverUrl(key: string | null | undefined): string | null {
    if (!key) return null;
    return this.coverUrls().get(key) ?? null;
  }

  goToDetail(id: string): void {
    this.router.navigate(['/formation/courses', id]);
  }

  goToLesson(id: string): void {
    this.router.navigate(['/formation/lessons', id]);
  }

  goToEvaluation(courseId: string, moduleId: string): void {
    this.router.navigate(['/formation/courses', courseId, 'modules', moduleId, 'evaluation']);
  }

  goToCatalog(): void {
    this.router.navigate(['/formation/courses']);
  }
}
