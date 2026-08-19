import { Component, input, output } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { TagModule } from 'primeng/tag';
import { DividerModule } from 'primeng/divider';

import type { Lesson, Module } from '../../models/formation.model';
import { LESSON_TYPE_LABELS, labelOf } from '../../models/formation-labels';

@Component({
  selector: 'app-module-card',
  imports: [ButtonModule, CardModule, TagModule, DividerModule],
  template: `
    <p-card styleClass="shadow-sm rounded-2xl">
      <ng-template pTemplate="header">
        <div class="flex items-center gap-2 px-4 pt-4">
          <p-tag [value]="'Módulo ' + (position() + 1)" severity="info" />
          <span class="ml-auto text-caption text-muted-color">{{ module().lessons.length }} lecciones</span>
        </div>
      </ng-template>

      <div class="flex flex-col gap-3">
        <div class="flex items-start justify-between">
          <div class="flex-1 min-w-0">
            <h3 class="text-title font-semibold">{{ module().title }}</h3>
            @if (module().description) {
              <p class="text-body text-muted-color mt-1">{{ module().description }}</p>
            }
          </div>
          <div class="flex items-center gap-1">
            <p-button
              icon="pi pi-chevron-up"
              [rounded]="true"
              [text]="true"
              severity="secondary"
              size="small"
              [disabled]="position() === 0 || saving()"
              (onClick)="moveUp.emit()"
              pTooltip="Mover arriba"
            />
            <p-button
              icon="pi pi-chevron-down"
              [rounded]="true"
              [text]="true"
              severity="secondary"
              size="small"
              [disabled]="position() >= totalModules() - 1 || saving()"
              (onClick)="moveDown.emit()"
              pTooltip="Mover abajo"
            />
            <p-button
              icon="pi pi-pencil"
              [rounded]="true"
              [text]="true"
              severity="secondary"
              size="small"
              [disabled]="saving()"
              (onClick)="edit.emit()"
              pTooltip="Editar"
            />
            <p-button
              icon="pi pi-trash"
              [rounded]="true"
              [text]="true"
              severity="danger"
              size="small"
              [disabled]="saving()"
              (onClick)="delete.emit()"
              pTooltip="Eliminar"
            />
          </div>
        </div>

        <p-divider styleClass="!my-1" />

        <div class="flex flex-col gap-2">
          @if (module().lessons.length === 0) {
            <p class="text-caption text-muted-color">Sin lecciones</p>
          } @else {
            @for (lesson of module().lessons; track lesson.id; let i = $index) {
              <div class="flex items-center gap-2 rounded-lg bg-surface-50 px-3 py-2">
                <p-tag
                  [value]="labelOf(LESSON_TYPE_LABELS, lesson.type)"
                  [severity]="lesson.type === 'LESSON' ? 'info' : 'warn'"
                  styleClass="!text-xs"
                />
                <span class="text-body flex-1 min-w-0 truncate">{{ lesson.title }}</span>
                <div class="flex items-center gap-1">
                  <p-button
                    icon="pi pi-chevron-up"
                    [rounded]="true"
                    [text]="true"
                    severity="secondary"
                    size="small"
                    [disabled]="i === 0 || saving()"
                    (onClick)="lessonMoveUp.emit(lesson.id)"
                  />
                  <p-button
                    icon="pi pi-chevron-down"
                    [rounded]="true"
                    [text]="true"
                    severity="secondary"
                    size="small"
                    [disabled]="i === module().lessons.length - 1 || saving()"
                    (onClick)="lessonMoveDown.emit(lesson.id)"
                  />
                  <p-button
                    icon="pi pi-eye"
                    [rounded]="true"
                    [text]="true"
                    severity="secondary"
                    size="small"
                    (onClick)="viewLesson.emit(lesson.id)"
                  />
                  <p-button
                    icon="pi pi-trash"
                    [rounded]="true"
                    [text]="true"
                    severity="danger"
                    size="small"
                    [disabled]="saving()"
                    (onClick)="deleteLesson.emit(lesson.id)"
                  />
                </div>
              </div>
            }
          }
        </div>

        <p-divider styleClass="!my-1" />

        <p-button
          label="Ver evaluación"
          icon="pi pi-clipboard"
          severity="secondary"
          [outlined]="true"
          [disabled]="saving()"
          (onClick)="select.emit(module().id)"
          styleClass="w-full"
        />

        <p-button
          label="Agregar lección"
          icon="pi pi-plus"
          severity="secondary"
          [outlined]="true"
          [disabled]="saving()"
          (onClick)="addLesson.emit()"
        />
      </div>
    </p-card>
  `
})
export class ModuleCard {
  readonly module = input.required<Module>();
  readonly position = input.required<number>();
  readonly totalModules = input.required<number>();
  readonly saving = input(false);

  readonly moveUp = output<void>();
  readonly moveDown = output<void>();
  readonly edit = output<void>();
  readonly delete = output<void>();
  readonly select = output<string>();
  readonly addLesson = output<void>();
  readonly viewLesson = output<string>();
  readonly lessonMoveUp = output<string>();
  readonly lessonMoveDown = output<string>();
  readonly deleteLesson = output<string>();

  protected readonly LESSON_TYPE_LABELS = LESSON_TYPE_LABELS;
  protected readonly labelOf = labelOf;
}
