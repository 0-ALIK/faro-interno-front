import { Component, OnInit, inject, signal } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { InputTextModule } from 'primeng/inputtext';
import { TextareaModule } from 'primeng/textarea';
import { SelectModule } from 'primeng/select';
import { EditorModule } from 'primeng/editor';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { MessageModule } from 'primeng/message';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';

import { FormationStateService } from '../../services/formation-state.service';
import { ContentTypeSelector } from '../components/content-type-selector';
import { ResourceList } from '../components/resource-list';
import { LESSON_TYPE_LABELS } from '../../models/formation-labels';
import type { ContentType, LessonType } from '../../models/formation.model';

@Component({
  selector: 'app-lesson-editor',
  imports: [
    FormsModule,
    RouterLink,
    ButtonModule,
    CardModule,
    InputTextModule,
    TextareaModule,
    SelectModule,
    EditorModule,
    ProgressSpinnerModule,
    MessageModule,
    ToastModule,
    ContentTypeSelector,
    ResourceList
  ],
  providers: [MessageService],
  template: `
    <p-toast />
    <div class="flex flex-col gap-6">
      @if (formationState.lessonLoading()) {
        <div class="flex items-center justify-center py-20">
          <p-progressSpinner strokeWidth="4" />
        </div>
      } @else if (formationState.lessonError()) {
        <p-message severity="error">{{ formationState.lessonError() }}</p-message>
      } @else if (formationState.currentLesson(); as lesson) {
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
                <a p-button label="Volver" icon="pi pi-arrow-left" [routerLink]="['/formation/courses', lesson.moduleId]" severity="secondary" [outlined]="true"></a>
              </div>
              <h1 class="text-h1 text-white">{{ lesson.title }}</h1>
              <p class="mt-2 text-body text-primary-100">{{ lessonTypeLabel(lesson.type) }}</p>
            </div>
          </div>
        </section>

        <div class="grid grid-cols-1 gap-6 xl:grid-cols-3">
          <div class="flex flex-col gap-6 xl:col-span-2">
            <p-card>
              <ng-template #title>Información de la lección</ng-template>
              <ng-template #content>
                <div class="flex flex-col gap-4">
                  <div class="flex flex-col gap-1.5">
                    <label for="lessonTitle" class="text-caption font-semibold uppercase tracking-wider text-muted-color">Título</label>
                    <input
                      pInputText
                      id="lessonTitle"
                      [(ngModel)]="lessonTitle"
                      class="w-full"
                    />
                  </div>
                  <div class="flex flex-col gap-1.5">
                    <label for="lessonDescription" class="text-caption font-semibold uppercase tracking-wider text-muted-color">Descripción</label>
                    <textarea
                      pTextarea
                      id="lessonDescription"
                      [(ngModel)]="lessonDescription"
                      rows="3"
                      class="w-full"
                    ></textarea>
                  </div>
                  <div class="flex flex-col gap-1.5">
                    <label class="text-caption font-semibold uppercase tracking-wider text-muted-color">Tipo</label>
                    <p-select
                      [(ngModel)]="lessonTypeValue"
                      [options]="lessonTypeOptions"
                      optionLabel="label"
                      optionValue="value"
                      class="w-full md:w-56"
                    />
                  </div>
                </div>
              </ng-template>
            </p-card>

            <p-card>
              <ng-template #title>Contenido principal</ng-template>
              <ng-template #content>
                <div class="flex flex-col gap-4">
                  <app-content-type-selector
                    [selected]="contentType()"
                    (select)="contentType.set($event)"
                  />

                  @switch (contentType()) {
                    @case ('ARTICLE') {
                      <p-editor
                        [(ngModel)]="articleContent"
                        [modules]="quillModules"
                        [style]="{ height: '320px' }"
                        placeholder="Escribí el contenido del artículo..."
                      />
                      <p-button
                        label="Guardar artículo"
                        icon="pi pi-check"
                        [loading]="formationState.saving()"
                        (onClick)="saveArticle()"
                      />
                    }
                    @case ('VIDEO') {
                      <div class="flex flex-col items-center justify-center rounded-2xl border border-dashed border-surface-300 py-12 text-center">
                        <span class="pi pi-video text-4xl text-surface-300 mb-3" aria-hidden="true"></span>
                        <p class="text-body text-muted-color mb-4">Subí un archivo de video</p>
                        <input
                          #videoInput
                          type="file"
                          accept="video/*"
                          class="hidden"
                          (change)="onFileSelected($event, 'VIDEO')"
                        />
                        <p-button
                          label="Seleccionar video"
                          icon="pi pi-upload"
                          severity="secondary"
                          [outlined]="true"
                          (onClick)="videoInput.click()"
                        />
                      </div>
                    }
                    @case ('PDF') {
                      <div class="flex flex-col items-center justify-center rounded-2xl border border-dashed border-surface-300 py-12 text-center">
                        <span class="pi pi-file-pdf text-4xl text-surface-300 mb-3" aria-hidden="true"></span>
                        <p class="text-body text-muted-color mb-4">Subí un archivo PDF</p>
                        <input
                          #pdfInput
                          type="file"
                          accept=".pdf"
                          class="hidden"
                          (change)="onFileSelected($event, 'PDF')"
                        />
                        <p-button
                          label="Seleccionar PDF"
                          icon="pi pi-upload"
                          severity="secondary"
                          [outlined]="true"
                          (onClick)="pdfInput.click()"
                        />
                      </div>
                    }
                  }
                </div>
              </ng-template>
            </p-card>
          </div>

          <div class="flex flex-col gap-6">
            <p-card>
              <ng-template #title>Recursos</ng-template>
              <ng-template #content>
                <app-resource-list
                  [resources]="lesson.resources"
                  [saving]="formationState.saving()"
                  (add)="onFileSelectedForResource($event)"
                  (delete)="deleteResource($event)"
                />
              </ng-template>
            </p-card>
          </div>
        </div>

        <div class="flex items-center justify-end gap-3">
          <a p-button label="Cancelar" severity="secondary" [text]="true" [routerLink]="['/formation/courses', lesson.moduleId]"></a>
          <p-button
            label="Guardar"
            icon="pi pi-check"
            [loading]="formationState.saving()"
            (onClick)="saveLesson()"
          />
        </div>
      }
    </div>
  `
})
export class LessonEditor implements OnInit {
  private readonly route = inject(ActivatedRoute);
  protected readonly formationState = inject(FormationStateService);
  private readonly messageService = inject(MessageService);

