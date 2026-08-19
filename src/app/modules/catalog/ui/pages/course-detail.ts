import { Component, OnInit, inject, signal } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { DividerModule } from 'primeng/divider';
import { TagModule } from 'primeng/tag';
import { ChipModule } from 'primeng/chip';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { MessageModule } from 'primeng/message';

import { CourseStateService } from '../../services/course-state.service';
import { LifecycleActions } from '../components/lifecycle-actions';
import { StateTimeline } from '../components/state-timeline';
import { StatusTag } from '../components/status-tag';
import {
  COURSE_LEVEL_LABELS,
  COURSE_MODALITY_LABELS,
  COURSE_ORIGIN_LABELS,
  ENROLLMENT_MODE_LABELS,
  labelOf
} from '../../models/catalog-labels';
import type { CourseModality, CourseLevel, CourseOrigin } from '../../models/catalog.model';

@Component({
  selector: 'app-course-detail',
  imports: [
    ButtonModule,
    CardModule,
    DividerModule,
    TagModule,
    ChipModule,
    ProgressSpinnerModule,
    MessageModule,
    LifecycleActions,
    StateTimeline,
    StatusTag
  ],
  template: `
    <div class="flex flex-col gap-6">
      @if (courseState.detailLoading()) {
        <div class="flex items-center justify-center py-20">
          <p-progressSpinner strokeWidth="4" />
        </div>
      } @else if (courseState.detailError()) {
        <p-message severity="error">{{ courseState.detailError() }}</p-message>
      } @else if (course(); as course) {
        <div
          class="relative overflow-hidden rounded-3xl bg-gradient-to-br from-primary-600 via-primary-700 to-primary-950 p-8 shadow-lg md:p-10"
        >
          @if (course.cover) {
            <div
              class="pointer-events-none absolute inset-0 bg-cover bg-center opacity-20"
              [style.backgroundImage]="'url(' + courseState.getCoverUrl(course.cover.key) + ')'"
            ></div>
          }
          <div class="relative flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
            <div>
              <div class="mb-3 flex flex-wrap items-center gap-2">
                <app-status-tag [status]="course.status" />
                @if (course.modality) {
                  <span class="inline-flex items-center gap-1.5 rounded-lg bg-white/15 px-2.5 py-1 text-xs font-medium text-white">
                    <span [class]="modalityIcon(course.modality) + ' text-xs'" aria-hidden="true"></span>
                    {{ modalityLabel(course.modality) }}
                  </span>
                }
                @if (course.level) {
                  <span class="inline-flex items-center rounded-lg bg-white/15 px-2.5 py-1 text-xs font-medium text-white">
                    {{ levelLabel(course.level) }}
                  </span>
                }
                @if (course.origin) {
                  <span class="inline-flex items-center rounded-lg bg-white/15 px-2.5 py-1 text-xs font-medium text-white">
                    {{ originLabel(course.origin) }}
                  </span>
                }
              </div>
              <h1 class="text-h1 text-white">{{ course.title }}</h1>
              <div class="mt-2 flex flex-wrap items-center gap-4 text-sm text-primary-200">
                @if (course.durationHours) {
                  <span class="inline-flex items-center gap-1.5">
                    <span class="pi pi-clock text-xs" aria-hidden="true"></span>
                    {{ course.durationHours }} horas
                  </span>
                }
                <span class="inline-flex items-center gap-1.5">
                  {{ enrollmentLabel(course.enrollmentMode) }}
                </span>
                @if (course.publishedAt) {
                  <span class="inline-flex items-center gap-1.5">
                    <span class="pi pi-calendar text-xs" aria-hidden="true"></span>
                    Publicado {{ course.publishedAt }}
                  </span>
                }
              </div>
            </div>
            <p-button
              label="Editar"
              icon="pi pi-pencil"
              styleClass="!bg-white !text-primary-700 !border-white shadow-md"
              (onClick)="courseState.goToEdit(course.id)"
            />
          </div>
        </div>

        <div class="grid grid-cols-1 gap-6 xl:grid-cols-3">
          <div class="flex flex-col gap-6 xl:col-span-2">
            @if (course.description) {
              <p-card>
                <ng-template #title>Descripción</ng-template>
                <ng-template #content>
                  <p class="text-body leading-relaxed text-surface-700">{{ course.description }}</p>
                </ng-template>
              </p-card>
            }

            @if (course.competencies.length > 0 || course.tags.length > 0) {
              <p-card>
                <ng-template #title>Etiquetas y competencias</ng-template>
                <ng-template #content>
                  <div class="flex flex-col gap-4">
                    @if (course.competencies.length > 0) {
                      <div>
                        <p class="mb-2 text-caption font-semibold uppercase tracking-wider text-muted-color">Competencias</p>
                        <div class="flex flex-wrap gap-2">
                          @for (comp of course.competencies; track comp.id) {
                            <p-chip [label]="comp.name" />
                          }
                        </div>
                      </div>
                    }
                    @if (course.tags.length > 0) {
                      <div>
                        <p class="mb-2 text-caption font-semibold uppercase tracking-wider text-muted-color">Etiquetas</p>
                        <div class="flex flex-wrap gap-2">
                          @for (tag of course.tags; track tag.id) {
                            <p-tag [value]="tag.name" severity="info" />
                          }
                        </div>
                      </div>
                    }
                  </div>
                </ng-template>
              </p-card>
            }
          </div>

          <div class="flex flex-col gap-6">
            <p-card>
              <ng-template #title>Información</ng-template>
              <ng-template #content>
                <div class="flex flex-col gap-3">
                  <div class="flex items-center justify-between">
                    <span class="text-caption text-muted-color">Categoría</span>
                    <span class="text-sm font-medium text-surface-900">{{ course.category?.name ?? '—' }}</span>
                  </div>
                  <p-divider styleClass="!my-1" />
                  <div class="flex items-center justify-between">
                    <span class="text-caption text-muted-color">Proveedor</span>
                    <span class="text-sm font-medium text-surface-900">{{ course.provider?.name ?? '—' }}</span>
                  </div>
                  <p-divider styleClass="!my-1" />
                  <div class="flex items-center justify-between">
                    <span class="text-caption text-muted-color">Creado</span>
                    <span class="text-sm text-surface-600">{{ course.createdAt }}</span>
                  </div>
                  <p-divider styleClass="!my-1" />
                  <div class="flex items-center justify-between">
                    <span class="text-caption text-muted-color">Actualizado</span>
                    <span class="text-sm text-surface-600">{{ course.updatedAt }}</span>
                  </div>
                </div>
              </ng-template>
            </p-card>

            <p-card>
              <ng-template #content>
                <app-lifecycle-actions
                  [status]="course.status"
                  [saving]="courseState.saving()"
                  (actionClick)="onLifecycleAction($event)"
                />
              </ng-template>
            </p-card>
          </div>
        </div>

        <p-card>
          <ng-template #title>Historial de estados</ng-template>
          <ng-template #content>
            <app-state-timeline [history]="course.stateHistory" />
          </ng-template>
        </p-card>
      }
    </div>
  `
})
export class CourseDetail implements OnInit {
  protected readonly courseState = inject(CourseStateService);
  private readonly route = inject(ActivatedRoute);

  protected readonly course = this.courseState.currentCourse;

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      void this.courseState.loadCourse(id);
    }
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

  protected enrollmentLabel = (value: string | null) => value ? ENROLLMENT_MODE_LABELS[value as keyof typeof ENROLLMENT_MODE_LABELS] ?? value : '—';

  protected async onLifecycleAction(action: string): Promise<void> {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      await this.courseState.executeLifecycleAction(id, action);
    }
  }
}