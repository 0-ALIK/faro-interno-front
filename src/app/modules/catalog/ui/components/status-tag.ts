import { Component, computed, input } from '@angular/core';
import { TagModule } from 'primeng/tag';

import type { CourseStatus } from '../../models/catalog.model';
import { COURSE_STATUS_LABELS } from '../../models/catalog-labels';

type Severity = 'secondary' | 'success' | 'info' | 'warn' | 'danger' | 'contrast';

const STATUS_SEVERITY: Record<CourseStatus, Severity> = {
  DRAFT: 'secondary',
  UNDER_REVIEW: 'info',
  PUBLISHED: 'success',
  SUSPENDED: 'warn',
  ARCHIVED: 'contrast'
};

@Component({
  selector: 'app-status-tag',
  imports: [TagModule],
  template: `<p-tag [value]="label()" [severity]="severity()" />`
})
export class StatusTag {
  readonly status = input.required<CourseStatus>();

  protected readonly label = computed(() => COURSE_STATUS_LABELS[this.status()]);
  protected readonly severity = computed<Severity>(() => STATUS_SEVERITY[this.status()]);
}