import { Component, inject, input, output, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { DialogModule } from 'primeng/dialog';
import { InputTextModule } from 'primeng/inputtext';
import { TextareaModule } from 'primeng/textarea';
import { SelectModule } from 'primeng/select';
import { ButtonModule } from 'primeng/button';

import { COURSE_LEVEL_LABELS, COURSE_MODALITY_LABELS, COURSE_ORIGIN_LABELS, ENROLLMENT_MODE_LABELS } from '../../models/catalog-labels';

@Component({
  selector: 'app-create-course-dialog',
  imports: [FormsModule, DialogModule, InputTextModule, TextareaModule, SelectModule, ButtonModule],
  template: `
    <p-dialog
      header="Nuevo curso"
      [visible]="visible()"
      [modal]="true"
      [style]="{ width: '32rem' }"
      [closable]="true"
      (onHide)="close.emit()"
    >
      <div class="flex flex-col gap-4">
        <div class="flex flex-col gap-1.5">
          <label for="crs-title" class="text-title">Título *</label>
          <input pInputText id="crs-title" [(ngModel)]="title" placeholder="Nombre del curso" class="w-full" maxlength="200" autofocus (keyup.enter)="onSave()" />
        </div>

        <div class="grid grid-cols-2 gap-4">
          <div class="flex flex-col gap-1.5">
            <label for="crs-modality" class="text-title">Modalidad *</label>
            <p-select id="crs-modality" [(ngModel)]="modality" [options]="modalityOptions" optionLabel="label" optionValue="value" placeholder="Seleccione…" class="w-full" />
          </div>

          <div class="flex flex-col gap-1.5">
            <label for="crs-level" class="text-title">Nivel *</label>
            <p-select id="crs-level" [(ngModel)]="level" [options]="levelOptions" optionLabel="label" optionValue="value" placeholder="Seleccione…" class="w-full" />
          </div>

          <div class="flex flex-col gap-1.5">
            <label for="crs-origin" class="text-title">Origen *</label>
            <p-select id="crs-origin" [(ngModel)]="origin" [options]="originOptions" optionLabel="label" optionValue="value" placeholder="Seleccione…" class="w-full" />
          </div>

          <div class="flex flex-col gap-1.5">
            <label for="crs-enrollment" class="text-title">Inscripción</label>
            <p-select id="crs-enrollment" [(ngModel)]="enrollmentMode" [options]="enrollmentOptions" optionLabel="label" optionValue="value" placeholder="Seleccione…" class="w-full" />
          </div>
        </div>

        <div class="flex flex-col gap-1.5">
          <label for="crs-description" class="text-title">Descripción</label>
          <textarea pTextarea id="crs-description" [(ngModel)]="description" rows="3" class="w-full" placeholder="Descripción del curso (máx. 2000 caracteres)" maxlength="2000"></textarea>
        </div>
      </div>

      <ng-template pTemplate="footer">
        <p-button label="Cancelar" severity="secondary" [text]="true" (onClick)="close.emit()" />
        <p-button label="Crear curso" icon="pi pi-check" [loading]="saving()" [disabled]="!isValid()" (onClick)="onSave()" />
      </ng-template>
    </p-dialog>
  `
})
export class CreateCourseDialog {
  readonly visible = input(false);
  readonly saving = input(false);

  readonly created = output<{ title: string; modality: string; level: string; origin: string; enrollmentMode: string; description: string }>();
  readonly close = output<void>();

  title = '';
  modality: string | null = null;
  level: string | null = null;
  origin: string | null = null;
  enrollmentMode = 'OPEN';
  description = '';

  protected readonly modalityOptions = Object.entries(COURSE_MODALITY_LABELS).map(([value, label]) => ({ label, value }));
  protected readonly levelOptions = Object.entries(COURSE_LEVEL_LABELS).map(([value, label]) => ({ label, value }));
  protected readonly originOptions = Object.entries(COURSE_ORIGIN_LABELS).map(([value, label]) => ({ label, value }));
  protected readonly enrollmentOptions = Object.entries(ENROLLMENT_MODE_LABELS).map(([value, label]) => ({ label, value }));

  protected isValid(): boolean {
    return this.title.trim().length > 0 && !!this.modality && !!this.level && !!this.origin;
  }

  protected onSave(): void {
    if (!this.isValid()) return;
    this.created.emit({
      title: this.title.trim(),
      modality: this.modality!,
      level: this.level!,
      origin: this.origin!,
      enrollmentMode: this.enrollmentMode,
      description: this.description.trim()
    });
  }
}
