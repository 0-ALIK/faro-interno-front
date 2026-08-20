import { Component, OnInit, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { ProgressSpinnerModule } from 'primeng/progressspinner';

import { CultureStateService } from '../../services/culture-state.service';
import type { MapMarker } from '../components/culture-map';
import { CultureMapComponent } from '../components/culture-map';

@Component({
  selector: 'app-puntos-mapa',
  imports: [ButtonModule, ProgressSpinnerModule, CultureMapComponent],
  template: `
    <div class="flex flex-col gap-6">
      <section class="relative overflow-hidden rounded-3xl bg-gradient-to-br from-primary-600 via-primary-700 to-primary-950 p-8 shadow-lg md:p-10">
        <div class="pointer-events-none absolute -right-16 -top-24 h-64 w-64 rounded-full bg-white/10 blur-2xl" aria-hidden="true"></div>
        <div class="pointer-events-none absolute -bottom-24 right-24 h-48 w-48 rounded-full bg-primary-400/20 blur-2xl" aria-hidden="true"></div>

        <div class="relative flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <div>
            <p class="text-sm font-semibold uppercase tracking-widest text-primary-200">Cultura · Faro Interno</p>
            <h1 class="mt-2 text-h1 text-white">Mapa de bibliotecas</h1>
            <p class="mt-2 max-w-xl text-body text-primary-100">
              Ubicación de todas las bibliotecas del municipio. Haz clic en un marcador para ver detalles.
            </p>
          </div>
          <p-button label="Ver lista" icon="pi pi-list" (onClick)="goToList()" styleClass="!bg-white !text-primary-700 !border-white shadow-md" />
        </div>
      </section>

      <div class="overflow-hidden rounded-2xl border border-surface-200 bg-surface-0 shadow-sm">
        @if (cultureState.loading()) {
          <div class="flex items-center justify-center py-20">
            <p-progressSpinner strokeWidth="4" />
          </div>
        } @else {
          <app-culture-map height="calc(100vh - 280px)" [zoom]="13" [markers]="mapMarkers()" />
        }
      </div>
    </div>
  `
})
export class PuntosMapa implements OnInit {
  protected readonly cultureState = inject(CultureStateService);
  private readonly router = inject(Router);

  protected readonly mapMarkers = signal<MapMarker[]>([]);

  async ngOnInit(): Promise<void> {
    await this.cultureState.loadLocations();
    this.mapMarkers.set(
      this.cultureState.locations().map((loc) => ({
        name: loc.name,
        lat: loc.lat ?? 8.9511,
        lon: loc.lon ?? -79.5347,
        onClick: () => this.router.navigate(['/culture/bibliotecas', loc.id])
      }))
    );
  }

  protected goToList(): void {
    this.router.navigate(['/culture/bibliotecas']);
  }
}
