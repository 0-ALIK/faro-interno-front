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

import { CatalogStateService } from '../../services/catalog-state.service';
import { EntityDialog } from '../components/entity-dialog';

@Component({
  selector: 'app-category-list',
  imports: [
    FormsModule,
    ButtonModule,
    CardModule,
    TableModule,
    IconFieldModule,
    InputIconModule,
    InputTextModule,
    PaginatorModule,
    ToastModule,
    EntityDialog
  ],
  providers: [MessageService],
  template: `
    <p-toast />
    <div class="flex flex-col gap-6">
      <div class="flex items-center justify-between">
        <div>
          <h1 class="text-h2">Categorías</h1>
          <p class="text-body text-muted-color">Gestiona las categorías del catálogo de cursos.</p>
        </div>
        <p-button label="Nueva categoría" icon="pi pi-plus" (onClick)="openCreate()" />
      </div>

      <div class="flex flex-col gap-3 rounded-2xl border border-surface-200 bg-surface-0 p-4 shadow-sm md:flex-row md:items-center md:justify-between">
        <p-iconfield class="w-full md:w-80">
          <p-inputicon class="pi pi-search" />
          <input
            pInputText
            type="search"
            [value]="catalogState.categorySearch()"
            (input)="onSearchInput($event)"
            placeholder="Buscar categoría…"
            class="w-full"
          />
        </p-iconfield>
        <p class="text-caption text-muted-color">
          {{ catalogState.categoryTotal() }} resultado(s)
        </p>
      </div>

      <div class="overflow-hidden rounded-2xl border border-surface-200 bg-surface-0 shadow-sm">
        <p-table
          [value]="catalogState.categories()"
          [loading]="catalogState.loading()"
          dataKey="id"
          [tableStyle]="{ 'min-width': '40rem' }"
        >
          <ng-template pTemplate="header">
            <tr>
              <th class="!bg-primary-50 !text-primary-900 uppercase">Nombre</th>
              <th class="!bg-primary-50 !text-primary-900 uppercase w-24">Acciones</th>
            </tr>
          </ng-template>
          <ng-template pTemplate="body" let-cat>
            <tr class="transition-colors hover:bg-surface-50">
              <td class="font-semibold text-surface-900">{{ cat.name }}</td>
              <td>
                <p-button icon="pi pi-pencil" [rounded]="true" [text]="true" severity="info" size="small" (onClick)="openRename(cat)" ariaLabel="Renombrar" />
              </td>
            </tr>
          </ng-template>
          <ng-template pTemplate="emptydata">
            <tr>
              <td colspan="2" class="py-10 text-center text-muted-color">
                No hay categorías registradas.
              </td>
            </tr>
          </ng-template>
        </p-table>

        @if (catalogState.categoryTotal() > 10) {
          <p-paginator
            [rows]="10"
            [totalRecords]="catalogState.categoryTotal()"
            [first]="(catalogState.categoryPage() - 1) * 10"
            (onPageChange)="onPageChange($event)"
            [showCurrentPageReport]="true"
            currentPageReportTemplate="Mostrando {first} a {last} de {totalRecords}"
            [rowsPerPageOptions]="[10, 20, 50]"
          />
        }
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
export class CategoryList implements OnInit {
  protected readonly catalogState = inject(CatalogStateService);
  private readonly messageService = inject(MessageService);

  protected readonly saving = signal(false);
  protected readonly dialogVisible = signal(false);
  protected readonly dialogHeader = signal('Crear categoría');
  protected readonly dialogInitialValue = signal('');
  private editingId: string | null = null;

  private searchTimeout: ReturnType<typeof setTimeout> | null = null;

  ngOnInit(): void {
    this.catalogState.categoryPage.set(1);
    this.catalogState.categorySearch.set('');
    void this.catalogState.loadCategories();
  }

  protected onSearchInput(event: Event): void {
    this.catalogState.categorySearch.set((event.target as HTMLInputElement).value);
    if (this.searchTimeout) clearTimeout(this.searchTimeout);
    this.searchTimeout = setTimeout(() => {
      this.catalogState.categoryPage.set(1);
      void this.catalogState.loadCategories();
    }, 400);
  }

  protected onPageChange(event: { page: number; rows: number }): void {
    this.catalogState.categoryPage.set(event.page + 1);
    void this.catalogState.loadCategories();
  }

  protected openCreate(): void {
    this.editingId = null;
    this.dialogHeader.set('Crear categoría');
    this.dialogInitialValue.set('');
    this.dialogVisible.set(true);
  }

  protected openRename(cat: { id: string; name: string }): void {
    this.editingId = cat.id;
    this.dialogHeader.set('Renombrar categoría');
    this.dialogInitialValue.set(cat.name);
    this.dialogVisible.set(true);
  }

  protected closeDialog(): void {
    this.dialogVisible.set(false);
  }

  protected async onSave(name: string): Promise<void> {
    this.saving.set(true);
    try {
      if (this.editingId) {
        await this.catalogState.renameCategory(this.editingId, name);
        this.messageService.add({ severity: 'success', summary: 'Actualizada', detail: 'Categoría renombrada.' });
      } else {
        await this.catalogState.createCategory(name);
        this.messageService.add({ severity: 'success', summary: 'Creada', detail: 'Nueva categoría agregada.' });
      }
      this.closeDialog();
    } finally {
      this.saving.set(false);
    }
  }
}
