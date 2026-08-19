import { Component, output } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';

import { NAV_SECTIONS } from './navigation';

@Component({
  selector: 'app-sidebar',
  imports: [RouterLink, RouterLinkActive],
  template: `
    <div class="flex h-full w-72 flex-col bg-gradient-to-b from-primary-800 via-primary-900 to-primary-950">
      <div class="h-1 shrink-0 bg-gradient-to-r from-primary-400 via-primary-500 to-primary-700"></div>

      <div class="flex h-20 shrink-0 items-center gap-3 px-5">
        <img src="images/logo-white.png" alt="Faro Interno" class="h-11 w-11 shrink-0 object-contain" />
        <div class="min-w-0">
          <p class="truncate font-brand text-base leading-tight text-white">Municipio de Panamá</p>
          <p class="text-xs font-medium text-primary-200">Faro Interno</p>
        </div>
      </div>

      <nav class="flex-1 overflow-y-auto px-3 py-4" aria-label="Navegación principal">
        @for (section of sections; track section.label) {
          <div class="mb-6">
            <p class="mb-2 px-3 text-[11px] font-semibold uppercase tracking-widest text-primary-300/80">
              {{ section.label }}
            </p>
            <ul class="space-y-1">
              @for (item of section.items; track item.label) {
                <li>
                  @if (item.disabled) {
                    <span
                      class="flex cursor-not-allowed items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-primary-100/40"
                      aria-disabled="true"
                    >
                      <span [class]="item.icon + ' text-sm'" aria-hidden="true"></span>
                      <span class="truncate">{{ item.label }}</span>
                      <span class="pi pi-lock ml-auto text-xs" aria-hidden="true"></span>
                    </span>
                  } @else {
                    <a
                      [routerLink]="item.routerLink"
                      routerLinkActive="bg-white/15 text-white"
                      #rla="routerLinkActive"
                      [attr.aria-current]="rla.isActive ? 'page' : null"
                      (click)="navigate.emit()"
                      class="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-primary-100 transition-colors hover:bg-white/10 hover:text-white"
                    >
                      <span [class]="item.icon + ' text-sm'" aria-hidden="true"></span>
                      <span class="truncate">{{ item.label }}</span>
                    </a>
                  }
                </li>
              }
            </ul>
          </div>
        }
      </nav>

      <div class="shrink-0 border-t border-white/10 px-5 py-3">
        <p class="text-xs text-primary-300/60">Sistema interno · v0.1.0</p>
      </div>
    </div>
  `
})
export class Sidebar {
  readonly navigate = output();

  protected readonly sections = NAV_SECTIONS;
}