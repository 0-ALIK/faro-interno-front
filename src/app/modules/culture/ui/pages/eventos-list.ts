import { Component, OnInit, computed, inject, signal } from '@angular/core';
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
import { CrearEventoDialog } from '../components/crear-evento-dialog';

@Component({
  selector: 'app-eventos-list',
  imports: [FormsModule, RouterLink, ButtonModule, IconFieldModule, InputIconModule, InputTextModule, SelectModule, TableModule, PaginatorModule, CrearEventoDialog],
  template: `
    <div class="flex flex-col gap-6">
      <section class="relative overflow-hidden rounded-3xl bg-gradient-to-br from-primary-600 via-primary-700 to-primary-950 p-8 shadow-lg md:p-10">
        <div class="pointer-events-none absolute -right-16 -top-24 h-64 w-64 rounded-full bg-white/10 blur-2xl" aria-hidden="true"></div>
        <div class="pointer-events-none absolute -bottom-24 right-24 h-48 w-48 rounded-full bg-primary-400/20 blur-2xl" aria-hidden="true"></div>

        <div class="relative flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <div>
            <p class="text-sm font-semibold uppercase tracking-widest text-primary-200">Cultura · Faro Interno</p>
            <h1 class="mt-2 text-h1 text-white">Eventos</h1>
            <p class="mt-2 max-w-xl text-body text-primary-100">
              Administra los eventos culturales del municipio. {{ cultureState.eventTotal() }} evento(s) registrado(s).
            </p>
          </div>
          <p-button label="Nuevo evento" icon="pi pi-plus" (onClick)="showCreate.set(true)" styleClass="!bg-white !text-primary-700 !border-white shadow-md" />
        </div>
      </section>

      <div class="flex flex-col gap-3 rounded-2xl border border-surface-200 bg-surface-0 p-4 shadow-sm md:flex-row md:items-center md:justify-between">
        <div class="flex flex-col gap-3 md:flex-row md:items-center">
          <p-iconfield class="w-full md:w-80">
            <p-inputicon class="pi pi-search" />
            <input pInputText type="search" [value]="cultureState.eventName()" (input)="onSearchInput($event)" placeholder="Buscar por nombre…" class="w-full" />
          </p-iconfield>

          <p-select [(ngModel)]="cultureState.eventTypeId" [options]="cultureState.typeEventOptions()" optionLabel="label" optionValue="value" placeholder="Tipo de evento" [showClear]="true" (onChange)="onFilterChange()" (onShow)="onLoadTypeEvents()" class="w-full md:w-48" />

          <p-select [(ngModel)]="cultureState.eventLibraryId" [options]="libraryOptions" optionLabel="label" optionValue="value" placeholder="Biblioteca" [showClear]="true" (onChange)="onFilterChange()" (onShow)="onLoadLibraries()" class="w-full md:w-56" />
        </div>
        <p class="text-caption text-muted-color">{{ cultureState.eventTotal() }} resultado(s)</p>
      </div>

      <div class="overflow-hidden rounded-2xl border border-surface-200 bg-surface-0 shadow-sm">
        <p-table [value]="cultureState.events()" [loading]="cultureState.loading()" dataKey="id" [tableStyle]="{ 'min-width': '52rem' }">
          <ng-template pTemplate="header">
            <tr>
              <th class="!bg-primary-50 !text-primary-900 uppercase">Nombre</th>
              <th class="!bg-primary-50 !text-primary-900 uppercase">Tipo</th>
              <th class="!bg-primary-50 !text-primary-900 uppercase">Biblioteca</th>
              <th class="!bg-primary-50 !text-primary-900 uppercase">Fecha</th>
              <th class="!bg-primary-50 !text-primary-900 uppercase">Hora</th>
            </tr>
          </ng-template>

          <ng-template pTemplate="body" let-evt>
            <tr class="transition-colors hover:bg-surface-50">
              <td>
                <div class="flex items-center gap-3">
                  <span class="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-primary-50 text-primary-700">
                    <span class="pi pi-calendar text-sm" aria-hidden="true"></span>
                  </span>
                  <a [routerLink]="['/culture/eventos', evt.id]" class="cursor-pointer font-semibold text-surface-900 hover:text-primary-700">{{ evt.name }}</a>
                </div>
              </td>
              <td>
                <span class="inline-flex items-center gap-1.5 rounded-lg bg-surface-100 px-2.5 py-1 text-xs font-medium text-surface-700">
                  {{ evt.type.name }}
                </span>
              </td>
              <td class="text-sm text-surface-600">{{ evt.library.name }}</td>
              <td>
                <span class="inline-flex items-center gap-1.5 text-sm text-surface-600">
                  <span class="pi pi-calendar text-xs text-muted-color" aria-hidden="true"></span>
                  {{ evt.schedule.date }}
                </span>
              </td>
              <td>
                <span class="inline-flex items-center gap-1.5 text-sm text-surface-600">
                  <span class="pi pi-clock text-xs text-muted-color" aria-hidden="true"></span>
                  {{ evt.schedule.initTime }}
                </span>
              </td>
            </tr>
          </ng-template>

          <ng-template pTemplate="emptydata">
            <tr>
              <td colspan="5" class="py-10 text-center text-muted-color">No hay eventos que coincidan con la búsqueda.</td>
            </tr>
          </ng-template>
        </p-table>

        @if (cultureState.eventTotal() > 10) {
          <p-paginator
            [rows]="10"
            [totalRecords]="cultureState.eventTotal()"
            [first]="(cultureState.eventPage() - 1) * 10"
            (onPageChange)="onPageChange($event)"
            [showCurrentPageReport]="true"
            currentPageReportTemplate="Mostrando {first} a {last} de {totalRecords}"
            [rowsPerPageOptions]="[10, 20, 50]"
          />
        }
      </div>

      <app-crear-evento-dialog
        [visible]="showCreate()"
        [saving]="cultureState.loading()"
        (created)="onEventCreated($event)"
        (close)="showCreate.set(false)"
      />
    </div>
  `
})
export class EventosList implements OnInit {
  protected readonly cultureState = inject(CultureStateService);
  protected readonly showCreate = signal(false);

