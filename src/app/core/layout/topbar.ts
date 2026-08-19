import { Component, computed, inject, output } from '@angular/core';
import { ToolbarModule } from 'primeng/toolbar';
import { ButtonModule } from 'primeng/button';
import { AvatarModule } from 'primeng/avatar';
import { MenuModule } from 'primeng/menu';
import type { MenuItem } from 'primeng/api';

import { UserService } from '../auth/user.service';

@Component({
  selector: 'app-topbar',
  imports: [ToolbarModule, ButtonModule, AvatarModule, MenuModule],
  template: `
    <div class="border-b border-surface-200 bg-surface-0 shadow-xs">
      <p-toolbar>
        <ng-template #start>
          <div class="flex items-center gap-3">
            <p-button
              icon="pi pi-bars"
              text
              rounded
              ariaLabel="Alternar menú de navegación"
              (onClick)="toggleSidebar.emit()"
            />
            <div class="hidden items-center gap-3 sm:flex">
              <img src="images/logo-blue.png" alt="Faro Interno" class="h-9 w-9 object-contain" />
              <div class="leading-tight">
                <p class="font-brand text-base text-primary-900">Municipio de Panamá</p>
                <p class="text-xs text-muted-color">Sistema interno · Faro</p>
              </div>
            </div>
          </div>
        </ng-template>

        <ng-template #end>
          <div class="flex items-center gap-2">
            <p-button
              icon="pi pi-bell"
              text
              rounded
              ariaLabel="Notificaciones"
              badge="3"
              badgeSeverity="danger"
            />

            <span class="hidden h-6 w-px bg-surface-200 sm:block" aria-hidden="true"></span>

            <div class="hidden items-center gap-3 xl:flex">
              <div class="text-right leading-tight">
                <p class="text-sm font-semibold text-surface-900">{{ userFullName() }}</p>
                <p class="text-xs text-muted-color">{{ userRole() }}</p>
              </div>
            </div>

            <button
              type="button"
              class="cursor-pointer rounded-full focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
              aria-label="Menú de usuario"
              (click)="userMenu.toggle($event)"
            >
              <p-avatar [label]="userInitials()" shape="circle" styleClass="!bg-primary-600 !text-white" />
            </button>

            <p-menu #userMenu [model]="userMenuItems" popup="true" />
          </div>
        </ng-template>
      </p-toolbar>
    </div>
  `
})
export class Topbar {
  readonly toggleSidebar = output();

  private readonly userService = inject(UserService);

  protected readonly userInitials = computed(() => this.userService.currentUser().initials);
  protected readonly userFullName = computed(
    () => `${this.userService.currentUser().name} ${this.userService.currentUser().lastName}`
  );
  protected readonly userRole = computed(() => this.userService.currentUser().role);

  protected readonly userMenuItems: MenuItem[] = [
    { label: 'Mi perfil', icon: 'pi pi-user' },
    { label: 'Configuración', icon: 'pi pi-cog' },
    { separator: true },
    { label: 'Cerrar sesión', icon: 'pi pi-sign-out' }
  ];
}