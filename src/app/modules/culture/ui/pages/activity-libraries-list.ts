import { Component, inject, OnInit, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { TableModule } from 'primeng/table';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';
import { InputTextModule } from 'primeng/inputtext';
import { TextareaModule } from 'primeng/textarea';
import { SelectModule } from 'primeng/select';
import { PaginatorModule } from 'primeng/paginator';
import { DialogModule } from 'primeng/dialog';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';

import { CultureStateService } from '../../services/culture-state.service';

@Component({
  selector: 'app-activity-libraries-list',
  imports: [FormsModule, ButtonModule, CardModule, TableModule, IconFieldModule, InputIconModule, InputTextModule, TextareaModule, SelectModule, PaginatorModule, DialogModule, ToastModule],
  providers: [MessageService],
  template: `
    <p-toast />
    <div class="flex flex-col gap-6">
      <div class="flex items-center justify-between">
        <div>
          <h1 class="text-h2">Actividades</h1>
          <p class="text-body text-muted-color">Gestiona las actividades de biblioteca del catálogo.</p>
        </div>
        <p-button label="Nueva actividad" icon="pi pi-plus" (onClick)="openCreate()" />
      </div>

      <div class="flex flex-col gap-3 rounded-2xl border border-surface-200 bg-surface-0 p-4 shadow-sm md:flex-row md:items-center md:justify-between">
        <p-iconfield class="w-full md:w-80">
          <p-inputicon class="pi pi-search" />
          <input pInputText type="search" [value]="search()" (input)="onSearchInput($event)" placeholder="Buscar actividad…" class="w-full" />
        </p-iconfield>
        <p class="text-caption text-muted-color">{{ total() }} resultado(s)</p>
      </div>

      <div class="overflow-hidden rounded-2xl border border-surface-200 bg-surface-0 shadow-sm">
        <p-table [value]="items()" [loading]="cultureState.loading()" dataKey="id" [tableStyle]="{ 'min-width': '40rem' }">
          <ng-template pTemplate="header">
            <tr>
              <th class="!bg-primary-50 !text-primary-900 uppercase">Nombre</th>
              <th class="!bg-primary-50 !text-primary-900 uppercase">Descripción</th>
              <th class="!bg-primary-50 !text-primary-900 uppercase w-24">Acciones</th>
            </tr>
          </ng-template>
          <ng-template pTemplate="body" let-item>
            <tr class="transition-colors hover:bg-surface-50">
              <td class="font-semibold text-surface-900">{{ item.name }}</td>
              <td class="text-sm text-surface-600">{{ item.description }}</td>
              <td>
                <p-button icon="pi pi-trash" [rounded]="true" [text]="true" severity="danger" size="small" [loading]="cultureState.loading()" (onClick)="onDelete(item.id)" ariaLabel="Eliminar" />
              </td>
            </tr>
          </ng-template>
          <ng-template pTemplate="emptydata">
            <tr><td colspan="3" class="py-10 text-center text-muted-color">No hay actividades registradas.</td></tr>
          </ng-template>
        </p-table>

        @if (total() > 10) {
          <p-paginator [rows]="10" [totalRecords]="total()" [first]="(page() - 1) * 10" (onPageChange)="onPageChange($event)" [showCurrentPageReport]="true" currentPageReportTemplate="Mostrando {first} a {last} de {totalRecords}" [rowsPerPageOptions]="[10, 20, 50]" />
        }
      </div>
    </div>

    <p-dialog header="Crear actividad" [modal]="true" [visible]="dialogVisible()" (onHide)="dialogVisible.set(false)" [style]="{ width: '32rem' }">
      <div class="flex flex-col gap-4">
        <div class="flex flex-col gap-1.5">
          <label for="actName" class="text-caption font-semibold uppercase tracking-wider text-muted-color">Nombre</label>
          <input pInputText id="actName" [ngModel]="dialogName()" (ngModelChange)="dialogName.set($event)" class="w-full" placeholder="Nombre de la actividad" />
        </div>
        <div class="flex flex-col gap-1.5">
          <label for="actDesc" class="text-caption font-semibold uppercase tracking-wider text-muted-color">Descripción</label>
          <textarea pTextarea id="actDesc" [ngModel]="dialogDescription()" (ngModelChange)="dialogDescription.set($event)" rows="3" class="w-full" placeholder="Descripción de la actividad"></textarea>
        </div>
        <div class="flex flex-col gap-1.5">
          <label for="actCategory" class="text-caption font-semibold uppercase tracking-wider text-muted-color">Categoría</label>
          <p-select id="actCategory" [ngModel]="dialogCategoryId()" (ngModelChange)="dialogCategoryId.set($event)" [options]="cultureState.categoryActivityOptions()" optionLabel="label" optionValue="value" placeholder="Seleccione…" [showClear]="true" class="w-full" (onShow)="onLoadCategoryActivities()" />
        </div>
      </div>
      <ng-template pTemplate="footer">
        <p-button label="Cancelar" severity="secondary" [text]="true" (onClick)="dialogVisible.set(false)" />
        <p-button label="Crear" icon="pi pi-check" [loading]="saving()" [disabled]="!dialogName().trim() || !dialogCategoryId()" (onClick)="onSave()" />
      </ng-template>
    </p-dialog>
  `
})
export class ActivityLibrariesList implements OnInit {
  protected readonly cultureState = inject(CultureStateService);
  private readonly messageService = inject(MessageService);

  protected readonly saving = signal(false);
  protected readonly dialogVisible = signal(false);
  protected readonly dialogName = signal('');
  protected readonly dialogDescription = signal('');
  protected readonly dialogCategoryId = signal<string | null>(null);
  protected readonly search = signal('');
  protected readonly page = signal(1);
  protected readonly total = signal(0);
  protected readonly items = signal<{ id: string; name: string; description: string }[]>([]);
  private searchTimeout: ReturnType<typeof setTimeout> | null = null;

  ngOnInit(): void {
    void this.loadData();
  }

  private async loadData(): Promise<void> {
    const result = await this.cultureState.getActivityLibrariesPage(this.page(), this.search());
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
    this.dialogName.set('');
    this.dialogDescription.set('');
    this.dialogCategoryId.set(null);
    this.dialogVisible.set(true);
  }

  protected onLoadCategoryActivities(): void {
    void this.cultureState.loadCategoryActivities();
  }

  protected async onDelete(id: string): Promise<void> {
    await this.cultureState.deleteActivityLibrary(id);
    this.messageService.add({ severity: 'success', summary: 'Eliminada', detail: 'Actividad eliminada.' });
    void this.loadData();
  }

  protected async onSave(): Promise<void> {
    this.saving.set(true);
    try {
      await this.cultureState.createActivityLibrary(this.dialogName(), this.dialogDescription(), this.dialogCategoryId()!);
      this.messageService.add({ severity: 'success', summary: 'Creada', detail: 'Nueva actividad agregada.' });
      this.dialogVisible.set(false);
      void this.loadData();
    } finally {
      this.saving.set(false);
    }
  }
}
