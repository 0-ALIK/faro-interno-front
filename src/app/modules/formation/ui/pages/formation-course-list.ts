import { Component, OnInit, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';
import { InputTextModule } from 'primeng/inputtext';
import { TableModule } from 'primeng/table';
import { TagModule } from 'primeng/tag';

import { FormationStateService } from '../../services/formation-state.service';
import { COURSE_STATUS_LABELS, labelOf } from '../../../catalog/models/catalog-labels';

@Component({
  selector: 'app-formation-course-list',
  imports: [FormsModule, RouterLink, ButtonModule, IconFieldModule, InputIconModule, InputTextModule, TableModule, TagModule],
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
              Formación · Faro Interno
            </p>
            <h1 class="mt-2 text-h1 text-white">Cursos Municipales</h1>
            <p class="mt-2 max-w-xl text-body text-primary-100">
              Administra la formación de los cursos municipales.
              {{ formationState.filteredCourses().length }} curso(s) registrado(s).
            </p>
          </div>
        </div>
      </section>

      <div class="flex flex-col gap-3 rounded-2xl border border-surface-200 bg-surface-0 p-4 shadow-sm md:flex-row md:items-center md:justify-between">
        <div class="flex flex-col gap-3 md:flex-row md:items-center">
          <p-iconfield class="w-full md:w-80">
            <p-inputicon class="pi pi-search" />
            <input
              pInputText
              type="search"
              [value]="formationState.search()"
              (input)="onSearchInput($event)"
              placeholder="Buscar por título…"
              class="w-full"
            />
          </p-iconfield>
        </div>
        <p class="text-caption text-muted-color">
          {{ formationState.filteredCourses().length }} resultado(s)
        </p>
      </div>

      <div class="overflow-hidden rounded-2xl border border-surface-200 bg-surface-0 shadow-sm">
        <p-table
          [value]="formationState.filteredCourses()"
          [loading]="formationState.loading()"
          dataKey="id"
          [tableStyle]="{ 'min-width': '50rem' }"
        >
          <ng-template pTemplate="header">
            <tr>
              <th class="!bg-primary-50 !text-primary-900 uppercase">Curso</th>
              <th class="!bg-primary-50 !text-primary-900 uppercase">Módulos</th>
              <th class="!bg-primary-50 !text-primary-900 uppercase">Lecciones</th>
              <th class="!bg-primary-50 !text-primary-900 uppercase">Estado</th>
            </tr>
          </ng-template>

          <ng-template pTemplate="body" let-course>
            <tr class="transition-colors hover:bg-surface-50">
              <td>
                <div class="flex items-center gap-3">
                  @if (formationState.getCoverUrl(course.courseCover?.key); as coverUrl) {
                    <img [src]="coverUrl" [alt]="course.courseTitle" class="h-9 w-9 shrink-0 rounded-xl object-cover" />
                  } @else {
                    <span class="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-primary-50 text-primary-700">
                      <span class="pi pi-book-open text-sm" aria-hidden="true"></span>
                    </span>
                  }
                  <a [routerLink]="['/formation/courses', course.id]" class="cursor-pointer font-semibold text-surface-900 hover:text-primary-700">{{ course.courseTitle }}</a>
                </div>
              </td>
              <td>
                <span class="inline-flex items-center gap-1.5 text-sm text-surface-600">
                  <span class="pi pi-folder text-xs text-primary-600" aria-hidden="true"></span>
                  {{ course.moduleCount }}
                </span>
              </td>
              <td>
                <span class="inline-flex items-center gap-1.5 text-sm text-surface-600">
                  <span class="pi pi-file text-xs text-primary-600" aria-hidden="true"></span>
                  {{ course.lessonCount }}
                </span>
              </td>
              <td>
                <p-tag
                  [value]="statusLabel(course.courseStatus)"
                  [severity]="statusSeverity(course.courseStatus)"
                />
              </td>
            </tr>
          </ng-template>

          <ng-template pTemplate="emptydata">
            <tr>
              <td colspan="4" class="py-10 text-center text-muted-color">
                No hay cursos que coincidan con la búsqueda.
              </td>
            </tr>
          </ng-template>
        </p-table>
      </div>
    </div>
  `
})
export class FormationCourseList implements OnInit {
  protected readonly formationState = inject(FormationStateService);

  ngOnInit(): void {
    void this.formationState.load();
  }

  protected onSearchInput(event: Event): void {
    this.formationState.search.set((event.target as HTMLInputElement).value);
  }

  protected statusLabel(value: string | null): string {
    return labelOf(COURSE_STATUS_LABELS, value as any);
  }

  protected statusSeverity(value: string | null): string {
    switch (value) {
      case 'PUBLISHED':
        return 'success';
      case 'DRAFT':
        return 'warn';
      case 'UNDER_REVIEW':
        return 'info';
      case 'SUSPENDED':
        return 'danger';
      default:
        return 'secondary';
    }
  }
}
