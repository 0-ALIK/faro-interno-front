import { Component, EventEmitter, input, output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { DialogModule } from 'primeng/dialog';
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';

@Component({
  selector: 'app-entity-dialog',
  imports: [FormsModule, DialogModule, InputTextModule, ButtonModule],
  template: `
    <p-dialog
      [header]="header()"
      [visible]="visible()"
      [modal]="true"
      [style]="{ width: '28rem' }"
      [closable]="true"
      (onHide)="close.emit()"
    >
      <div class="flex flex-col gap-4">
        <div class="flex flex-col gap-1.5">
          <label for="entityName" class="text-title">Nombre</label>
          <input
            pInputText
            id="entityName"
            [(ngModel)]="nameValue"
            [placeholder]="placeholder()"
            class="w-full"
            [maxlength]="maxLength()"
            autofocus
            (keyup.enter)="onSave()"
          />
        </div>
      </div>
      <ng-template pTemplate="footer">
        <p-button label="Cancelar" severity="secondary" [text]="true" (onClick)="close.emit()" />
        <p-button [label]="confirmLabel()" icon="pi pi-check" [loading]="saving()" (onClick)="onSave()" />
      </ng-template>
    </p-dialog>
  `
})
export class EntityDialog {
  readonly visible = input(false);
  readonly header = input('Crear');
  readonly placeholder = input('Nombre…');
  readonly confirmLabel = input('Guardar');
  readonly initialValue = input('');
  readonly maxLength = input(100);
  readonly saving = input(false);

  readonly save = output<string>();
  readonly close = output<void>();

  protected nameValue = '';

  ngOnChanges(): void {
    if (this.visible()) {
      this.nameValue = this.initialValue();
    }
  }

  protected onSave(): void {
    const trimmed = this.nameValue.trim();
    if (trimmed.length > 0) {
      this.save.emit(trimmed);
    }
  }
}