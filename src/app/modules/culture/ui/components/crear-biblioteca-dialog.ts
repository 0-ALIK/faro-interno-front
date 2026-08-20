import { Component, input, output, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { DialogModule } from 'primeng/dialog';
import { InputTextModule } from 'primeng/inputtext';
import { TextareaModule } from 'primeng/textarea';
import { ButtonModule } from 'primeng/button';

@Component({
  selector: 'app-crear-biblioteca-dialog',
  imports: [FormsModule, DialogModule, InputTextModule, TextareaModule, ButtonModule],
  template: `
    <p-dialog
      header="Nueva biblioteca"
      [visible]="visible()"
      [modal]="true"
      [style]="{ width: '28rem' }"
      [closable]="true"
      (onHide)="close.emit()"
    >
      <div class="flex flex-col gap-4">
        <div class="flex flex-col gap-1.5">
          <label for="lib-name" class="text-title">Nombre *</label>
          <input
            pInputText
            id="lib-name"
            [(ngModel)]="nameValue"
            placeholder="Nombre de la biblioteca"
            class="w-full"
            maxlength="150"
            autofocus
            (keyup.enter)="onSave()"
          />
        </div>
        <div class="flex flex-col gap-1.5">
          <label for="lib-desc" class="text-title">Descripción *</label>
          <textarea
            pTextarea
            id="lib-desc"
            [(ngModel)]="descriptionValue"
            rows="3"
            class="w-full"
            placeholder="Descripción de la biblioteca"
            maxlength="500"
          ></textarea>
        </div>
      </div>
      <ng-template pTemplate="footer">
        <p-button label="Cancelar" severity="secondary" [text]="true" (onClick)="close.emit()" />
        <p-button label="Crear biblioteca" icon="pi pi-check" [loading]="saving()" [disabled]="!isValid()" (onClick)="onSave()" />
      </ng-template>
    </p-dialog>
  `
})
export class CrearBibliotecaDialog {
  readonly visible = input(false);
  readonly saving = input(false);

  readonly created = output<{ name: string; description: string }>();
  readonly close = output<void>();

  nameValue = '';
  descriptionValue = '';

  protected isValid(): boolean {
    return this.nameValue.trim().length > 0 && this.descriptionValue.trim().length > 0;
  }

  protected onSave(): void {
    if (!this.isValid()) return;
    this.created.emit({
      name: this.nameValue.trim(),
      description: this.descriptionValue.trim()
    });
    this.nameValue = '';
    this.descriptionValue = '';
  }
}
