import { Component, computed, input } from '@angular/core';
import { TagModule } from 'primeng/tag';

import type { LibraryStatus } from '../../models/culture-labels';
import { LIBRARY_STATUS_LABELS } from '../../models/culture-labels';

type Severity = 'secondary' | 'success' | 'info' | 'warn' | 'danger' | 'contrast';

const STATUS_SEVERITY: Record<LibraryStatus, Severity> = {
  ACTIVE: 'success',
  INACTIVE: 'danger',
  STANDOUT: 'info'
};

@Component({
  selector: 'app-culture-status-tag',
  imports: [TagModule],
  template: `<p-tag [value]="label()" [severity]="severity()" />`
})
export class CultureStatusTag {
  readonly status = input.required<LibraryStatus>();

  protected readonly label = computed(() => LIBRARY_STATUS_LABELS[this.status()]);
  protected readonly severity = computed<Severity>(() => STATUS_SEVERITY[this.status()]);
}
