import { Injectable, computed, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import { firstValueFrom } from 'rxjs';

import { CatalogApi } from '../api/catalog.api';
import { mapCourse, mapCourseList } from '../api/catalog.mapper';
import type { CourseStatus, NamedRef } from '../models/catalog.model';
import type { Course, CourseSummary } from '../models/course.model';
import { FileApi } from '../../../core/http/file.api';

@Injectable({ providedIn: 'root' })
export class CourseStateService {
  private readonly api = inject(CatalogApi);
  private readonly fileApi = inject(FileApi);
  private readonly router = inject(Router);

  readonly courses = signal<CourseSummary[]>([]);
  readonly loading = signal(false);
  readonly error = signal<string | null>(null);
  readonly page = signal(1);
  readonly total = signal(0);
  readonly search = signal('');
  readonly statusFilter = signal<CourseStatus | null>(null);
  readonly categoryFilter = signal<string | null>(null);
  readonly providerFilter = signal<string | null>(null);
  readonly coverUrls = signal<Map<string, string>>(new Map());

  readonly totalPages = computed(() => Math.max(1, Math.ceil(this.total() / 10)));

  readonly currentCourse = signal<Course | null>(null);
  readonly detailLoading = signal(false);
  readonly detailError = signal<string | null>(null);
  readonly saving = signal(false);

  async load(): Promise<void> {
    if (this.loading()) return;

    this.loading.set(true);
    this.error.set(null);
    try {
      const result = await firstValueFrom(this.api.listCourses({
        page: this.page(),
        limit: 10,
        search: this.search() || undefined,
        statuses: this.statusFilter() ? [this.statusFilter()!] : undefined,
        categoryIds: this.categoryFilter() ? [this.categoryFilter()!] : undefined,
        providerIds: this.providerFilter() ? [this.providerFilter()!] : undefined
      }));
      const courses = mapCourseList(result).data;
      this.courses.set(courses);
      this.total.set(result.pagination.total);
      await this.resolveCoverUrls(courses.map((c) => c.cover?.key).filter((k): k is string => !!k));
    } catch {
      this.error.set('No se pudo cargar el catálogo de cursos.');
    } finally {
      this.loading.set(false);
    }
  }

  setPage(newPage: number): void {
    this.page.set(newPage);
    void this.load();
  }

  resetFiltersAndReload(): void {
    this.page.set(1);
    this.search.set('');
    this.statusFilter.set(null);
    this.categoryFilter.set(null);
    this.providerFilter.set(null);
    void this.load();
  }

  async loadCourse(id: string): Promise<void> {
    this.detailLoading.set(true);
    this.detailError.set(null);
    try {
      const dto = await firstValueFrom(this.api.getCourse(id));
      const course = mapCourse(dto);
      this.currentCourse.set(course);
      if (course.cover?.key) {
        await this.resolveCoverUrls([course.cover.key]);
      }
    } catch {
      this.detailError.set('No se pudo cargar el curso.');
    } finally {
      this.detailLoading.set(false);
    }
  }

  async createCourse(formData: FormData): Promise<string> {
    this.saving.set(true);
    try {
      const res = await firstValueFrom(this.api.createCourse(formData));
      await this.load();
      return res.id;
    } finally {
      this.saving.set(false);
    }
  }

  async updateCourse(id: string, patch: Record<string, unknown>): Promise<void> {
    this.saving.set(true);
    try {
      await firstValueFrom(this.api.updateCourse(id, patch));
      await this.loadCourse(id);
      await this.load();
    } finally {
      this.saving.set(false);
    }
  }

  async updateCover(id: string, formData: FormData): Promise<void> {
    this.saving.set(true);
    try {
      await firstValueFrom(this.api.updateCourseCover(id, formData));
      await this.loadCourse(id);
    } finally {
      this.saving.set(false);
    }
  }

  async assignCategory(id: string, categoryId: string): Promise<void> {
    await firstValueFrom(this.api.assignCategory(id, categoryId));
    await this.loadCourse(id);
  }

  async assignProvider(id: string, providerId: string): Promise<void> {
    await firstValueFrom(this.api.assignProvider(id, providerId));
    await this.loadCourse(id);
  }

  async updateDuration(id: string, hours: number): Promise<void> {
    await firstValueFrom(this.api.updateDuration(id, hours));
    await this.loadCourse(id);
  }

  async addCompetencies(id: string, competencyIds: string[]): Promise<void> {
    await firstValueFrom(this.api.addCompetencies(id, competencyIds));
    await this.loadCourse(id);
  }

  async removeCompetencies(id: string, competencyIds: string[]): Promise<void> {
    await firstValueFrom(this.api.removeCompetencies(id, competencyIds));
    await this.loadCourse(id);
  }

  async addTags(id: string, tagIds: string[]): Promise<void> {
    await firstValueFrom(this.api.addTags(id, tagIds));
    await this.loadCourse(id);
  }

  async removeTags(id: string, tagIds: string[]): Promise<void> {
    await firstValueFrom(this.api.removeTags(id, tagIds));
    await this.loadCourse(id);
  }

  async executeLifecycleAction(id: string, action: string): Promise<void> {
    this.saving.set(true);
    try {
      switch (action) {
        case 'submitReview':
          await firstValueFrom(this.api.submitForReview(id));
          break;
        case 'returnToDraft':
          await firstValueFrom(this.api.returnToDraft(id));
          break;
        case 'publish':
          await firstValueFrom(this.api.publish(id));
          break;
        case 'suspend':
          await firstValueFrom(this.api.suspend(id));
          break;
        case 'archive':
          await firstValueFrom(this.api.archive(id));
          break;
        case 'resubmitReview':
          await firstValueFrom(this.api.resubmitForReview(id));
          break;
      }
      await this.loadCourse(id);
      await this.load();
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
    this.router.navigate(['/catalog/courses', id]);
  }

  goToEdit(id: string): void {
    this.router.navigate(['/catalog/courses', id, 'edit']);
  }

  goToCatalog(): void {
    this.router.navigate(['/catalog/courses']);
  }
}