  protected readonly libraryOptions = computed(() =>
    this.cultureState.libraries().map((lib) => ({ label: lib.name, value: lib.id }))
  );

  async ngOnInit(): Promise<void> {
    this.cultureState.eventPage.set(1);
    this.cultureState.eventName.set('');
    this.cultureState.eventTypeId.set('');
    this.cultureState.eventLibraryId.set('');
    await this.cultureState.loadEvents();
  }

  protected async onEventCreated(data: { name: string; typeId: string; libraryId: string; day: number; month: number; year: number; startTimeHour: number; startTimeMin: number; endTimeHour: number; endTimeMin: number; description: string }): Promise<void> {
    await this.cultureState.createEvent(data);
    this.showCreate.set(false);
  }

  protected onSearchInput(event: Event): void {
    this.cultureState.eventName.set((event.target as HTMLInputElement).value);
    this.debounceSearch();
  }

  private searchTimeout: ReturnType<typeof setTimeout> | null = null;

  private debounceSearch(): void {
    if (this.searchTimeout) clearTimeout(this.searchTimeout);
    this.searchTimeout = setTimeout(() => {
      this.cultureState.eventPage.set(1);
      void this.cultureState.loadEvents();
    }, 400);
  }

  protected onFilterChange(): void {
    this.cultureState.eventPage.set(1);
    void this.cultureState.loadEvents();
  }

  protected onPageChange(event: { page: number; rows: number }): void {
    this.cultureState.eventPage.set(event.page + 1);
    void this.cultureState.loadEvents();
  }

  protected onLoadTypeEvents(): void {
    void this.cultureState.loadTypeEvents();
  }

  protected onLoadLibraries(): void {
    void this.cultureState.loadLibraries();
  }
}
