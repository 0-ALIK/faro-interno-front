import { Component, input, output } from '@angular/core';
import { ButtonModule } from 'primeng/button';

import type { ContentType } from '../../models/formation.model';
import { CONTENT_TYPE_LABELS } from '../../models/formation-labels';

@Component({
  selector: 'app-content-type-selector',
  imports: [ButtonModule],
  template: `
    <div class="flex flex-wrap gap-2">
      @for (option of options; track option.value) {
        <p-button
          [label]="option.label"
          [icon]="option.icon"
          [severity]="selected() === option.value ? 'primary' : 'secondary'"
          [outlined]="selected() !== option.value"
          [disabled]="false"
          (onClick)="select.emit(option.value)"
        />
      }
    </div>
  `
})
export class ContentTypeSelector {
  readonly selected = input<ContentType | null>(null);

  readonly select = output<ContentType>();

  protected readonly options: { value: ContentType; label: string; icon: string }[] = [
    { value: 'ARTICLE', label: CONTENT_TYPE_LABELS.ARTICLE, icon: 'pi pi-file' },
    { value: 'VIDEO', label: CONTENT_TYPE_LABELS.VIDEO, icon: 'pi pi-video' },
    { value: 'PDF', label: CONTENT_TYPE_LABELS.PDF, icon: 'pi pi-file-pdf' },
  ];
}
