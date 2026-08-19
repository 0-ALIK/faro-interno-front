import { Component, computed, EventEmitter, input, output } from '@angular/core';
import { ButtonModule } from 'primeng/button';

import type { CourseStatus } from '../../models/catalog.model';
import { getLifecycleActions, type LifecycleAction } from '../../models/catalog-labels';

@Component({
  selector: 'app-lifecycle-actions',
  imports: [ButtonModule],
  template: `
    @if (actions().length > 0) {
      <div class="flex flex-col gap-2">
        <p class="text-caption font-semibold uppercase tracking-wider text-muted-color">
          Acciones de ciclo de vida
        </p>
        <div class="flex flex-wrap gap-2">
          @for (action of actions(); track action.action) {
            <p-button
              [label]="action.label"
              [icon]="action.icon"
              [severity]="action.severity"
              [outlined]="true"
              [loading]="saving()"
              (onClick)="actionClick.emit(action.action)"
            />
          }
        </div>
      </div>
    }
  `
})
export class LifecycleActions {
  readonly status = input.required<CourseStatus>();
  readonly saving = input(false);
  readonly actionClick = output<string>();

  protected readonly actions = computed(() => getLifecycleActions(this.status()));
}