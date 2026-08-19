import { Component, input, output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { DialogModule } from 'primeng/dialog';
import { InputTextModule } from 'primeng/inputtext';
import { SelectModule } from 'primeng/select';
import { ButtonModule } from 'primeng/button';

import type { ProviderType } from '../../models/catalog.model';
import { PROVIDER_TYPE_LABELS } from '../../models/catalog-labels';

@Component({
  selector: 'app-provider-dialog',
  imports: [FormsModule, DialogModule, InputTextModule, SelectModule, ButtonModule],
  template: `
    <p-dialog
      [header]="header()"
      [visible]="visible()"
      [modal]="true"
      [style]="{ width: '32rem' }"
      [closable]="true"
      (onHide)="close.emit()"
    >
      <div class="flex flex-col gap-4">
        <div class="flex flex-col gap-1.5">
          <label for="providerName" class="text-title">Nombre</label>
          <input
            pInputText
            id="providerName"
            [(ngModel)]="nameValue"
            placeholder="Nombre del proveedor…"
            class="w-full"
            maxlength="100"
            autofocus
          />
        </div>
        <div class="flex flex-col gap-1.5">
          <label for="providerType" class="text-title">Tipo</label>
          <p-select
            id="providerType"
            [(ngModel)]="typeValue"
            [options]="typeOptions"
            optionLabel="label"
            optionValue="value"
            placeholder="Seleccione…"
            class="w-full"
          />
        </div>
      </div>
      <ng-template pTemplate="footer">
        <p-button label="Cancelar" severity="secondary" [text]="true" (onClick)="close.emit()" />
        <p-button label="Guardar" icon="pi pi-check" [loading]="saving()" [disabled]="!nameValue.trim() || !typeValue" (onClick)="onSave()" />
      </ng-template>
    </p-dialog>
  `
})
export class ProviderDialog {
  readonly visible = input(false);
  readonly header = input('Crear proveedor');
  readonly initialName = input('');
  readonly initialType = input<ProviderType | null>(null);
  readonly saving = input(false);

  readonly save = output<{ name: string; type: ProviderType }>();
  readonly close = output<void>();

  protected nameValue = '';
  protected typeValue: ProviderType | null = null;

  protected readonly typeOptions = Object.entries(PROVIDER_TYPE_LABELS).map(([value, label]) => ({
    label,
    value
  }));

  ngOnChanges(): void {
    if (this.visible()) {
      this.nameValue = this.initialName();
      this.typeValue = this.initialType();
    }
  }

  protected onSave(): void {
    const trimmed = this.nameValue.trim();
    if (trimmed && this.typeValue) {
      this.save.emit({ name: trimmed, type: this.typeValue });
    }
  }
}