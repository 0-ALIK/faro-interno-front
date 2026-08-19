import { Component, inject, OnInit, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { TableModule } from 'primeng/table';
import { TagModule } from 'primeng/tag';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';
import { InputTextModule } from 'primeng/inputtext';
import { PaginatorModule } from 'primeng/paginator';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';

import { CatalogStateService } from '../../services/catalog-state.service';
import { ProviderDialog } from '../components/provider-dialog';
import { PROVIDER_TYPE_LABELS } from '../../models/catalog-labels';
import type { Provider, ProviderType } from '../../models/catalog.model';

@Component({
  selector: 'app-provider-list',
  imports: [FormsModule, ButtonModule, CardModule, TableModule, TagModule, IconFieldModule, InputIconModule, InputTextModule, PaginatorModule, ToastModule, ProviderDialog],
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

      <div class="flex flex-col gap-3 rounded-2xl border border-surface-200 bg-surface-0 p-4 shadow-sm md:flex-row md:items-center md:justify-between">
        <p-iconfield class="w-full md:w-80">
          <p-inputicon class="pi pi-search" />
          <input
            pInputText
            type="search"
            [value]="catalogState.providerSearch()"
            (input)="onSearchInput($event)"
            placeholder="Buscar proveedor…"
            class="w-full"
          />
        </p-iconfield>
        <p class="text-caption text-muted-color">
          {{ catalogState.providerTotal() }} resultado(s)
        </p>
      </div>

      <div class="overflow-hidden rounded-2xl border border-surface-200 bg-surface-0 shadow-sm">
        <p-table
          [value]="catalogState.providers()"
          [loading]="catalogState.loading()"
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

        @if (catalogState.providerTotal() > 10) {
          <p-paginator
            [rows]="10"
            [totalRecords]="catalogState.providerTotal()"
            [first]="(catalogState.providerPage() - 1) * 10"
            (onPageChange)="onPageChange($event)"
            [showCurrentPageReport]="true"
            currentPageReportTemplate="Mostrando {first} a {last} de {totalRecords}"
            [rowsPerPageOptions]="[10, 20, 50]"
          />
        }
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

  protected readonly saving = signal(false);
  protected readonly dialogVisible = signal(false);
  protected readonly dialogHeader = signal('Crear proveedor');
  protected readonly dialogInitialName = signal('');
  protected readonly dialogInitialType = signal<ProviderType | null>(null);
  private editingId: string | null = null;
  private isRenameOnly = false;

  private searchTimeout: ReturnType<typeof setTimeout> | null = null;

  ngOnInit(): void {
    this.catalogState.providerPage.set(1);
    this.catalogState.providerSearch.set('');
    void this.catalogState.loadProviders();
  }

  protected onSearchInput(event: Event): void {
    this.catalogState.providerSearch.set((event.target as HTMLInputElement).value);
    if (this.searchTimeout) clearTimeout(this.searchTimeout);
    this.searchTimeout = setTimeout(() => {
      this.catalogState.providerPage.set(1);
      void this.catalogState.loadProviders();
    }, 400);
  }

  protected onPageChange(event: { page: number; rows: number }): void {
    this.catalogState.providerPage.set(event.page + 1);
    void this.catalogState.loadProviders();
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
