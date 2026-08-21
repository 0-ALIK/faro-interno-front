import { Component, inject, OnInit, signal } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { InputTextModule } from 'primeng/inputtext';
import { TextareaModule } from 'primeng/textarea';
import { SelectModule } from 'primeng/select';
import { MultiSelectModule } from 'primeng/multiselect';
import { InputNumberModule } from 'primeng/inputnumber';
import { DividerModule } from 'primeng/divider';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { MessageModule } from 'primeng/message';

import { CourseStateService } from '../../services/course-state.service';
import { CatalogStateService } from '../../services/catalog-state.service';
import { COURSE_MODALITY_LABELS, COURSE_LEVEL_LABELS, COURSE_ORIGIN_LABELS, ENROLLMENT_MODE_LABELS } from '../../models/catalog-labels';

@Component({
  selector: 'app-course-form',
  imports: [
    ReactiveFormsModule,
    RouterLink,
    ButtonModule,
    CardModule,
    InputTextModule,
    TextareaModule,
    SelectModule,
    MultiSelectModule,
    InputNumberModule,
    DividerModule,
    ProgressSpinnerModule,
    MessageModule
  ],
  template: `
    <div class="flex flex-col gap-6">
      <div class="flex items-center justify-between">
        <h1 class="text-h2">{{ isEdit() ? 'Editar curso' : 'Nuevo curso' }}</h1>
        <p-button label="Volver" icon="pi pi-arrow-left" [outlined]="true" severity="secondary" routerLink="/catalog/courses" />
      </div>

      @if (courseState.detailLoading()) {
        <div class="flex items-center justify-center py-20">
          <p-progressSpinner strokeWidth="4" />
        </div>
      } @else {
        <form [formGroup]="form" (ngSubmit)="onSubmit()" class="flex flex-col gap-6">
          <div class="grid grid-cols-1 gap-6 xl:grid-cols-3">
            <div class="flex flex-col gap-6 xl:col-span-2">
              <p-card>
                <ng-template #title>Información básica</ng-template>
                <ng-template #content>
                  <div class="flex flex-col gap-4">
                    <div class="flex flex-col gap-1.5">
                      <label for="title" class="text-title">Título *</label>
                      <input pInputText id="title" formControlName="title" placeholder="Nombre del curso" class="w-full" />
                      @if (form.get('title')?.invalid && form.get('title')?.touched) {
                        <small class="text-xs text-red-500">El título es requerido (máx. 200 caracteres).</small>
                      }
                    </div>

                    <div class="flex flex-col gap-1.5">
                      <label for="description" class="text-title">Descripción</label>
                      <textarea pTextarea id="description" formControlName="description" rows="4" class="w-full" placeholder="Descripción del curso (máx. 2000 caracteres)"></textarea>
                    </div>
                  </div>
                </ng-template>
              </p-card>

              <p-card>
                <ng-template #title>Clasificación</ng-template>
                <ng-template #content>
                  <div class="grid grid-cols-1 gap-4 md:grid-cols-2">
                    <div class="flex flex-col gap-1.5">
                      <label for="modality" class="text-title">Modalidad *</label>
                      <p-select id="modality" formControlName="modality" [options]="modalityOptions" optionLabel="label" optionValue="value" placeholder="Seleccione…" class="w-full" />
                    </div>

                    <div class="flex flex-col gap-1.5">
                      <label for="level" class="text-title">Nivel *</label>
                      <p-select id="level" formControlName="level" [options]="levelOptions" optionLabel="label" optionValue="value" placeholder="Seleccione…" class="w-full" />
                    </div>

                    <div class="flex flex-col gap-1.5">
                      <label for="origin" class="text-title">Origen *</label>
                      <p-select id="origin" formControlName="origin" [options]="originOptions" optionLabel="label" optionValue="value" placeholder="Seleccione…" class="w-full" />
                    </div>

                    <div class="flex flex-col gap-1.5">
                      <label for="enrollmentMode" class="text-title">Modalidad de inscripción</label>
                      <p-select id="enrollmentMode" formControlName="enrollmentMode" [options]="enrollmentOptions" optionLabel="label" optionValue="value" placeholder="Seleccione…" class="w-full" />
                    </div>

                    <div class="flex flex-col gap-1.5">
                      <label for="durationHours" class="text-title">Duración (horas)</label>
                      <p-inputnumber id="durationHours" formControlName="durationHours" [min]="1" [showButtons]="true" suffix=" h" class="w-full" />
                    </div>
                  </div>
                </ng-template>
              </p-card>

              <p-card>
                <ng-template #title>Relaciones</ng-template>
                <ng-template #content>
                  <div class="grid grid-cols-1 gap-4 md:grid-cols-2">
                    <div class="flex flex-col gap-1.5">
                      <label for="categoryId" class="text-title">Categoría</label>
                      <p-select id="categoryId" formControlName="categoryId" [options]="catalogState.categoryOptions()" optionLabel="label" optionValue="value" placeholder="Seleccione…" [showClear]="true" class="w-full" (onShow)="onLoadCategories()" />
                    </div>

                    <div class="flex flex-col gap-1.5">
                      <label for="providerId" class="text-title">Proveedor</label>
                      <p-select id="providerId" formControlName="providerId" [options]="catalogState.providerOptions()" optionLabel="label" optionValue="value" placeholder="Seleccione…" [showClear]="true" class="w-full" (onShow)="onLoadProviders()" />
                    </div>

                    <div class="flex flex-col gap-1.5 md:col-span-2">
                      <label for="competencyIds" class="text-title">Competencias</label>
                      <p-multiselect id="competencyIds" formControlName="competencyIds" [options]="catalogState.competencyOptions()" optionLabel="label" optionValue="value" placeholder="Seleccione una o varias…" class="w-full" (onShow)="onLoadCompetencies()" />
                    </div>

                    <div class="flex flex-col gap-1.5 md:col-span-2">
                      <label for="tagIds" class="text-title">Etiquetas</label>
                      <p-multiselect id="tagIds" formControlName="tagIds" [options]="catalogState.tagOptions()" optionLabel="label" optionValue="value" placeholder="Seleccione una o varias…" class="w-full" (onShow)="onLoadTags()" />
                    </div>
                  </div>
                </ng-template>
              </p-card>
            </div>

            <div class="flex flex-col gap-6">
              <p-card>
                <ng-template #title>Portada</ng-template>
                <ng-template #content>
                  <div class="flex flex-col items-center gap-4">
                    @if (coverPreview()) {
                      <div class="relative w-full overflow-hidden rounded-xl">
                        <img [src]="coverPreview()" alt="Vista previa" class="w-full object-cover" />
                        <p-button icon="pi pi-times" [rounded]="true" severity="danger" size="small" styleClass="absolute right-2 top-2" (onClick)="removeCover()" ariaLabel="Eliminar portada" />
                      </div>
                    } @else {
                      <div class="flex h-40 w-full items-center justify-center rounded-xl border-2 border-dashed border-surface-300 bg-surface-50">
                        <span class="text-sm text-muted-color">Sin portada</span>
                      </div>
                    }
                    <label class="cursor-pointer rounded-xl bg-primary-50 px-4 py-2 text-sm font-medium text-primary-700 transition-colors hover:bg-primary-100">
                      Seleccionar imagen
                      <input type="file" accept="image/*" class="hidden" (change)="onCoverSelected($event)" />
                    </label>
                  </div>
                </ng-template>
              </p-card>

              <p-card>
                <ng-template #content>
                  <div class="flex flex-col gap-3">
                    <p-button type="submit" label="Guardar" icon="pi pi-check" [loading]="courseState.saving()" styleClass="w-full" />
                    <p-button type="button" label="Cancelar" icon="pi pi-times" severity="secondary" [outlined]="true" routerLink="/catalog/courses" styleClass="w-full" />
                  </div>
                </ng-template>
              </p-card>
            </div>
          </div>
        </form>
      }
    </div>
  `
})
export class CourseForm implements OnInit {
  protected readonly courseState = inject(CourseStateService);
  protected readonly catalogState = inject(CatalogStateService);
  private readonly fb = inject(FormBuilder);
  private readonly route = inject(ActivatedRoute);

