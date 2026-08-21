import { Component, computed, inject, input, output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { DialogModule } from 'primeng/dialog';
import { InputTextModule } from 'primeng/inputtext';
import { TextareaModule } from 'primeng/textarea';
import { SelectModule } from 'primeng/select';
import { DatePickerModule } from 'primeng/datepicker';
import { ButtonModule } from 'primeng/button';

import { CultureStateService } from '../../services/culture-state.service';

@Component({
  selector: 'app-crear-evento-dialog',
  imports: [FormsModule, DialogModule, InputTextModule, TextareaModule, SelectModule, DatePickerModule, ButtonModule],
  template: `
    <p-dialog
      header="Nuevo evento"
      [visible]="visible()"
      [modal]="true"
      [style]="{ width: '32rem' }"
      [closable]="true"
      (onHide)="close.emit()"
    >
      <div class="flex flex-col gap-4">
        <div class="flex flex-col gap-1.5">
          <label for="evt-name" class="text-title">Nombre *</label>
          <input pInputText id="evt-name" [(ngModel)]="name" placeholder="Nombre del evento" class="w-full" maxlength="150" autofocus />
        </div>

        <div class="grid grid-cols-2 gap-4">
          <div class="flex flex-col gap-1.5">
            <label for="evt-type" class="text-title">Tipo *</label>
            <p-select id="evt-type" [(ngModel)]="typeId" [options]="cultureState.typeEventOptions()" optionLabel="label" optionValue="value" placeholder="Seleccione…" appendTo="body" class="w-full" (onShow)="onLoadTypeEvents()" />
          </div>
          <div class="flex flex-col gap-1.5">
            <label for="evt-library" class="text-title">Biblioteca *</label>
            <p-select id="evt-library" [(ngModel)]="libraryId" [options]="libraryOptions" optionLabel="label" optionValue="value" placeholder="Seleccione…" appendTo="body" class="w-full" />
          </div>
        </div>

        <div class="flex flex-col gap-1.5">
          <label for="evt-date" class="text-title">Fecha *</label>
          <p-datepicker id="evt-date" [(ngModel)]="selectedDate" [showIcon]="true" dateFormat="dd/mm/yy" placeholder="Seleccione fecha" class="w-full" />
        </div>

        <div class="grid grid-cols-2 gap-4">
          <div class="flex flex-col gap-1.5">
            <label for="evt-start" class="text-title">Hora inicio *</label>
            <input pInputText id="evt-start" type="time" [(ngModel)]="startTime" class="w-full" />
          </div>
          <div class="flex flex-col gap-1.5">
            <label for="evt-end" class="text-title">Hora fin *</label>
            <input pInputText id="evt-end" type="time" [(ngModel)]="endTime" class="w-full" />
          </div>
        </div>

        <div class="flex flex-col gap-1.5">
          <label for="evt-desc" class="text-title">Descripción *</label>
          <textarea pTextarea id="evt-desc" [(ngModel)]="description" rows="3" class="w-full" placeholder="Descripción del evento" maxlength="1000"></textarea>
        </div>
      </div>

      <ng-template pTemplate="footer">
        <p-button label="Cancelar" severity="secondary" [text]="true" (onClick)="close.emit()" />
        <p-button label="Crear evento" icon="pi pi-check" [loading]="saving()" [disabled]="!isValid()" (onClick)="onSave()" />
      </ng-template>
    </p-dialog>
  `
})
export class CrearEventoDialog {
  readonly visible = input(false);
  readonly saving = input(false);

  readonly created = output<{ name: string; typeId: string; libraryId: string; day: number; month: number; year: number; startTimeHour: number; startTimeMin: number; endTimeHour: number; endTimeMin: number; description: string }>();
  readonly close = output<void>();

  protected readonly cultureState = inject(CultureStateService);

  name = '';
  typeId: string | null = null;
  libraryId: string | null = null;
  selectedDate: Date | null = null;
  startTime = '';
  endTime = '';
  description = '';

  protected readonly libraryOptions = computed(() =>
    this.cultureState.libraries().map((lib) => ({ label: lib.name, value: lib.id }))
  );

  protected isValid(): boolean {
    return (
      this.name.trim().length > 0 &&
      !!this.typeId &&
      !!this.libraryId &&
      !!this.selectedDate &&
      this.startTime.length > 0 &&
      this.endTime.length > 0 &&
      this.description.trim().length > 0
    );
  }

  protected onSave(): void {
    if (!this.isValid()) return;
    const d = this.selectedDate!;
    const [sh, sm] = this.startTime.split(':').map(Number);
    const [eh, em] = this.endTime.split(':').map(Number);
    this.created.emit({
      name: this.name.trim(),
      typeId: this.typeId!,
      libraryId: this.libraryId!,
      day: d.getDate(),
      month: d.getMonth() + 1,
      year: d.getFullYear(),
      startTimeHour: sh,
      startTimeMin: sm,
      endTimeHour: eh,
      endTimeMin: em,
      description: this.description.trim()
    });
  }

  protected onLoadTypeEvents(): void {
    void this.cultureState.loadTypeEvents();
  }

  protected onLoadLibraries(): void {
    void this.cultureState.loadLibraries();
  }
}
