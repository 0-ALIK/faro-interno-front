import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { DrawerModule } from 'primeng/drawer';

import { Sidebar } from './sidebar';
import { Topbar } from './topbar';

@Component({
  selector: 'app-shell',
  imports: [RouterOutlet, DrawerModule, Sidebar, Topbar],
  template: `
    <div class="flex h-dvh overflow-hidden bg-surface-50">
      <p-drawer
        [(visible)]="drawerOpen"
        position="left"
        styleClass="!w-72 lg:!hidden"
        [modal]="true"
        [blockScroll]="true"
        [showCloseIcon]="false"
      >
        <ng-template #content>
          <app-sidebar (navigate)="closeDrawer()" />
        </ng-template>
      </p-drawer>

      <aside
        class="hidden shrink-0 overflow-hidden border-r border-surface-200 transition-all duration-300 lg:block"
        [class.w-0]="collapsed()"
        [class.w-72]="!collapsed()"
        aria-label="Barra lateral"
      >
        <app-sidebar />
      </aside>

      <div class="flex min-w-0 flex-1 flex-col">
        <app-topbar (toggleSidebar)="handleSidebarToggle()" />
        <main class="flex-1 overflow-y-auto p-4 md:p-6 lg:p-8">
          <div class="mx-auto w-full max-w-7xl">
            <router-outlet />
          </div>
        </main>
      </div>
    </div>
  `
})
export class AppShell {
  readonly collapsed = signal(false);
  readonly drawerOpen = signal(false);

  private readonly isDesktop = signal(true);

  constructor() {
    const query = window.matchMedia('(min-width: 1024px)');
    this.isDesktop.set(query.matches);
    query.addEventListener('change', (event) => this.isDesktop.set(event.matches));
  }

  handleSidebarToggle(): void {
    if (this.isDesktop()) {
      this.collapsed.update((value) => !value);
    } else {
      this.drawerOpen.set(true);
    }
  }

  closeDrawer(): void {
    this.drawerOpen.set(false);
  }
}