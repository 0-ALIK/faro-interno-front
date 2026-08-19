import { Component, inject, OnInit, signal } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { TableModule } from 'primeng/table';
import { TagModule } from 'primeng/tag';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';

import { CatalogStateService } from '../../services/catalog-state.service';
import { ProviderDialog } from '../components/provider-dialog';
import { PROVIDER_TYPE_LABELS } from '../../models/catalog-labels';
import type { Provider, ProviderType } from '../../models/catalog.model';

@Component({
  selector: 'app-provider-list',
  imports: [ButtonModule, CardModule, TableModule, TagModule, ToastModule, ProviderDialog],
  providers: [MessageService],
  template: `
    <p-toast />
    <div class="flex flex-col gap-6">
      <div class="flex items-center justify-between">
        <div>
          <h1 class="text-h2">Proveedores</h1>
          <p class="text-body text-muted-color">Gestiona los proveedores del catálogo.</p>
        </div>
        <p-button label="Nuevo proveedor" icon="pi pi-plus" (onClick)="openCreate()" />
      </div>

      <div class="overflow-hidden rounded-2xl border border-surface-200 bg-surface-0 shadow-sm">
        <p-table
          [value]="catalogState.providers()"
          [loading]="loading()"
          dataKey="id"
          [tableStyle]="{ 'min-width': '40rem' }"
        >
          <ng-template pTemplate="header">
            <tr>
              <th class="!bg-primary-50 !text-primary-900 uppercase">Nombre</th>
              <th class="!bg-primary-50 !text-primary-900 uppercase">Tipo</th>
              <th class="!bg-primary-50 !text-primary-900 uppercase w-24">Acciones</th>
            </tr>
          </ng-template>
          <ng-template pTemplate="body" let-prv>
            <tr class="transition-colors hover:bg-surface-50">
              <td class="font-semibold text-surface-900">{{ prv.name }}</td>
              <td>
                <p-tag [value]="typeLabel(prv.type)" />
              </td>
              <td>
                <div class="flex gap-1">
                  <p-button icon="pi pi-pencil" [rounded]="true" [text]="true" severity="info" size="small" (onClick)="openRename(prv)" ariaLabel="Renombrar" />
                  <p-button icon="pi pi-refresh" [rounded]="true" [text]="true" severity="warn" size="small" (onClick)="openChangeType(prv)" ariaLabel="Cambiar tipo" />
                </div>
              </td>
            </tr>
          </ng-template>
          <ng-template pTemplate="emptydata">
            <tr>
              <td colspan="3" class="py-10 text-center text-muted-color">
                No hay proveedores registrados.
              </td>
            </tr>
          </ng-template>
        </p-table>
      </div>
    </div>

    <app-provider-dialog
      [visible]="dialogVisible()"
      [header]="dialogHeader()"
      [initialName]="dialogInitialName()"
      [initialType]="dialogInitialType()"
      [saving]="saving()"
      (save)="onSave($event)"
      (close)="closeDialog()"
    />
  `
})
export class ProviderList implements OnInit {
  protected readonly catalogState = inject(CatalogStateService);
  private readonly messageService = inject(MessageService);

  protected readonly loading = signal(false);
  protected readonly saving = signal(false);
  protected readonly dialogVisible = signal(false);
  protected readonly dialogHeader = signal('Crear proveedor');
  protected readonly dialogInitialName = signal('');
  protected readonly dialogInitialType = signal<ProviderType | null>(null);
  private editingId: string | null = null;
  private isRenameOnly = false;

  ngOnInit(): void {
    if (this.catalogState.providers().length === 0) {
      this.loading.set(true);
      this.catalogState.loadAll().finally(() => this.loading.set(false));
    }
  }

  protected typeLabel(type: string): string {
    return PROVIDER_TYPE_LABELS[type as keyof typeof PROVIDER_TYPE_LABELS] ?? type;
  }

  protected openCreate(): void {
    this.editingId = null;
    this.isRenameOnly = false;
    this.dialogHeader.set('Crear proveedor');
    this.dialogInitialName.set('');
    this.dialogInitialType.set(null);
    this.dialogVisible.set(true);
  }

  protected openRename(prv: Provider): void {
    this.editingId = prv.id;
    this.isRenameOnly = true;
    this.dialogHeader.set('Renombrar proveedor');
    this.dialogInitialName.set(prv.name);
    this.dialogInitialType.set(prv.type);
    this.dialogVisible.set(true);
  }

  protected openChangeType(prv: Provider): void {
    this.editingId = prv.id;
    this.isRenameOnly = false;
    this.dialogHeader.set('Cambiar tipo de proveedor');
    this.dialogInitialName.set(prv.name);
    this.dialogInitialType.set(prv.type);
    this.dialogVisible.set(true);
  }

  protected closeDialog(): void {
    this.dialogVisible.set(false);
  }

  protected async onSave(data: { name: string; type: ProviderType }): Promise<void> {
    this.saving.set(true);
    try {
      if (this.isRenameOnly && this.editingId) {
        await this.catalogState.renameProvider(this.editingId, data.name);
        this.messageService.add({ severity: 'success', summary: 'Actualizado', detail: 'Proveedor renombrado.' });
      } else if (this.editingId) {
        await this.catalogState.changeProviderType(this.editingId, data.type);
        this.messageService.add({ severity: 'success', summary: 'Actualizado', detail: 'Tipo de proveedor cambiado.' });
      } else {
        await this.catalogState.createProvider(data.name, data.type);
        this.messageService.add({ severity: 'success', summary: 'Creado', detail: 'Nuevo proveedor agregado.' });
      }
      this.closeDialog();
    } finally {
      this.saving.set(false);
    }
  }
}