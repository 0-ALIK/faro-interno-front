import { Component, OnInit, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';
import { InputTextModule } from 'primeng/inputtext';
import { SelectModule } from 'primeng/select';
import { TableModule } from 'primeng/table';
import { PaginatorModule } from 'primeng/paginator';

import { CultureStateService } from '../../services/culture-state.service';
import { CultureStatusTag } from '../components/culture-status-tag';
import { CrearBibliotecaDialog } from '../components/crear-biblioteca-dialog';
import { LIBRARY_STATUS_LABELS, LIBRARY_ZONE_LABELS, labelOf } from '../../models/culture-labels';
import type { LibraryStatus, LibraryZone } from '../../models/culture-labels';

@Component({
  selector: 'app-bibliotecas-list',
  imports: [FormsModule, RouterLink, ButtonModule, IconFieldModule, InputIconModule, InputTextModule, SelectModule, TableModule, PaginatorModule, CultureStatusTag, CrearBibliotecaDialog],
  template: `
    <div class="flex flex-col gap-6">
      <section class="relative overflow-hidden rounded-3xl bg-gradient-to-br from-primary-600 via-primary-700 to-primary-950 p-8 shadow-lg md:p-10">
        <div class="pointer-events-none absolute -right-16 -top-24 h-64 w-64 rounded-full bg-white/10 blur-2xl" aria-hidden="true"></div>
        <div class="pointer-events-none absolute -bottom-24 right-24 h-48 w-48 rounded-full bg-primary-400/20 blur-2xl" aria-hidden="true"></div>

        <div class="relative flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <div>
            <p class="text-sm font-semibold uppercase tracking-widest text-primary-200">Cultura · Faro Interno</p>
            <h1 class="mt-2 text-h1 text-white">Bibliotecas</h1>
            <p class="mt-2 max-w-xl text-body text-primary-100">
              Administra las bibliotecas del municipio. {{ cultureState.libraryTotal() }} biblioteca(s) registrada(s).
            </p>
          </div>
          <p-button label="Nueva biblioteca" icon="pi pi-plus" (onClick)="showCreate.set(true)" styleClass="!bg-white !text-primary-700 !border-white shadow-md" />
        </div>
      </section>

      <div class="flex flex-col gap-3 rounded-2xl border border-surface-200 bg-surface-0 p-4 shadow-sm md:flex-row md:items-center md:justify-between">
        <div class="flex flex-col gap-3 md:flex-row md:items-center">
          <p-iconfield class="w-full md:w-80">
            <p-inputicon class="pi pi-search" />
            <input pInputText type="search" [value]="cultureState.libraryName()" (input)="onSearchInput($event)" placeholder="Buscar por nombre…" class="w-full" />
          </p-iconfield>

          <p-select [(ngModel)]="cultureState.libraryStatus" [options]="statusOptions" optionLabel="label" optionValue="value" placeholder="Estado" [showClear]="true" (onChange)="onFilterChange()" class="w-full md:w-44" />

          <p-select [(ngModel)]="cultureState.libraryZone" [options]="zoneOptions" optionLabel="label" optionValue="value" placeholder="Zona" [showClear]="true" (onChange)="onFilterChange()" class="w-full md:w-44" />
        </div>
        <p class="text-caption text-muted-color">{{ cultureState.libraryTotal() }} resultado(s)</p>
      </div>

      <div class="overflow-hidden rounded-2xl border border-surface-200 bg-surface-0 shadow-sm">
        <p-table [value]="cultureState.libraries()" [loading]="cultureState.loading()" dataKey="id" [tableStyle]="{ 'min-width': '56rem' }">
          <ng-template pTemplate="header">
            <tr>
              <th class="!bg-primary-50 !text-primary-900 uppercase">Nombre</th>
              <th class="!bg-primary-50 !text-primary-900 uppercase">Tipo</th>
              <th class="!bg-primary-50 !text-primary-900 uppercase">Zona</th>
              <th class="!bg-primary-50 !text-primary-900 uppercase">Estado</th>
              <th class="!bg-primary-50 !text-primary-900 uppercase">Dirección</th>
            </tr>
          </ng-template>

          <ng-template pTemplate="body" let-lib>
            <tr class="transition-colors hover:bg-surface-50">
              <td>
                <div class="flex items-center gap-3">
                  <span class="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-primary-50 text-primary-700">
                    <span class="pi pi-building text-sm" aria-hidden="true"></span>
                  </span>
                  <a [routerLink]="['/culture/bibliotecas', lib.id]" class="cursor-pointer font-semibold text-surface-900 hover:text-primary-700">{{ lib.name }}</a>
                </div>
              </td>
              <td>
                <span class="inline-flex items-center gap-1.5 rounded-lg bg-surface-100 px-2.5 py-1 text-xs font-medium text-surface-700">
                  {{ lib.type?.name ?? '—' }}
                </span>
              </td>
              <td>
                <span class="text-sm text-surface-600">{{ zoneLabel(lib.direction?.zone) }}</span>
              </td>
              <td><app-culture-status-tag [status]="lib.status" /></td>
              <td class="text-sm text-surface-600">{{ lib.direction?.corregimiento?.name ?? '—' }}</td>
            </tr>
          </ng-template>

          <ng-template pTemplate="emptydata">
            <tr>
              <td colspan="5" class="py-10 text-center text-muted-color">No hay bibliotecas que coincidan con la búsqueda.</td>
            </tr>
          </ng-template>
        </p-table>

        @if (cultureState.libraryTotal() > 10) {
          <p-paginator
            [rows]="10"
            [totalRecords]="cultureState.libraryTotal()"
            [first]="(cultureState.libraryPage() - 1) * 10"
            (onPageChange)="onPageChange($event)"
            [showCurrentPageReport]="true"
            currentPageReportTemplate="Mostrando {first} a {last} de {totalRecords}"
            [rowsPerPageOptions]="[10, 20, 50]"
          />
        }
      </div>

      <app-crear-biblioteca-dialog
        [visible]="showCreate()"
        [saving]="cultureState.loading()"
        (created)="onLibraryCreated($event)"
        (close)="showCreate.set(false)"
      />
    </div>
  `
})
export class BibliotecasList implements OnInit {
  protected readonly cultureState = inject(CultureStateService);
  protected readonly showCreate = signal(false);

  protected readonly statusOptions: { label: string; value: LibraryStatus }[] = (
    Object.keys(LIBRARY_STATUS_LABELS) as LibraryStatus[]
  ).map((value) => ({ label: LIBRARY_STATUS_LABELS[value], value }));

  protected readonly zoneOptions: { label: string; value: LibraryZone }[] = (
    Object.keys(LIBRARY_ZONE_LABELS) as LibraryZone[]
  ).map((value) => ({ label: LIBRARY_ZONE_LABELS[value], value }));

  async ngOnInit(): Promise<void> {
    this.cultureState.libraryPage.set(1);
    this.cultureState.libraryName.set('');
    this.cultureState.libraryStatus.set(null);
    this.cultureState.libraryZone.set(null);
    await this.cultureState.loadLibraries();
  }

  protected async onLibraryCreated(data: { name: string; description: string }): Promise<void> {
    await this.cultureState.createLibrary(data.name, data.description);
    this.showCreate.set(false);
  }

  protected onSearchInput(event: Event): void {
    this.cultureState.libraryName.set((event.target as HTMLInputElement).value);
    this.debounceSearch();
  }

  private searchTimeout: ReturnType<typeof setTimeout> | null = null;

  private debounceSearch(): void {
    if (this.searchTimeout) clearTimeout(this.searchTimeout);
    this.searchTimeout = setTimeout(() => {
      this.cultureState.libraryPage.set(1);
      void this.cultureState.loadLibraries();
    }, 400);
  }

  protected onFilterChange(): void {
    this.cultureState.libraryPage.set(1);
    void this.cultureState.loadLibraries();
  }

  protected onPageChange(event: { page: number; rows: number }): void {
    this.cultureState.libraryPage.set(event.page + 1);
    void this.cultureState.loadLibraries();
  }

  protected zoneLabel(zone: string | null | undefined): string {
    return labelOf(LIBRARY_ZONE_LABELS, zone as LibraryZone);
  }
}
