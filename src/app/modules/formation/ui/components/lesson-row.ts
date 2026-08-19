import { Component, input, output } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { TagModule } from 'primeng/tag';

import type { Lesson } from '../../models/formation.model';
import { LESSON_TYPE_LABELS, labelOf } from '../../models/formation-labels';

@Component({
  selector: 'app-lesson-row',
  imports: [ButtonModule, TagModule],
  template: `
    <div class="flex items-center gap-3 rounded-xl bg-surface-50 px-4 py-3">
      <span class="text-caption text-muted-color w-6 text-center">{{ position() + 1 }}</span>
      <p-tag
        [value]="labelOf(LESSON_TYPE_LABELS, lesson().type)"
        [severity]="lesson().type === 'LESSON' ? 'info' : 'warn'"
        styleClass="!text-xs"
      />
      <span class="text-body flex-1 min-w-0 truncate">{{ lesson().title }}</span>
      <div class="flex items-center gap-1">
        <p-button
          icon="pi pi-chevron-up"
          [rounded]="true"
          [text]="true"
          severity="secondary"
          size="small"
          [disabled]="position() === 0 || saving()"
          (onClick)="moveUp.emit()"
        />
        <p-button
          icon="pi pi-chevron-down"
          [rounded]="true"
          [text]="true"
          severity="secondary"
          size="small"
          [disabled]="position() >= totalLessons() - 1 || saving()"
          (onClick)="moveDown.emit()"
        />
        <p-button
          icon="pi pi-eye"
          [rounded]="true"
          [text]="true"
          severity="secondary"
          size="small"
          (onClick)="view.emit()"
        />
        <p-button
          icon="pi pi-trash"
          [rounded]="true"
          [text]="true"
          severity="danger"
          size="small"
          [disabled]="saving()"
          (onClick)="delete.emit()"
        />
      </div>
    </div>
  `
})
export class LessonRow {
  readonly lesson = input.required<Lesson>();
  readonly position = input.required<number>();
  readonly totalLessons = input.required<number>();
  readonly saving = input(false);

  readonly moveUp = output<void>();
  readonly moveDown = output<void>();
  readonly view = output<void>();
  readonly delete = output<void>();

  protected readonly LESSON_TYPE_LABELS = LESSON_TYPE_LABELS;
  protected readonly labelOf = labelOf;
}
