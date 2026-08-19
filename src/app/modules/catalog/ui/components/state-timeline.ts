import { Component, input } from '@angular/core';
import { AvatarModule } from 'primeng/avatar';
import { TimelineModule } from 'primeng/timeline';

import type { StateHistoryEntry } from '../../models/catalog.model';
import { COURSE_STATUS_LABELS } from '../../models/catalog-labels';

@Component({
  selector: 'app-state-timeline',
  imports: [AvatarModule, TimelineModule],
  template: `
    @if (history().length === 0) {
      <p class="text-sm text-muted-color">Sin historial de cambios.</p>
    } @else {
      <p-timeline [value]="history()" align="left">
        <ng-template pTemplate="content" let-entry>
          <div class="flex items-start gap-3">
            <p-avatar
              [label]="getInitials(entry.official)"
              shape="circle"
              styleClass="!bg-primary-100 !text-primary-700 !text-xs"
            />
            <div class="min-w-0 flex-1">
              <p class="text-sm font-semibold text-surface-900">
                {{ entry.official.name }} {{ entry.official.lastName }}
              </p>
              <p class="text-xs text-muted-color">
                @if (entry.from) {
                  {{ statusLabel(entry.from) }} → {{ statusLabel(entry.to) }}
                } @else {
                  Creación como {{ statusLabel(entry.to) }}
                }
              </p>
              <p class="text-xs text-surface-400">{{ entry.date }} · {{ entry.time }}</p>
            </div>
          </div>
        </ng-template>
        <ng-template pTemplate="opposite" let-entry>
          <span class="text-xs text-muted-color">{{ entry.date }}</span>
        </ng-template>
      </p-timeline>
    }
  `
})
export class StateTimeline {
  readonly history = input.required<StateHistoryEntry[]>();

  protected statusLabel(status: string): string {
    return COURSE_STATUS_LABELS[status as keyof typeof COURSE_STATUS_LABELS] ?? status;
  }

  protected getInitials(official: { name: string; lastName: string }): string {
    return `${official.name.charAt(0)}${official.lastName.charAt(0)}`;
  }
}