  protected readonly contentType = signal<ContentType | null>(null);
  protected articleContent = '';
  protected lessonTitle = '';
  protected lessonDescription = '';
  protected lessonTypeValue: LessonType = 'LESSON';

  protected readonly lessonTypeOptions = Object.entries(LESSON_TYPE_LABELS).map(([value, label]) => ({
    value: value as LessonType,
    label
  }));

  protected readonly quillModules = {
    toolbar: [
      ['bold', 'italic', 'underline', 'strike'],
      ['blockquote', 'code-block'],
      [{ list: 'ordered' }, { list: 'bullet' }],
      [{ header: [1, 2, 3, 4, 5, 6, false] }],
      ['link'],
      ['clean']
    ]
  };

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      void this.formationState.loadLesson(id);
    }
  }

  protected lessonTypeLabel(type: LessonType): string {
    return LESSON_TYPE_LABELS[type] ?? type;
  }

  protected async saveLesson(): Promise<void> {
    const lesson = this.formationState.currentLesson();
    if (!lesson) return;

    try {
      await this.formationState.updateLesson(lesson.id, this.lessonTitle, this.lessonDescription || null, this.lessonTypeValue);
      this.messageService.add({ severity: 'success', summary: 'Lección guardada', detail: 'Los cambios se guardaron correctamente.' });
    } catch {
      this.messageService.add({ severity: 'error', summary: 'Error', detail: 'No se pudo guardar la lección.' });
    }
  }

  protected async assignContent(type: ContentType): Promise<void> {
    const lesson = this.formationState.currentLesson();
    if (!lesson) return;

    this.contentType.set(type);

    if (type === 'ARTICLE') {
      const content = lesson.mainContent?.article?.content ?? '';
      this.articleContent = content;
    }
  }

  protected async onFileSelected(event: Event, type: ContentType): Promise<void> {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];
    if (!file) return;

    const lesson = this.formationState.currentLesson();
    if (!lesson) return;

    const formData = new FormData();
    formData.append('file', file);
    formData.append('type', type);

    try {
      await this.formationState.assignMainContent(lesson.id, formData);
      this.messageService.add({ severity: 'success', summary: 'Archivo subido', detail: 'El archivo se subió correctamente.' });
    } catch {
      this.messageService.add({ severity: 'error', summary: 'Error', detail: 'No se pudo subir el archivo.' });
    }

    input.value = '';
  }

  protected async saveArticle(): Promise<void> {
    const lesson = this.formationState.currentLesson();
    if (!lesson) return;

    const articleId = lesson.mainContent?.article?.id;
    if (articleId) {
      try {
        await this.formationState.updateArticle(lesson.id, articleId, this.articleContent);
        this.messageService.add({ severity: 'success', summary: 'Artículo guardado', detail: 'El artículo se guardó correctamente.' });
      } catch {
        this.messageService.add({ severity: 'error', summary: 'Error', detail: 'No se pudo guardar el artículo.' });
      }
    }
  }

  protected async onFileSelectedForResource(file: File): Promise<void> {
    const lesson = this.formationState.currentLesson();
    if (!lesson) return;

    const formData = new FormData();
    formData.append('file', file);

    try {
      await this.formationState.addResource(lesson.id, formData);
      this.messageService.add({ severity: 'success', summary: 'Recurso agregado', detail: 'El recurso se agregó correctamente.' });
    } catch {
      this.messageService.add({ severity: 'error', summary: 'Error', detail: 'No se pudo agregar el recurso.' });
    }
  }

  protected async deleteResource(resourceId: string): Promise<void> {
    const lesson = this.formationState.currentLesson();
    if (!lesson) return;

    try {
      await this.formationState.deleteResource(lesson.id, resourceId);
      this.messageService.add({ severity: 'success', summary: 'Recurso eliminado', detail: 'El recurso se eliminó correctamente.' });
    } catch {
      this.messageService.add({ severity: 'error', summary: 'Error', detail: 'No se pudo eliminar el recurso.' });
    }
  }
}
