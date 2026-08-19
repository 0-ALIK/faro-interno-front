import { Injectable, computed, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import { firstValueFrom } from 'rxjs';

import { CatalogApi } from '../api/catalog.api';
import { mapCourse, mapCourseList } from '../api/catalog.mapper';
import type { CourseStatus, NamedRef } from '../models/catalog.model';
import type { Course, CourseSummary } from '../models/course.model';

@Injectable({ providedIn: 'root' })
export class CourseStateService {
  private readonly api = inject(CatalogApi);
  private readonly router = inject(Router);

  readonly courses = signal<CourseSummary[]>([]);
  readonly loading = signal(false);
  readonly error = signal<string | null>(null);
  readonly search = signal('');
  readonly statusFilter = signal<CourseStatus | null>(null);

  readonly filteredCourses = computed(() => {
    const query = this.search().trim().toLowerCase();
    const status = this.statusFilter();
    return this.courses().filter((course) => {
      const matchesQuery = !query || course.title.toLowerCase().includes(query);
      const matchesStatus = !status || course.status === status;
      return matchesQuery && matchesStatus;
    });
  });

  readonly currentCourse = signal<Course | null>(null);
  readonly detailLoading = signal(false);
  readonly detailError = signal<string | null>(null);
  readonly saving = signal(false);

  async load(): Promise<void> {
    this.loading.set(true);
    this.error.set(null);
    try {
      const page = await firstValueFrom(this.api.listCourses({ limit: 100 }));
      this.courses.set(mapCourseList(page).data);
    } catch {
      this.error.set('No se pudo cargar el catálogo de cursos.');
    } finally {
      this.loading.set(false);
    }
  }

  async loadCourse(id: string): Promise<void> {
    this.detailLoading.set(true);
    this.detailError.set(null);
    try {
      const dto = await firstValueFrom(this.api.getCourse(id));
      this.currentCourse.set(mapCourse(dto));
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

  goToDetail(id: string): void {
    this.router.navigate(['/catalog/courses', id]);
  }

  goToEdit(id: string): void {
    this.router.navigate(['/catalog/courses', id, 'edit']);
  }

  goToCreate(): void {
    this.router.navigate(['/catalog/courses', 'new']);
  }

  goToCatalog(): void {
    this.router.navigate(['/catalog/courses']);
  }
}