import { Component, OnInit, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';
import { InputTextModule } from 'primeng/inputtext';
import { SelectModule } from 'primeng/select';
import { TableModule } from 'primeng/table';
import { PaginatorModule } from 'primeng/paginator';

import { CourseStateService } from '../../services/course-state.service';
import { CatalogStateService } from '../../services/catalog-state.service';
import { StatusTag } from '../components/status-tag';
import { CreateCourseDialog } from '../components/create-course-dialog';
import type { CourseLevel, CourseModality, CourseOrigin, CourseStatus } from '../../models/catalog.model';
import {
  COURSE_LEVEL_LABELS,
  COURSE_MODALITY_LABELS,
  COURSE_ORIGIN_LABELS,
  COURSE_STATUS_LABELS,
  labelOf
} from '../../models/catalog-labels';

@Component({
  selector: 'app-course-list',
  imports: [FormsModule, RouterLink, ButtonModule, IconFieldModule, InputIconModule, InputTextModule, SelectModule, TableModule, PaginatorModule, StatusTag, CreateCourseDialog],
  template: `
    <div class="flex flex-col gap-6">
      <section
        class="relative overflow-hidden rounded-3xl bg-gradient-to-br from-primary-600 via-primary-700 to-primary-950 p-8 shadow-lg md:p-10"
      >
        <div
          class="pointer-events-none absolute -right-16 -top-24 h-64 w-64 rounded-full bg-white/10 blur-2xl"
          aria-hidden="true"
        ></div>
        <div
          class="pointer-events-none absolute -bottom-24 right-24 h-48 w-48 rounded-full bg-primary-400/20 blur-2xl"
          aria-hidden="true"
        ></div>

        <div class="relative flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <div>
            <p class="text-sm font-semibold uppercase tracking-widest text-primary-200">
              Catálogo · Faro Interno
            </p>
            <h1 class="mt-2 text-h1 text-white">Cursos</h1>
            <p class="mt-2 max-w-xl text-body text-primary-100">
              Administra el catálogo de formación del municipio.
              {{ courseState.total() }} curso(s) registrado(s).
            </p>
          </div>
          <p-button
            label="Nuevo curso"
            icon="pi pi-plus"
            (onClick)="showCreate.set(true)"
            styleClass="!bg-white !text-primary-700 !border-white shadow-md"
          />
        </div>
      </section>

      <div class="flex flex-col gap-3 rounded-2xl border border-surface-200 bg-surface-0 p-4 shadow-sm md:flex-row md:items-center md:justify-between">
        <div class="flex flex-col gap-3 md:flex-row md:items-center">
          <p-iconfield class="w-full md:w-80">
            <p-inputicon class="pi pi-search" />
            <input
              pInputText
              type="search"
              [value]="courseState.search()"
              (input)="onSearchInput($event)"
              placeholder="Buscar por título…"
              class="w-full"
            />
          </p-iconfield>

          <p-select
            [(ngModel)]="courseState.statusFilter"
            [options]="statusOptions"
            optionLabel="label"
            optionValue="value"
            placeholder="Estado"
            [showClear]="true"
            (onChange)="onFilterChange()"
            class="w-full md:w-44"
          />

          <p-select
            [(ngModel)]="courseState.categoryFilter"
            [options]="catalogState.categoryOptions()"
            optionLabel="label"
            optionValue="value"
            placeholder="Categoría"
            [showClear]="true"
            (onChange)="onFilterChange()"
            class="w-full md:w-44"
          />

          <p-select
            [(ngModel)]="courseState.providerFilter"
            [options]="catalogState.providerOptions()"
            optionLabel="label"
            optionValue="value"
            placeholder="Proveedor"
            [showClear]="true"
            (onChange)="onFilterChange()"
            class="w-full md:w-44"
          />
        </div>
        <p class="text-caption text-muted-color">
          {{ courseState.total() }} resultado(s)
        </p>
      </div>

      <div class="overflow-hidden rounded-2xl border border-surface-200 bg-surface-0 shadow-sm">
        <p-table
          [value]="courseState.courses()"
          [loading]="courseState.loading()"
          dataKey="id"
          [tableStyle]="{ 'min-width': '64rem' }"
        >
          <ng-template pTemplate="header">
            <tr>
              <th class="!bg-primary-50 !text-primary-900 uppercase">Curso</th>
              <th class="!bg-primary-50 !text-primary-900 uppercase">Modalidad</th>
              <th class="!bg-primary-50 !text-primary-900 uppercase">Nivel</th>
              <th class="!bg-primary-50 !text-primary-900 uppercase">Origen</th>
              <th class="!bg-primary-50 !text-primary-900 uppercase">Estado</th>
              <th class="!bg-primary-50 !text-primary-900 uppercase">Duración</th>
              <th class="!bg-primary-50 !text-primary-900 uppercase">Publicado</th>
            </tr>
          </ng-template>

          <ng-template pTemplate="body" let-course>
            <tr class="transition-colors hover:bg-surface-50">
              <td>
                <div class="flex items-center gap-3">
                  @if (courseState.getCoverUrl(course.cover?.key); as coverUrl) {
                    <img [src]="coverUrl" [alt]="course.title" class="h-9 w-9 shrink-0 rounded-xl object-cover" />
                  } @else {
                    <span class="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-primary-50 text-primary-700">
                      <span class="pi pi-book-open text-sm" aria-hidden="true"></span>
                    </span>
                  }
                  <a [routerLink]="['/catalog/courses', course.id]" class="cursor-pointer font-semibold text-surface-900 hover:text-primary-700">{{ course.title }}</a>
                </div>
              </td>
              <td>
                <span class="inline-flex items-center gap-2 text-sm text-surface-600">
                  <span [class]="modalityIcon(course.modality) + ' text-xs text-primary-600'" aria-hidden="true"></span>
                  {{ modalityLabel(course.modality) }}
                </span>
              </td>
              <td class="text-sm text-surface-600">{{ levelLabel(course.level) }}</td>
              <td>
                <span class="inline-flex items-center gap-1.5 rounded-lg bg-surface-100 px-2.5 py-1 text-xs font-medium text-surface-700">
                  <span [class]="originIcon(course.origin) + ' text-xs'" aria-hidden="true"></span>
                  {{ originLabel(course.origin) }}
                </span>
              </td>
              <td><app-status-tag [status]="course.status" /></td>
              <td>
                <span class="inline-flex items-center gap-1.5 text-sm text-surface-600">
                  <span class="pi pi-clock text-xs text-muted-color" aria-hidden="true"></span>
                  {{ course.durationHours ? course.durationHours + ' h' : '—' }}
                </span>
              </td>
              <td>
                @if (course.publishedAt) {
                  <span class="inline-flex items-center gap-1.5 text-sm text-surface-600">
                    <span class="pi pi-calendar text-xs text-muted-color" aria-hidden="true"></span>
                    {{ course.publishedAt }}
                  </span>
                } @else {
                  <span class="text-sm text-surface-400">—</span>
                }
              </td>
            </tr>
          </ng-template>

          <ng-template pTemplate="emptydata">
            <tr>
              <td colspan="7" class="py-10 text-center text-muted-color">
                No hay cursos que coincidan con la búsqueda.
              </td>
            </tr>
          </ng-template>
        </p-table>

        @if (courseState.total() > 10) {
          <p-paginator
            [rows]="10"
            [totalRecords]="courseState.total()"
            [first]="(courseState.page() - 1) * 10"
            (onPageChange)="onPageChange($event)"
            [showCurrentPageReport]="true"
            currentPageReportTemplate="Mostrando {first} a {last} de {totalRecords}"
            [rowsPerPageOptions]="[10, 20, 50]"
          />
        }
      </div>

      <app-create-course-dialog
        [visible]="showCreate()"
        [saving]="courseState.saving()"
        (created)="onCourseCreated($event)"
        (close)="showCreate.set(false)"
      />
    </div>
  `
})
export class CourseList implements OnInit {
  protected readonly courseState = inject(CourseStateService);
  protected readonly catalogState = inject(CatalogStateService);
  protected readonly showCreate = signal(false);

  protected readonly statusOptions: { label: string; value: CourseStatus }[] = (
    Object.keys(COURSE_STATUS_LABELS) as CourseStatus[]
  ).map((value) => ({ label: COURSE_STATUS_LABELS[value], value }));

  async ngOnInit(): Promise<void> {
    this.courseState.page.set(1);
    this.courseState.search.set('');
    this.courseState.statusFilter.set(null);
    this.courseState.categoryFilter.set(null);
    this.courseState.providerFilter.set(null);
    await this.catalogState.loadAll();
    await this.courseState.load();
  }

  protected async onCourseCreated(data: { title: string; modality: string; level: string; origin: string; enrollmentMode: string; description: string }): Promise<void> {
    const formData = new FormData();
    formData.append('title', data.title);
    formData.append('modality', data.modality);
    formData.append('level', data.level);
    formData.append('origin', data.origin);
    formData.append('enrollmentMode', data.enrollmentMode);
    if (data.description) formData.append('description', data.description);

    const newId = await this.courseState.createCourse(formData);
    this.showCreate.set(false);
    this.courseState.goToEdit(newId);
  }

  protected onSearchInput(event: Event): void {
    this.courseState.search.set((event.target as HTMLInputElement).value);
    this.debounceSearch();
  }

  private searchTimeout: ReturnType<typeof setTimeout> | null = null;

  private debounceSearch(): void {
    if (this.searchTimeout) clearTimeout(this.searchTimeout);
    this.searchTimeout = setTimeout(() => {
      this.courseState.setPage(1);
      void this.courseState.load();
    }, 400);
  }

  protected onFilterChange(): void {
    this.courseState.setPage(1);
    void this.courseState.load();
  }

  protected onPageChange(event: { page: number; rows: number }): void {
    this.courseState.setPage(event.page + 1);
  }

  protected modalityLabel(value: CourseModality | null): string {
    return labelOf(COURSE_MODALITY_LABELS, value);
  }

  protected modalityIcon(value: CourseModality | null): string {
    switch (value) {
      case 'VIRTUAL':
        return 'pi pi-desktop';
      case 'IN_PERSON':
        return 'pi pi-building-columns';
      case 'HYBRID':
        return 'pi pi-sliders-h';
      default:
        return 'pi pi-minus';
    }
  }

  protected levelLabel(value: CourseLevel | null): string {
    return labelOf(COURSE_LEVEL_LABELS, value);
  }

  protected originLabel(value: CourseOrigin | null): string {
    return labelOf(COURSE_ORIGIN_LABELS, value);
  }

  protected originIcon(value: CourseOrigin | null): string {
    switch (value) {
      case 'MUNICIPAL':
        return 'pi pi-building';
      case 'EXTERNAL':
        return 'pi pi-globe';
      default:
        return 'pi pi-minus';
    }
  }
}