  protected readonly isEdit = signal(false);
  protected readonly coverFile = signal<File | null>(null);
  protected readonly coverPreview = signal<string | null>(null);
  private originalCompetencyIds: string[] = [];
  private originalTagIds: string[] = [];

  protected readonly form: FormGroup = this.fb.group({
    title: ['', [Validators.required, Validators.maxLength(200)]],
    description: ['', Validators.maxLength(2000)],
    modality: [null, Validators.required],
    level: [null, Validators.required],
    origin: [null, Validators.required],
    enrollmentMode: ['OPEN'],
    durationHours: [null],
    categoryId: [null],
    providerId: [null],
    competencyIds: [[]],
    tagIds: [[]]
  });

  protected readonly modalityOptions = Object.entries(COURSE_MODALITY_LABELS).map(([value, label]) => ({ label, value }));
  protected readonly levelOptions = Object.entries(COURSE_LEVEL_LABELS).map(([value, label]) => ({ label, value }));
  protected readonly originOptions = Object.entries(COURSE_ORIGIN_LABELS).map(([value, label]) => ({ label, value }));
  protected readonly enrollmentOptions = Object.entries(ENROLLMENT_MODE_LABELS).map(([value, label]) => ({ label, value }));

  async ngOnInit(): Promise<void> {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.isEdit.set(true);
      await this.courseState.loadCourse(id);
      await Promise.all([
        this.catalogState.loadCategories(),
        this.catalogState.loadProviders(),
        this.catalogState.loadCompetencies(),
        this.catalogState.loadTags()
      ]);
      const course = this.courseState.currentCourse();
      if (course) {
        this.originalCompetencyIds = course.competencies.map((c) => c.id);
        this.originalTagIds = course.tags.map((t) => t.id);
        this.form.patchValue({
          title: course.title,
          description: course.description ?? '',
          modality: course.modality,
          level: course.level,
          origin: course.origin,
          enrollmentMode: course.enrollmentMode,
          durationHours: course.durationHours,
          categoryId: course.category?.id ?? null,
          providerId: course.provider?.id ?? null,
          competencyIds: course.competencies.map((c) => c.id),
          tagIds: course.tags.map((t) => t.id)
        });
      }
    }
  }

  protected onLoadCategories(): void {
    void this.catalogState.loadCategories();
  }

  protected onLoadProviders(): void {
    void this.catalogState.loadProviders();
  }

  protected onLoadCompetencies(): void {
    void this.catalogState.loadCompetencies();
  }

  protected onLoadTags(): void {
    void this.catalogState.loadTags();
  }

  protected onCoverSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];
    if (file) {
      this.coverFile.set(file);
      const reader = new FileReader();
      reader.onload = () => this.coverPreview.set(reader.result as string);
      reader.readAsDataURL(file);
    }
  }

  protected removeCover(): void {
    this.coverFile.set(null);
    this.coverPreview.set(null);
  }

  protected async onSubmit(): Promise<void> {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const id = this.route.snapshot.paramMap.get('id');
    const val = this.form.value;

    if (id) {
      await this.courseState.updateCourse(id, {
        title: val.title,
        description: val.description || null,
        modality: val.modality,
        level: val.level,
        enrollmentMode: val.enrollmentMode
      });

      if (val.durationHours) {
        await this.courseState.updateDuration(id, val.durationHours);
      }

      if (val.categoryId) await this.courseState.assignCategory(id, val.categoryId);
      if (val.providerId) await this.courseState.assignProvider(id, val.providerId);

      const currentCompetencyIds: string[] = val.competencyIds ?? [];
      const competenciesToAdd = currentCompetencyIds.filter((cid: string) => !this.originalCompetencyIds.includes(cid));
      const competenciesToRemove = this.originalCompetencyIds.filter((cid: string) => !currentCompetencyIds.includes(cid));
      if (competenciesToAdd.length > 0) await this.courseState.addCompetencies(id, competenciesToAdd);
      if (competenciesToRemove.length > 0) await this.courseState.removeCompetencies(id, competenciesToRemove);

      const currentTagIds: string[] = val.tagIds ?? [];
      const tagsToAdd = currentTagIds.filter((tid: string) => !this.originalTagIds.includes(tid));
      const tagsToRemove = this.originalTagIds.filter((tid: string) => !currentTagIds.includes(tid));
      if (tagsToAdd.length > 0) await this.courseState.addTags(id, tagsToAdd);
      if (tagsToRemove.length > 0) await this.courseState.removeTags(id, tagsToRemove);

      if (this.coverFile()) {
        const coverFormData = new FormData();
        coverFormData.append('cover', this.coverFile()!);
        await this.courseState.updateCover(id, coverFormData);
      }

      this.courseState.goToDetail(id);
    }
  }
}