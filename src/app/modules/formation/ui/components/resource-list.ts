import { Component, ElementRef, input, output, ViewChild } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { TableModule } from 'primeng/table';

import type { Resource } from '../../models/formation.model';

@Component({
  selector: 'app-resource-list',
  imports: [ButtonModule, TableModule],
  template: `
    <div class="flex flex-col gap-3">
      @if (resources().length === 0) {
        <p class="text-caption text-muted-color">Sin recursos adjuntos</p>
      } @else {
        <p-table [value]="resources()" styleClass="p-datatable-sm rounded-2xl overflow-hidden">
          <ng-template pTemplate="header">
            <tr>
              <th class="text-caption font-semibold uppercase tracking-wider">Nombre</th>
              <th class="text-caption font-semibold uppercase tracking-wider">Archivo</th>
              <th class="w-16"></th>
            </tr>
          </ng-template>
          <ng-template pTemplate="body" let-resource>
            <tr>
              <td class="text-body">{{ resource.name }}</td>
              <td class="text-body text-muted-color">{{ resource.fileName }}</td>
              <td class="text-right">
                <p-button
                  icon="pi pi-trash"
                  [rounded]="true"
                  [text]="true"
                  severity="danger"
                  size="small"
                  [disabled]="saving()"
                  (onClick)="delete.emit(resource.id)"
                />
              </td>
            </tr>
          </ng-template>
        </p-table>
      }

      <p-button
        label="Agregar recurso"
        icon="pi pi-plus"
        severity="secondary"
        [outlined]="true"
        [disabled]="saving()"
        (onClick)="fileInput.click()"
      />
      <input
        #fileInput
        type="file"
        class="hidden"
        (change)="onFileSelected($event)"
      />
    </div>
  `
})
export class ResourceList {
  readonly resources = input.required<Resource[]>();
  readonly saving = input(false);

  readonly add = output<File>();
  readonly delete = output<string>();

  @ViewChild('fileInput') private fileInput!: ElementRef<HTMLInputElement>;

  protected onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];
    if (file) {
      this.add.emit(file);
      input.value = '';
    }
  }
}
