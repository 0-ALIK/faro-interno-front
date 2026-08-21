import { Component, OnInit, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { DialogModule } from 'primeng/dialog';
import { InputTextModule } from 'primeng/inputtext';
import { TextareaModule } from 'primeng/textarea';
import { SelectModule } from 'primeng/select';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { MessageModule } from 'primeng/message';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';

import { FormationStateService } from '../../services/formation-state.service';
import { ModuleCard } from '../components/module-card';
import { COURSE_STATUS_LABELS } from '../../../catalog/models/catalog-labels';
import { LESSON_TYPE_LABELS } from '../../models/formation-labels';
import type { LessonType, Module } from '../../models/formation.model';

@Component({
  selector: 'app-formation-course-detail',
  imports: [
    FormsModule,
    RouterLink,
    ButtonModule,
    CardModule,
    DialogModule,
    InputTextModule,
    TextareaModule,
    SelectModule,
    ProgressSpinnerModule,
    MessageModule,
    ToastModule,
    ModuleCard
  ],
  providers: [MessageService],
  template: `
    <p-toast />
    <div class="flex flex-col gap-6">
      @if (formationState.detailLoading()) {
        <div class="flex items-center justify-center py-20">
          <p-progressSpinner strokeWidth="4" />
        </div>
      } @else if (formationState.detailError()) {
        <p-message severity="error">{{ formationState.detailError() }}</p-message>
      } @else if (formationState.currentCourse(); as course) {
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

          <div class="relative flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
            <div>
              <div class="mb-3 flex flex-wrap items-center gap-2">
                <p-tag [value]="statusLabel(course.courseStatus)" [severity]="statusSeverity(course.courseStatus)" />
              </div>
              <h1 class="text-h1 text-white">{{ course.courseTitle }}</h1>
              <div class="mt-2 flex flex-wrap items-center gap-4 text-sm text-primary-200">
                <span class="inline-flex items-center gap-1.5">
                  <span class="pi pi-folder text-xs" aria-hidden="true"></span>
                  {{ course.modules.length }} módulo(s)
                </span>
                <span class="inline-flex items-center gap-1.5">
                  <span class="pi pi-file text-xs" aria-hidden="true"></span>
                  {{ totalLessons() }} leccione(s)
                </span>
              </div>
            </div>
            <div class="flex items-center gap-2">
              <p-button
                label="Validar estructura"
                icon="pi pi-check-circle"
                [loading]="formationState.saving()"
                (onClick)="validateCourse()"
                styleClass="!bg-white !text-primary-700 !border-white shadow-md"
              />
              <a p-button label="Volver" icon="pi pi-arrow-left" [routerLink]="['/formation/courses']" severity="secondary" [outlined]="true"></a>
            </div>
          </div>
        </section>

        <div class="flex flex-col gap-6">
          <div class="flex items-center justify-between">
            <h2 class="text-h2 text-surface-900">Módulos</h2>
            <p-button
              label="Agregar módulo"
              icon="pi pi-plus"
              [disabled]="formationState.saving()"
              (onClick)="openCreateModule()"
            />
          </div>

          @for (mod of course.modules; track mod.id; let i = $index) {
            <app-module-card
              [module]="mod"
              [position]="i"
              [totalModules]="course.modules.length"
              [saving]="formationState.saving()"
              (moveUp)="moveModule(course.modules, i, 'up')"
              (moveDown)="moveModule(course.modules, i, 'down')"
              (edit)="openEditModule(mod)"
              (delete)="deleteModule(course.id, mod.id)"
              (select)="goToEvaluation(course.id, $event)"
              (addLesson)="openLessonDialog(mod.id)"
              (viewLesson)="viewLesson($event)"
              (lessonMoveUp)="moveLesson(mod.id, mod.lessons, $index, 'up')"
              (lessonMoveDown)="moveLesson(mod.id, mod.lessons, $index, 'down')"
              (deleteLesson)="deleteLesson(mod.id, $event)"
            />
          }

          @if (course.modules.length === 0) {
            <div class="flex flex-col items-center justify-center rounded-2xl border border-dashed border-surface-300 py-12 text-center">
              <span class="pi pi-folder-open text-4xl text-surface-300 mb-3" aria-hidden="true"></span>
              <p class="text-body text-muted-color">Este curso no tiene módulos aún.</p>
            </div>
          }
        </div>

        <p-dialog
          [header]="moduleDialogHeader()"
          [modal]="true"
          [visible]="moduleDialogVisible()"
          (onHide)="moduleDialogVisible.set(false)"
          [style]="{ width: '32rem' }"
        >
          <div class="flex flex-col gap-4">
            <div class="flex flex-col gap-1.5">
              <label for="moduleTitle" class="text-caption font-semibold uppercase tracking-wider text-muted-color">Título</label>
              <input
                pInputText
                id="moduleTitle"
                [ngModel]="moduleDialogTitle()"
                (ngModelChange)="moduleDialogTitle.set($event)"
                placeholder="Título del módulo..."
                class="w-full"
              />
            </div>
            <div class="flex flex-col gap-1.5">
              <label for="moduleDescription" class="text-caption font-semibold uppercase tracking-wider text-muted-color">Descripción</label>
              <textarea
                pTextarea
                id="moduleDescription"
                [ngModel]="moduleDialogDescription()"
                (ngModelChange)="moduleDialogDescription.set($event)"
                placeholder="Descripción (opcional)..."
                rows="3"
                class="w-full"
              ></textarea>
            </div>
          </div>
          <ng-template #footer>
            <p-button label="Cancelar" severity="secondary" [text]="true" (onClick)="moduleDialogVisible.set(false)" />
            <p-button
              label="Guardar"
              icon="pi pi-check"
              [loading]="formationState.saving()"
              [disabled]="!moduleDialogTitle().trim()"
              (onClick)="saveModule()"
            />
          </ng-template>
        </p-dialog>

        <p-dialog
          header="Nueva lección"
          [modal]="true"
          [visible]="lessonDialogVisible()"
          (onHide)="lessonDialogVisible.set(false)"
          [style]="{ width: '32rem' }"
        >
          <div class="flex flex-col gap-4">
            <div class="flex flex-col gap-1.5">
              <label for="lessonTitle" class="text-caption font-semibold uppercase tracking-wider text-muted-color">Título</label>
              <input
                pInputText
                id="lessonTitle"
                [ngModel]="lessonTitle()"
                (ngModelChange)="lessonTitle.set($event)"
                placeholder="Título de la lección..."
                class="w-full"
              />
            </div>
            <div class="flex flex-col gap-1.5">
              <label for="lessonDescription" class="text-caption font-semibold uppercase tracking-wider text-muted-color">Descripción</label>
              <textarea
                pTextarea
                id="lessonDescription"
                [ngModel]="lessonDescription()"
                (ngModelChange)="lessonDescription.set($event)"
                placeholder="Descripción (opcional)..."
                rows="3"
                class="w-full"
              ></textarea>
            </div>
            <div class="flex flex-col gap-1.5">
              <label for="lessonType" class="text-caption font-semibold uppercase tracking-wider text-muted-color">Tipo</label>
              <p-select
                id="lessonType"
                [ngModel]="lessonType()"
                (ngModelChange)="lessonType.set($event)"
                [options]="lessonTypeOptions"
                optionLabel="label"
                optionValue="value"
                placeholder="Seleccione..."
                appendTo="body"
                class="w-full"
              />
            </div>
          </div>
          <ng-template #footer>
            <p-button label="Cancelar" severity="secondary" [text]="true" (onClick)="lessonDialogVisible.set(false)" />
            <p-button
              label="Crear lección"
              icon="pi pi-check"
              [loading]="formationState.saving()"
              [disabled]="!lessonTitle().trim()"
              (onClick)="saveLesson()"
            />
          </ng-template>
        </p-dialog>
      }
    </div>
  `
})
export class FormationCourseDetail implements OnInit {
  private readonly route = inject(ActivatedRoute);
  protected readonly formationState = inject(FormationStateService);
  private readonly messageService = inject(MessageService);

  protected readonly moduleDialogVisible = signal(false);
  protected readonly moduleDialogHeader = signal('Nuevo módulo');
  protected readonly moduleDialogTitle = signal('');
  protected readonly moduleDialogDescription = signal('');
  protected readonly editingModuleId = signal<string | null>(null);

  protected readonly lessonDialogVisible = signal(false);
  protected readonly lessonTitle = signal('');
  protected readonly lessonDescription = signal('');
  protected readonly lessonType = signal<LessonType>('LESSON');
  protected readonly lessonDialogModuleId = signal<string | null>(null);

  protected readonly lessonTypeOptions = Object.entries(LESSON_TYPE_LABELS).map(([value, label]) => ({ label, value }));

  protected totalLessons = (): number => {
    const course = this.formationState.currentCourse();
    return course ? course.modules.reduce((sum, m) => sum + m.lessons.length, 0) : 0;
  };

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      void this.formationState.loadCourse(id);
    }
  }

  protected openCreateModule(): void {
    this.moduleDialogHeader.set('Nuevo módulo');
    this.moduleDialogTitle.set('');
    this.moduleDialogDescription.set('');
    this.editingModuleId.set(null);
    this.moduleDialogVisible.set(true);
  }

  protected openEditModule(mod: Module): void {
    this.moduleDialogHeader.set('Editar módulo');
    this.moduleDialogTitle.set(mod.title);
    this.moduleDialogDescription.set(mod.description ?? '');
    this.editingModuleId.set(mod.id);
    this.moduleDialogVisible.set(true);
  }

  protected async saveModule(): Promise<void> {
    const courseId = this.formationState.currentCourse()?.id;
    if (!courseId) return;

    const title = this.moduleDialogTitle();
    const description = this.moduleDialogDescription() || null;
    const moduleId = this.editingModuleId();

    try {
      if (moduleId) {
        await this.formationState.updateModule(moduleId, title, description);
        this.messageService.add({ severity: 'success', summary: 'Módulo actualizado', detail: 'El módulo se actualizó correctamente.' });
      } else {
        await this.formationState.addModule(courseId, title, description);
        this.messageService.add({ severity: 'success', summary: 'Módulo creado', detail: 'El módulo se creó correctamente.' });
      }
      this.moduleDialogVisible.set(false);
    } catch {
      this.messageService.add({ severity: 'error', summary: 'Error', detail: 'No se pudo guardar el módulo.' });
    }
  }

  protected async deleteModule(courseId: string, moduleId: string): Promise<void> {
    try {
      await this.formationState.deleteModule(courseId, moduleId);
      this.messageService.add({ severity: 'success', summary: 'Módulo eliminado', detail: 'El módulo se eliminó correctamente.' });
    } catch {
      this.messageService.add({ severity: 'error', summary: 'Error', detail: 'No se pudo eliminar el módulo.' });
    }
  }

  protected async moveModule(modules: Module[], index: number, direction: 'up' | 'down'): Promise<void> {
    const courseId = this.formationState.currentCourse()?.id;
    if (!courseId) return;
    await this.formationState.moveModule(courseId, modules, index, direction);
  }

  protected openLessonDialog(moduleId: string): void {
    this.lessonDialogModuleId.set(moduleId);
    this.lessonTitle.set('');
    this.lessonDescription.set('');
    this.lessonType.set('LESSON');
    this.lessonDialogVisible.set(true);
  }

  protected async saveLesson(): Promise<void> {
    const moduleId = this.lessonDialogModuleId();
    if (!moduleId) return;

    try {
      await this.formationState.addLesson(moduleId, this.lessonTitle(), this.lessonDescription() || null, this.lessonType());
      this.messageService.add({ severity: 'success', summary: 'Lección creada', detail: 'La lección se creó correctamente.' });
      this.lessonDialogVisible.set(false);
    } catch {
      this.messageService.add({ severity: 'error', summary: 'Error', detail: 'No se pudo crear la lección.' });
    }
  }

  protected viewLesson(lessonId: string): void {
    this.formationState.goToLesson(lessonId);
  }

  protected async deleteLesson(moduleId: string, lessonId: string): Promise<void> {
    try {
      await this.formationState.deleteLesson(moduleId, lessonId);
      this.messageService.add({ severity: 'success', summary: 'Lección eliminada', detail: 'La lección se eliminó correctamente.' });
    } catch {
      this.messageService.add({ severity: 'error', summary: 'Error', detail: 'No se pudo eliminar la lección.' });
    }
  }

  protected async moveLesson(moduleId: string, lessons: { id: string; position: number }[], index: number, direction: 'up' | 'down'): Promise<void> {
    await this.formationState.moveLesson(moduleId, lessons, index, direction);
  }

  protected goToEvaluation(courseId: string, moduleId: string): void {
    this.formationState.goToEvaluation(courseId, moduleId);
  }

  protected async validateCourse(): Promise<void> {
    const courseId = this.formationState.currentCourse()?.id;
    if (!courseId) return;

    const valid = await this.formationState.validateCourse(courseId);
    if (valid) {
      this.messageService.add({ severity: 'success', summary: 'Curso validado', detail: 'La estructura del curso es válida.' });
    } else {
      this.messageService.add({ severity: 'warn', summary: 'Validación fallida', detail: 'La estructura del curso tiene errores.' });
    }
  }

  protected statusLabel(value: string | null): string {
    return COURSE_STATUS_LABELS[value as keyof typeof COURSE_STATUS_LABELS] ?? value ?? '—';
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
