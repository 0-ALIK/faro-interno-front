import { Component, inject, OnInit, signal } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { TableModule } from 'primeng/table';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';

import { CatalogStateService } from '../../services/catalog-state.service';
import { EntityDialog } from '../components/entity-dialog';

@Component({
  selector: 'app-tag-list',
  imports: [ButtonModule, CardModule, TableModule, ToastModule, EntityDialog],
  providers: [MessageService],
  template: `
    <p-toast />
    <div class="flex flex-col gap-6">
      <div class="flex items-center justify-between">
        <div>
          <h1 class="text-h2">Etiquetas</h1>
          <p class="text-body text-muted-color">Gestiona las etiquetas del catálogo.</p>
        </div>
        <p-button label="Nueva etiqueta" icon="pi pi-plus" (onClick)="openCreate()" />
      </div>

      <div class="overflow-hidden rounded-2xl border border-surface-200 bg-surface-0 shadow-sm">
        <p-table
          [value]="catalogState.tags()"
          [loading]="loading()"
          dataKey="id"
          [tableStyle]="{ 'min-width': '40rem' }"
        >
          <ng-template pTemplate="header">
            <tr>
              <th class="!bg-primary-50 !text-primary-900 uppercase">Nombre</th>
              <th class="!bg-primary-50 !text-primary-900 uppercase w-24">Acciones</th>
            </tr>
          </ng-template>
          <ng-template pTemplate="body" let-tag>
            <tr class="transition-colors hover:bg-surface-50">
              <td class="font-semibold text-surface-900">{{ tag.name }}</td>
              <td>
                <p-button icon="pi pi-pencil" [rounded]="true" [text]="true" severity="info" size="small" (onClick)="openRename(tag)" ariaLabel="Renombrar" />
              </td>
            </tr>
          </ng-template>
          <ng-template pTemplate="emptydata">
            <tr>
              <td colspan="2" class="py-10 text-center text-muted-color">
                No hay etiquetas registradas.
              </td>
            </tr>
          </ng-template>
        </p-table>
      </div>
    </div>

    <app-entity-dialog
      [visible]="dialogVisible()"
      [header]="dialogHeader()"
      [initialValue]="dialogInitialValue()"
      [saving]="saving()"
      (save)="onSave($event)"
      (close)="closeDialog()"
    />
  `
})
export class TagList implements OnInit {
  protected readonly catalogState = inject(CatalogStateService);
  private readonly messageService = inject(MessageService);

  protected readonly loading = signal(false);
  protected readonly saving = signal(false);
  protected readonly dialogVisible = signal(false);
  protected readonly dialogHeader = signal('Crear etiqueta');
  protected readonly dialogInitialValue = signal('');
  private editingId: string | null = null;

  ngOnInit(): void {
    if (this.catalogState.tags().length === 0) {
      this.loading.set(true);
      this.catalogState.loadAll().finally(() => this.loading.set(false));
    }
  }

  protected openCreate(): void {
    this.editingId = null;
    this.dialogHeader.set('Crear etiqueta');
    this.dialogInitialValue.set('');
    this.dialogVisible.set(true);
  }

  protected openRename(tag: { id: string; name: string }): void {
    this.editingId = tag.id;
    this.dialogHeader.set('Renombrar etiqueta');
    this.dialogInitialValue.set(tag.name);
    this.dialogVisible.set(true);
  }

  protected closeDialog(): void {
    this.dialogVisible.set(false);
  }

  protected async onSave(name: string): Promise<void> {
    this.saving.set(true);
    try {
      if (this.editingId) {
        await this.catalogState.renameTag(this.editingId, name);
        this.messageService.add({ severity: 'success', summary: 'Actualizada', detail: 'Etiqueta renombrada.' });
      } else {
        await this.catalogState.createTag(name);
        this.messageService.add({ severity: 'success', summary: 'Creada', detail: 'Nueva etiqueta agregada.' });
      }
      this.closeDialog();
    } finally {
      this.saving.set(false);
    }
  }
}