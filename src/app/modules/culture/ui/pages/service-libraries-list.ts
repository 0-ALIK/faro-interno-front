import { Component, inject, OnInit, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { TableModule } from 'primeng/table';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';
import { InputTextModule } from 'primeng/inputtext';
import { PaginatorModule } from 'primeng/paginator';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';

import { CultureStateService } from '../../services/culture-state.service';
import { EntityDialog } from '../../../catalog/ui/components/entity-dialog';

@Component({
  selector: 'app-service-libraries-list',
  imports: [FormsModule, ButtonModule, CardModule, TableModule, IconFieldModule, InputIconModule, InputTextModule, PaginatorModule, ToastModule, EntityDialog],
  providers: [MessageService],
  template: `
    <p-toast />
    <div class="flex flex-col gap-6">
      <div class="flex items-center justify-between">
        <div>
          <h1 class="text-h2">Servicios</h1>
          <p class="text-body text-muted-color">Gestiona los servicios de biblioteca del catálogo.</p>
        </div>
        <p-button label="Nuevo servicio" icon="pi pi-plus" (onClick)="openCreate()" />
      </div>

      <div class="flex flex-col gap-3 rounded-2xl border border-surface-200 bg-surface-0 p-4 shadow-sm md:flex-row md:items-center md:justify-between">
        <p-iconfield class="w-full md:w-80">
          <p-inputicon class="pi pi-search" />
          <input pInputText type="search" [value]="search()" (input)="onSearchInput($event)" placeholder="Buscar servicio…" class="w-full" />
        </p-iconfield>
        <p class="text-caption text-muted-color">{{ total() }} resultado(s)</p>
      </div>

      <div class="overflow-hidden rounded-2xl border border-surface-200 bg-surface-0 shadow-sm">
        <p-table [value]="items()" [loading]="cultureState.loading()" dataKey="id" [tableStyle]="{ 'min-width': '40rem' }">
          <ng-template pTemplate="header">
            <tr>
              <th class="!bg-primary-50 !text-primary-900 uppercase">Nombre</th>
              <th class="!bg-primary-50 !text-primary-900 uppercase w-32">Acciones</th>
            </tr>
          </ng-template>
          <ng-template pTemplate="body" let-item>
            <tr class="transition-colors hover:bg-surface-50">
              <td class="font-semibold text-surface-900">{{ item.name }}</td>
              <td>
                <div class="flex gap-1">
                  <p-button icon="pi pi-pencil" [rounded]="true" [text]="true" severity="info" size="small" (onClick)="openRename(item)" ariaLabel="Renombrar" />
                  <p-button icon="pi pi-trash" [rounded]="true" [text]="true" severity="danger" size="small" [loading]="cultureState.loading()" (onClick)="onDelete(item.id)" ariaLabel="Eliminar" />
                </div>
              </td>
            </tr>
          </ng-template>
          <ng-template pTemplate="emptydata">
            <tr><td colspan="2" class="py-10 text-center text-muted-color">No hay servicios registrados.</td></tr>
          </ng-template>
        </p-table>

        @if (total() > 10) {
          <p-paginator [rows]="10" [totalRecords]="total()" [first]="(page() - 1) * 10" (onPageChange)="onPageChange($event)" [showCurrentPageReport]="true" currentPageReportTemplate="Mostrando {first} a {last} de {totalRecords}" [rowsPerPageOptions]="[10, 20, 50]" />
        }
      </div>
    </div>

    <app-entity-dialog [visible]="dialogVisible()" [header]="dialogHeader()" [initialValue]="dialogInitialValue()" [saving]="saving()" (save)="onSave($event)" (close)="closeDialog()" />
  `
})
export class ServiceLibrariesList implements OnInit {
  protected readonly cultureState = inject(CultureStateService);
  private readonly messageService = inject(MessageService);

  protected readonly saving = signal(false);
  protected readonly dialogVisible = signal(false);
  protected readonly dialogHeader = signal('Crear servicio');
  protected readonly dialogInitialValue = signal('');
  protected readonly search = signal('');
  protected readonly page = signal(1);
  protected readonly total = signal(0);
  protected readonly items = signal<{ id: string; name: string }[]>([]);
  private editingId: string | null = null;
  private searchTimeout: ReturnType<typeof setTimeout> | null = null;

  ngOnInit(): void {
    void this.loadData();
  }

  private async loadData(): Promise<void> {
    const result = await this.cultureState.getServiceLibrariesPage(this.page(), this.search());
    this.items.set(result.data);
    this.total.set(result.pagination.total);
  }

  protected onSearchInput(event: Event): void {
    this.search.set((event.target as HTMLInputElement).value);
    if (this.searchTimeout) clearTimeout(this.searchTimeout);
    this.searchTimeout = setTimeout(() => {
      this.page.set(1);
      void this.loadData();
    }, 400);
  }

  protected onPageChange(event: { page: number; rows: number }): void {
    this.page.set(event.page + 1);
    void this.loadData();
  }

  protected openCreate(): void {
    this.editingId = null;
    this.dialogHeader.set('Crear servicio');
    this.dialogInitialValue.set('');
    this.dialogVisible.set(true);
  }

  protected openRename(item: { id: string; name: string }): void {
    this.editingId = item.id;
    this.dialogHeader.set('Renombrar servicio');
    this.dialogInitialValue.set(item.name);
    this.dialogVisible.set(true);
  }

  protected closeDialog(): void {
    this.dialogVisible.set(false);
  }

  protected async onDelete(id: string): Promise<void> {
    await this.cultureState.deleteServiceLibrary(id);
    this.messageService.add({ severity: 'success', summary: 'Eliminado', detail: 'Servicio eliminado.' });
    void this.loadData();
  }

  protected async onSave(name: string): Promise<void> {
    this.saving.set(true);
    try {
      if (this.editingId) {
        await this.cultureState.renameServiceLibrary(this.editingId, name);
        this.messageService.add({ severity: 'success', summary: 'Actualizado', detail: 'Servicio renombrado.' });
      } else {
        await this.cultureState.createServiceLibrary(name);
        this.messageService.add({ severity: 'success', summary: 'Creado', detail: 'Nuevo servicio agregado.' });
      }
      this.closeDialog();
      void this.loadData();
    } finally {
      this.saving.set(false);
    }
  }
}
