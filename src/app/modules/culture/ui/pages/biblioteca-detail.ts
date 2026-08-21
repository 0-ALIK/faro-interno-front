import { Component, OnDestroy, OnInit, ViewChild, computed, effect, inject, signal } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { DividerModule } from 'primeng/divider';
import { TagModule } from 'primeng/tag';
import { ChipModule } from 'primeng/chip';
import { TabsModule } from 'primeng/tabs';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { MessageModule } from 'primeng/message';
import { InputTextModule } from 'primeng/inputtext';
import { TextareaModule } from 'primeng/textarea';
import { SelectModule } from 'primeng/select';
import { InputNumberModule } from 'primeng/inputnumber';
import { ToggleSwitchModule } from 'primeng/toggleswitch';
import { ToastModule } from 'primeng/toast';
import { DialogModule } from 'primeng/dialog';
import { MessageService } from 'primeng/api';

import { forkJoin } from 'rxjs';
import { CultureStateService } from '../../services/culture-state.service';
import { CultureStatusTag } from '../components/culture-status-tag';
import { CultureMapComponent } from '../components/culture-map';
import { DAY_LABELS, LIBRARY_ZONE_LABELS } from '../../models/culture-labels';
import type { LibraryDetailDto } from '../../api/culture.dto';

@Component({
  selector: 'app-biblioteca-detail',
  imports: [
    FormsModule,
    ButtonModule,
    CardModule,
    DividerModule,
    TagModule,
    ChipModule,
    TabsModule,
    ProgressSpinnerModule,
    MessageModule,
    InputTextModule,
    TextareaModule,
    SelectModule,
    InputNumberModule,
    ToggleSwitchModule,
    ToastModule,
    DialogModule,
    CultureStatusTag,
    CultureMapComponent
  ],
  providers: [MessageService],
  template: `
    <p-toast />
    <div class="flex flex-col gap-6">
      @if (cultureState.loading() && !cultureState.libraryDetail()) {
        <div class="flex items-center justify-center py-20">
          <p-progressSpinner strokeWidth="4" />
        </div>
      } @else if (!cultureState.libraryDetail()) {
        <p-message severity="error">No se encontró la biblioteca.</p-message>
      } @else if (cultureState.libraryDetail(); as lib) {
        <div class="relative overflow-hidden rounded-3xl bg-gradient-to-br from-primary-600 via-primary-700 to-primary-950 p-8 shadow-lg md:p-10">
          <div class="relative flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
            <div>
              <div class="mb-3 flex flex-wrap items-center gap-2">
                <app-culture-status-tag [status]="lib.status" />
                @if (lib.type) {
                  <span class="inline-flex items-center rounded-lg bg-white/15 px-2.5 py-1 text-xs font-medium text-white">
                    {{ lib.type.name }}
                  </span>
                }
              </div>
              <h1 class="text-h1 text-white">{{ lib.name }}</h1>
              <div class="mt-2 flex flex-wrap items-center gap-4 text-sm text-primary-200">
                @if (lib.direction?.corregimiento) {
                  <span class="inline-flex items-center gap-1.5">
                    <span class="pi pi-map-marker text-xs" aria-hidden="true"></span>
                    {{ lib.direction.corregimiento.name }}
                  </span>
                }
                @if (lib.email) {
                  <span class="inline-flex items-center gap-1.5">
                    <span class="pi pi-envelope text-xs" aria-hidden="true"></span>
                    {{ lib.email }}
                  </span>
                }
                @if (lib.phone) {
                  <span class="inline-flex items-center gap-1.5">
                    <span class="pi pi-phone text-xs" aria-hidden="true"></span>
                    {{ lib.phone }}
                  </span>
                }
              </div>
            </div>
            <div class="flex gap-2">
              @if (lib.status === 'INACTIVE') {
                <p-button label="Activar" icon="pi pi-check" [loading]="cultureState.loading()" (onClick)="onActivate()" styleClass="!bg-white !text-primary-700 !border-white shadow-md" />
              }
              @if (lib.status === 'ACTIVE') {
                <p-button label="Desactivar" icon="pi pi-ban" severity="danger" [loading]="cultureState.loading()" (onClick)="onDeactivate()" />
                <p-button label="Destacar" icon="pi pi-star" [loading]="cultureState.loading()" (onClick)="onStandout()" styleClass="!bg-white !text-primary-700 !border-white shadow-md" />
              }
              @if (lib.status === 'STANDOUT') {
                <p-button label="Quitar destacado" icon="pi pi-star-half-o" severity="warn" [loading]="cultureState.loading()" (onClick)="onDeactivate()" />
              }
            </div>
          </div>
        </div>

        <p-tabs [value]="activeTab()">
          <p-tablist>
            <p-tab value="info">Información básica</p-tab>
            <p-tab value="contacto">Contacto y ubicación</p-tab>
            <p-tab value="actividades">Actividades</p-tab>
            <p-tab value="servicios">Servicios</p-tab>
            <p-tab value="horario">Horario de atención</p-tab>
            <p-tab value="eventos">Eventos</p-tab>
            <p-tab value="medios">Medios</p-tab>
          </p-tablist>

          <p-tabpanels>
            <p-tabpanel value="info">
              <p-card>
                <ng-template #title>Información básica</ng-template>
                <ng-template #content>
                  <div class="flex flex-col gap-4">
                    <div class="flex flex-col gap-1.5">
                      <label for="libName" class="text-caption font-semibold uppercase tracking-wider text-muted-color">Nombre</label>
                      <input pInputText id="libName" [(ngModel)]="editName" class="w-full" />
                    </div>
                    <div class="flex flex-col gap-1.5">
                      <label for="libDesc" class="text-caption font-semibold uppercase tracking-wider text-muted-color">Descripción</label>
                      <textarea pTextarea id="libDesc" [(ngModel)]="editDescription" rows="3" class="w-full"></textarea>
                    </div>
                    <div class="grid grid-cols-1 gap-4 md:grid-cols-2">
                      <div class="flex flex-col gap-1.5">
                        <label for="libType" class="text-caption font-semibold uppercase tracking-wider text-muted-color">Tipo</label>
                        <p-select id="libType" [(ngModel)]="editTypeId" [options]="cultureState.typeLibraryOptions()" optionLabel="label" optionValue="value" placeholder="Seleccione…" [showClear]="true" appendTo="body" class="w-full" (onShow)="onLoadTypeLibraries()" />
                      </div>
                      <div class="flex flex-col gap-1.5">
                        <label for="libEmail" class="text-caption font-semibold uppercase tracking-wider text-muted-color">Email</label>
                        <input pInputText id="libEmail" [(ngModel)]="editEmail" class="w-full" />
                      </div>
                      <div class="flex flex-col gap-1.5">
                        <label for="libPhone" class="text-caption font-semibold uppercase tracking-wider text-muted-color">Teléfono</label>
                        <input pInputText id="libPhone" [(ngModel)]="editPhone" class="w-full" />
                      </div>
                    </div>
                    <div class="flex justify-end">
                      <p-button label="Guardar" icon="pi pi-check" [loading]="cultureState.loading()" (onClick)="onSaveInfo()" />
                    </div>
                  </div>
                </ng-template>
              </p-card>
            </p-tabpanel>

            <p-tabpanel value="contacto">
              <div class="grid grid-cols-1 gap-6 xl:grid-cols-2">
                <p-card>
                  <ng-template #title>Ubicación</ng-template>
                  <ng-template #content>
                    <div class="flex flex-col gap-4">
                      <div class="flex flex-col gap-1.5">
                        <label for="dirDesc" class="text-caption font-semibold uppercase tracking-wider text-muted-color">Dirección</label>
                        <input pInputText id="dirDesc" [(ngModel)]="editDirDescription" placeholder="Calle 123 #45-67" class="w-full" />
                      </div>
                      <div class="grid grid-cols-2 gap-4">
                        <div class="flex flex-col gap-1.5">
                          <label for="dirLat" class="text-caption font-semibold uppercase tracking-wider text-muted-color">Latitud</label>
                          <input pInputText id="dirLat" [value]="formatCoord(editDirLat)" [disabled]="true" class="w-full" placeholder="0.000000" />
                        </div>
                        <div class="flex flex-col gap-1.5">
                          <label for="dirLon" class="text-caption font-semibold uppercase tracking-wider text-muted-color">Longitud</label>
                          <input pInputText id="dirLon" [value]="formatCoord(editDirLon)" [disabled]="true" class="w-full" placeholder="0.000000" />
                        </div>
                      </div>
                      <div class="grid grid-cols-2 gap-4">
                        <div class="flex flex-col gap-1.5">
                          <label for="dirZone" class="text-caption font-semibold uppercase tracking-wider text-muted-color">Zona</label>
                          <p-select id="dirZone" [(ngModel)]="editDirZone" [options]="zoneOptions" optionLabel="label" optionValue="value" placeholder="Seleccione…" appendTo="body" class="w-full" />
                        </div>
                        <div class="flex flex-col gap-1.5">
                          <label for="dirCorreg" class="text-caption font-semibold uppercase tracking-wider text-muted-color">Corregimiento</label>
                          <p-select id="dirCorreg" [(ngModel)]="editDirCorregimientoId" [options]="cultureState.corregimientoOptions()" optionLabel="label" optionValue="value" placeholder="Seleccione…" [showClear]="true" appendTo="body" class="w-full" (onShow)="onLoadCorregimientos()" />
                        </div>
                      </div>
                      <div class="flex justify-end">
                        <p-button label="Guardar ubicación" icon="pi pi-check" [loading]="cultureState.loading()" (onClick)="onSaveDirection()" />
                      </div>
                    </div>
                  </ng-template>
                </p-card>

                <p-card>
                  <ng-template #title>Mapa</ng-template>
                  <ng-template #content>
                    <p class="mb-3 text-sm text-muted-color">Haz clic en el mapa para seleccionar la ubicación.</p>
                    <app-culture-map
                      #mapRef
                      [markers]="mapMarkers()"
                      [selectable]="true"
                      [center]="mapCenter()"
                      height="350px"
                      (pointSelect)="onMapPointSelect($event)"
                    />
                  </ng-template>
                </p-card>
              </div>
            </p-tabpanel>

            <p-tabpanel value="actividades">
              <p-card>
                <ng-template #title>Actividades</ng-template>
                <ng-template #content>
                  <div class="flex flex-col gap-4">
                    @if (lib.activities.length > 0) {
                      <div class="flex flex-wrap gap-2">
                        @for (activity of lib.activities; track activity.id) {
                          <p-chip [label]="activity.name" removable (onRemove)="onRemoveActivity(activity.id)" />
                        }
                      </div>
                    } @else {
                      <p class="text-sm text-muted-color">No hay actividades asignadas.</p>
                    }
                    <p-divider />
                    <div class="flex items-center gap-3">
                      <p-select
                        [ngModel]="selectedActivitySignal()"
                        (ngModelChange)="selectedActivitySignal.set($event)"
                        [options]="availableActivityOptions()"
                        optionLabel="label"
                        optionValue="value"
                        placeholder="Seleccionar actividad…"
                        [showClear]="true"
                        appendTo="body"
                        class="flex-1"
                        (onShow)="onLoadActivityLibraries()"
                      />
                      <p-button label="Agregar" icon="pi pi-plus" [disabled]="!selectedActivitySignal()" [loading]="cultureState.loading()" (onClick)="onAddActivity()" />
                    </div>
                  </div>
                </ng-template>
              </p-card>
            </p-tabpanel>

            <p-tabpanel value="servicios">
              <p-card>
                <ng-template #title>Servicios</ng-template>
                <ng-template #content>
                  <div class="flex flex-col gap-4">
                    @if (lib.services.length > 0) {
                      <div class="flex flex-wrap gap-2">
                        @for (service of lib.services; track service.id) {
                          <p-chip [label]="service.name" removable (onRemove)="onRemoveService(service.id)" />
                        }
                      </div>
                    } @else {
                      <p class="text-sm text-muted-color">No hay servicios asignados.</p>
                    }
                    <p-divider />
                    <div class="flex items-center gap-3">
                      <p-select
                        [ngModel]="selectedServiceSignal()"
                        (ngModelChange)="selectedServiceSignal.set($event)"
                        [options]="availableServiceOptions()"
                        optionLabel="label"
                        optionValue="value"
                        placeholder="Seleccionar servicio…"
                        [showClear]="true"
                        appendTo="body"
                        class="flex-1"
                        (onShow)="onLoadServiceLibraries()"
                      />
                      <p-button label="Agregar" icon="pi pi-plus" [disabled]="!selectedServiceSignal()" [loading]="cultureState.loading()" (onClick)="onAddService()" />
                    </div>
                  </div>
                </ng-template>
              </p-card>
            </p-tabpanel>

            <p-tabpanel value="horario">
              <p-card>
                <ng-template #title>Horario de atención</ng-template>
                <ng-template #content>
                  <p class="mb-4 text-sm text-muted-color">Define apertura y cierre por día de la semana.</p>
                  <div class="flex flex-col gap-2">
                    @for (item of scheduleValues(); track item.day; let i = $index) {
                      <div class="grid grid-cols-[120px_1fr_1fr_100px] items-center gap-3 rounded-xl border border-surface-100 px-4 py-3">
                        <span class="text-sm font-medium text-surface-900">{{ dayLabel(item.day) }}</span>
                        <input
                          type="time"
                          pInputText
                          [value]="item.start"
                          [disabled]="item.closed"
                          (change)="onTimeChange(i, 'start', $event)"
                          class="w-full"
                        />
                        <input
                          type="time"
                          pInputText
                          [value]="item.end"
                          [disabled]="item.closed"
                          (change)="onTimeChange(i, 'end', $event)"
                          class="w-full"
                        />
                        <div class="flex items-center gap-2">
                          <p-toggleswitch
                            [ngModel]="item.closed"
                            (ngModelChange)="onClosedToggle(i, $event)"
                          />
                          <span class="text-xs text-muted-color">Cerrado</span>
                        </div>
                      </div>
                    }
                  </div>
                  <div class="flex justify-end pt-4">
                    <p-button label="Guardar horario" icon="pi pi-check" [loading]="savingSchedule()" [disabled]="!scheduleDirty()" (onClick)="onSaveSchedule()" />
                  </div>
                </ng-template>
              </p-card>
            </p-tabpanel>

            <p-tabpanel value="eventos">
              <p-card>
                <ng-template #title>
                  <div class="flex items-center justify-between">
                    <span>Eventos</span>
                    <p-button label="Nuevo evento" icon="pi pi-plus" size="small" (onClick)="showEventDialog.set(true)" />
                  </div>
                </ng-template>
                <ng-template #content>
                  @if (lib.events.length > 0) {
                    <div class="flex flex-col gap-3">
                      @for (evt of lib.events; track evt.id) {
                        <div class="flex items-center justify-between rounded-xl border border-surface-100 px-4 py-3 transition-colors hover:bg-surface-50">
                          <div class="flex items-center gap-3">
                            @if (evt.picture) {
                              <img [src]="evt.picture.url" [alt]="evt.name" class="h-10 w-10 shrink-0 rounded-lg object-cover" />
                            } @else {
                              <span class="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary-50 text-primary-700">
                                <span class="pi pi-calendar text-sm" aria-hidden="true"></span>
                              </span>
                            }
                            <div>
                              <p class="text-sm font-semibold text-surface-900">{{ evt.name }}</p>
                              <p class="text-caption text-muted-color">{{ evt.schedule.date }} · {{ evt.schedule.initTime }}</p>
                            </div>
                          </div>
                          <div class="flex gap-1">
                            <p-button icon="pi pi-pencil" [rounded]="true" [text]="true" severity="info" size="small" (onClick)="onEditEvent(evt)" ariaLabel="Editar" />
                            <p-button icon="pi pi-trash" [rounded]="true" [text]="true" severity="danger" size="small" [loading]="cultureState.loading()" (onClick)="onDeleteEvent(evt.id)" ariaLabel="Eliminar" />
                          </div>
                        </div>
                      }
                    </div>
                  } @else {
                    <p class="text-sm text-muted-color">No hay eventos asociados.</p>
                  }
                </ng-template>
              </p-card>
            </p-tabpanel>

            <p-tabpanel value="medios">
              <p-card>
                <ng-template #title>Imágenes</ng-template>
                <ng-template #content>
                  <div class="flex flex-col gap-4">
                    @if (lib.pictures.length > 0) {
                      <div class="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3">
                        @for (pic of lib.pictures; track pic.key) {
                          <div class="group relative overflow-hidden rounded-xl border border-surface-200">
                            <img [src]="pic.url" [alt]="pic.name" class="h-48 w-full object-cover" />
                            <p-button
                              icon="pi pi-times"
                              [rounded]="true"
                              severity="danger"
                              size="small"
                              styleClass="absolute right-2 top-2 opacity-0 group-hover:opacity-100 transition-opacity"
                              [loading]="cultureState.loading()"
                              (onClick)="onRemovePicture(pic.key)"
                              ariaLabel="Eliminar imagen"
                            />
                          </div>
                        }
                      </div>
                    } @else {
                      <p class="text-sm text-muted-color">No hay imágenes registradas.</p>
                    }
                    <div>
                      <label class="cursor-pointer rounded-xl bg-primary-50 px-4 py-2 text-sm font-medium text-primary-700 transition-colors hover:bg-primary-100">
                        Subir imagen
                        <input type="file" accept="image/*" class="hidden" (change)="onPictureSelected($event)" />
                      </label>
                    </div>
                  </div>
                </ng-template>
              </p-card>
            </p-tabpanel>
          </p-tabpanels>
        </p-tabs>
      }
    </div>

    <p-dialog
      header="Nuevo evento"
      [modal]="true"
      [visible]="showEventDialog()"
      (onHide)="closeEventDialog()"
      [style]="{ width: '36rem' }"
    >
      <div class="flex flex-col gap-4">
        <div class="flex flex-col gap-1.5">
          <label for="evtName" class="text-caption font-semibold uppercase tracking-wider text-muted-color">Nombre</label>
          <input pInputText id="evtName" [(ngModel)]="eventFormName" class="w-full" />
        </div>
        <div class="flex flex-col gap-1.5">
          <label for="evtType" class="text-caption font-semibold uppercase tracking-wider text-muted-color">Tipo</label>
          <p-select id="evtType" [(ngModel)]="eventFormTypeId" [options]="cultureState.typeEventOptions()" optionLabel="label" optionValue="value" placeholder="Seleccione…" appendTo="body" class="w-full" (onShow)="onLoadTypeEvents()" />
        </div>
        <div class="flex flex-col gap-1.5">
          <label for="evtDate" class="text-caption font-semibold uppercase tracking-wider text-muted-color">Fecha</label>
          <input type="date" pInputText id="evtDate" [ngModel]="eventFormDate" (ngModelChange)="eventFormDate = $event" class="w-full" />
        </div>
        <div class="grid grid-cols-2 gap-4">
          <div class="flex flex-col gap-1.5">
            <label class="text-caption font-semibold uppercase tracking-wider text-muted-color">Hora inicio</label>
            <input type="time" pInputText [ngModel]="eventFormStartTime" (ngModelChange)="eventFormStartTime = $event" class="w-full" />
          </div>
          <div class="flex flex-col gap-1.5">
            <label class="text-caption font-semibold uppercase tracking-wider text-muted-color">Hora fin</label>
            <input type="time" pInputText [ngModel]="eventFormEndTime" (ngModelChange)="eventFormEndTime = $event" class="w-full" />
          </div>
        </div>
        <div class="flex flex-col gap-1.5">
          <label for="evtDesc" class="text-caption font-semibold uppercase tracking-wider text-muted-color">Descripción</label>
          <textarea pTextarea id="evtDesc" [(ngModel)]="eventFormDescription" rows="3" class="w-full"></textarea>
        </div>
      </div>
      <ng-template #footer>
        <p-button label="Cancelar" severity="secondary" [text]="true" (onClick)="closeEventDialog()" />
        <p-button [label]="editingEventId() ? 'Guardar' : 'Crear'" icon="pi pi-check" [loading]="cultureState.loading()" [disabled]="!eventFormName.trim()" (onClick)="onSaveEvent()" />
      </ng-template>
    </p-dialog>
  `
})
export class BibliotecaDetail implements OnInit, OnDestroy {
  @ViewChild('mapRef') mapRef?: CultureMapComponent;

  protected readonly cultureState = inject(CultureStateService);
  private readonly route = inject(ActivatedRoute);
  private readonly messageService = inject(MessageService);

  private formInitialized = false;
  private readonly effectRef = effect(() => {
    const lib = this.cultureState.libraryDetail();
    if (lib && !this.formInitialized) {
      this.formInitialized = true;
      this.initFormFromLibrary(lib);
    }
  });

  protected readonly activeTab = signal('info');
  protected readonly showEventDialog = signal(false);
  protected readonly editingEventId = signal<string | null>(null);

  protected editName = '';
  protected editDescription = '';
  protected editTypeId: string | null = null;
  protected editEmail = '';
  protected editPhone = '';

  protected editDirDescription = '';
  protected editDirZone = '';
  protected editDirCorregimientoId: string | null = null;
  protected editDirLat: number | null = null;
  protected editDirLon: number | null = null;

  protected readonly scheduleValues = signal<{ day: string; start: string; end: string; closed: boolean }[]>([]);
  protected readonly scheduleInitial = signal<string>('');
  protected readonly savingSchedule = signal(false);

  protected readonly scheduleDirty = computed(() => {
    return JSON.stringify(this.scheduleValues()) !== this.scheduleInitial();
  });

  protected readonly selectedActivitySignal = signal<string | null>(null);
  protected readonly selectedServiceSignal = signal<string | null>(null);

  protected eventFormName = '';
  protected eventFormTypeId: string | null = null;
  protected eventFormDate = '';
  protected eventFormStartTime = '09:00';
  protected eventFormEndTime = '17:00';
  protected eventFormDescription = '';

  protected readonly zoneOptions = Object.entries(LIBRARY_ZONE_LABELS).map(([value, label]) => ({ value, label }));
  protected readonly closedOptions = [{ value: false, label: 'Abierto' }, { value: true, label: 'Cerrado' }];

  protected readonly mapMarkers = computed(() => {
    const lib = this.cultureState.libraryDetail();
    if (!lib?.direction?.lat || !lib?.direction?.lon) return [];
    return [{ name: lib.name, lat: lib.direction.lat, lon: lib.direction.lon }];
  });

  protected readonly mapCenter = computed(() => {
    const lib = this.cultureState.libraryDetail();
    if (!lib?.direction?.lat || !lib?.direction?.lon) return undefined;
    return { lat: lib.direction.lat, lon: lib.direction.lon };
  });

  protected readonly availableActivityOptions = computed(() => {
    const lib = this.cultureState.libraryDetail();
    const currentIds = lib?.activities.map((a) => a.id) ?? [];
    return this.cultureState.activityLibraryOptions().filter((o) => !currentIds.includes(o.value));
  });

  protected readonly availableServiceOptions = computed(() => {
    const lib = this.cultureState.libraryDetail();
    const currentIds = lib?.services.map((s) => s.id) ?? [];
    return this.cultureState.serviceLibraryOptions().filter((o) => !currentIds.includes(o.value));
  });

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      void this.cultureState.loadLibrary(id);
    }
  }

  private initFormFromLibrary(lib: LibraryDetailDto): void {
    this.editName = lib.name;
    this.editDescription = lib.description;
    this.editTypeId = lib.type?.id ?? null;
    this.editEmail = lib.email;
    this.editPhone = lib.phone;
    this.editDirDescription = lib.direction?.description ?? '';
    this.editDirZone = lib.direction?.zone ?? '';
    this.editDirCorregimientoId = lib.direction?.corregimiento?.id ?? null;
    this.editDirLat = lib.direction?.lat ?? null;
    this.editDirLon = lib.direction?.lon ?? null;
    this.scheduleValues.set(
      (lib.dailySchedules ?? []).map((s) => ({
        day: s.day,
        start: this.to24h(s.startTime ?? ''),
        end: this.to24h(s.endTime ?? ''),
        closed: s.closed
      }))
    );
    if (this.scheduleValues().length < 7) {
      const allDays = ['1', '2', '3', '4', '5', '6', '7'];
      const existentes = new Set(this.scheduleValues().map((s) => s.day));
      const faltantes = allDays.filter((d) => !existentes.has(d));
      this.scheduleValues.update((v) => [
        ...v,
        ...faltantes.map((d) => ({ day: d, start: '', end: '', closed: true }))
      ]);
    }
    this.scheduleInitial.set(JSON.stringify(this.scheduleValues()));
  }

  protected dayLabel(day: string): string {
    const englishMap: Record<string, string> = {
      monday: 'Lunes', tuesday: 'Martes', wednesday: 'Miércoles',
      thursday: 'Jueves', friday: 'Viernes', saturday: 'Sábado', sunday: 'Domingo'
    };
    return englishMap[day?.toLowerCase()] ?? DAY_LABELS[parseInt(day, 10)] ?? day;
  }

  protected formatCoord(value: number | null): string {
    return value != null ? value.toFixed(6) : '';
  }

  private to24h(time: string): string {
    if (!time) return '';
    const match = time.match(/^(\d{1,2}):(\d{2})\s*(AM|PM)$/i);
    if (!match) return time;
    let h = parseInt(match[1], 10);
    const m = match[2];
    const ampm = match[3].toUpperCase();
    if (ampm === 'PM' && h !== 12) h += 12;
    if (ampm === 'AM' && h === 12) h = 0;
    return `${String(h).padStart(2, '0')}:${m}`;
  }

  protected onLoadTypeLibraries(): void {
    void this.cultureState.loadTypeLibraries();
  }

  protected onLoadTypeEvents(): void {
    void this.cultureState.loadTypeEvents();
  }

  protected onLoadCorregimientos(): void {
    void this.cultureState.loadCorregimientos();
  }

  protected onLoadActivityLibraries(): void {
    void this.cultureState.loadActivityLibraries();
  }

  protected onLoadServiceLibraries(): void {
    void this.cultureState.loadServiceLibraries();
  }

  protected onMapPointSelect(point: { lat: number; lon: number }): void {
    this.editDirLat = point.lat;
    this.editDirLon = point.lon;
    const lib = this.cultureState.libraryDetail();
    const name = lib?.name ?? 'Ubicación';
    this.mapRef?.refreshMarkers([{ name, lat: point.lat, lon: point.lon }]);
  }

  protected async onActivate(): Promise<void> {
    const id = this.getId();
    if (!id) return;
    await this.cultureState.activateLibrary(id);
    this.messageService.add({ severity: 'success', summary: 'Activada', detail: 'Biblioteca activada.' });
  }

  protected async onDeactivate(): Promise<void> {
    const id = this.getId();
    if (!id) return;
    await this.cultureState.deactivateLibrary(id);
    this.messageService.add({ severity: 'success', summary: 'Desactivada', detail: 'Biblioteca desactivada.' });
  }

  protected async onStandout(): Promise<void> {
    const id = this.getId();
    if (!id) return;
    await this.cultureState.standoutLibrary(id);
    this.messageService.add({ severity: 'success', summary: 'Destacada', detail: 'Biblioteca destacada.' });
  }

  protected async onSaveInfo(): Promise<void> {
    const id = this.getId();
    const lib = this.cultureState.libraryDetail();
    if (!id || !lib) return;
    try {
      await this.cultureState.updateLibraryInfo(id, {
        name: this.editName || lib.name,
        description: this.editDescription || lib.description,
        typeId: this.editTypeId ?? lib.type?.id ?? '',
        email: this.editEmail || lib.email,
        phone: this.editPhone || lib.phone
      });
      this.messageService.add({ severity: 'success', summary: 'Guardado', detail: 'Información actualizada.' });
    } catch {
      this.messageService.add({ severity: 'error', summary: 'Error', detail: 'No se pudo guardar.' });
    }
  }

  protected async onSaveDirection(): Promise<void> {
    const id = this.getId();
    const lib = this.cultureState.libraryDetail();
    if (!id || !lib) return;
    try {
      await this.cultureState.updateLibraryDirection(id, {
        description: this.editDirDescription || (lib.direction?.description ?? ''),
        zone: this.editDirZone || (lib.direction?.zone ?? ''),
        lat: this.editDirLat ?? lib.direction?.lat ?? 0,
        lon: this.editDirLon ?? lib.direction?.lon ?? 0,
        corregimientoId: this.editDirCorregimientoId ?? lib.direction?.corregimiento?.id ?? ''
      });
      this.messageService.add({ severity: 'success', summary: 'Guardado', detail: 'Ubicación actualizada.' });
    } catch {
      this.messageService.add({ severity: 'error', summary: 'Error', detail: 'No se pudo guardar.' });
    }
  }

  protected onTimeChange(index: number, field: 'start' | 'end', event: Event): void {
    const value = (event.target as HTMLInputElement).value;
    this.scheduleValues.update((items) =>
      items.map((item, i) => (i === index ? { ...item, [field]: value } : item))
    );
  }

  protected onClosedToggle(index: number, value: boolean): void {
    this.scheduleValues.update((items) =>
      items.map((item, i) => (i === index ? { ...item, closed: value } : item))
    );
  }

  protected async onSaveSchedule(): Promise<void> {
    const id = this.getId();
    if (!id) return;
    this.savingSchedule.set(true);
    try {
      const dayNameToNumber: Record<string, number> = {
        monday: 1, tuesday: 2, wednesday: 3, thursday: 4, friday: 5, saturday: 6, sunday: 7,
        lunes: 1, martes: 2, miercoles: 3, jueves: 4, viernes: 5, sabado: 6, domingo: 7,
        '1': 1, '2': 2, '3': 3, '4': 4, '5': 5, '6': 6, '7': 7
      };
      const initialParsed = JSON.parse(this.scheduleInitial());
      const changed = this.scheduleValues().filter((s, i) => {
        const init = initialParsed[i];
        return !init || s.start !== init.start || s.end !== init.end || s.closed !== init.closed;
      });
      const calls = changed.map((s) => {
        const [sH, sM] = (s.start || '00:00').split(':').map(Number);
        const [eH, eM] = (s.end || '00:00').split(':').map(Number);
        return this.cultureState.updateLibrarySchedule(id, {
          day: dayNameToNumber[s.day?.toLowerCase()] ?? 1,
          startTimeHour: sH,
          startTimeMin: sM,
          endTimeHour: eH,
          endTimeMin: eM,
          closed: s.closed
        });
      });
      await Promise.all(calls);
      this.scheduleInitial.set(JSON.stringify(this.scheduleValues()));
      this.messageService.add({ severity: 'success', summary: 'Guardado', detail: 'Horario actualizado.' });
    } catch {
      this.messageService.add({ severity: 'error', summary: 'Error', detail: 'No se pudo guardar el horario.' });
    } finally {
      this.savingSchedule.set(false);
    }
  }

  protected async onAddActivity(): Promise<void> {
    const id = this.getId();
    const activityId = this.selectedActivitySignal();
    if (!id || !activityId) return;
    await this.cultureState.addLibraryActivity(id, activityId);
    this.selectedActivitySignal.set(null);
    this.messageService.add({ severity: 'success', summary: 'Agregada', detail: 'Actividad agregada.' });
  }

  protected async onRemoveActivity(activityId: string): Promise<void> {
    const id = this.getId();
    if (!id) return;
    await this.cultureState.removeLibraryActivity(id, activityId);
    this.messageService.add({ severity: 'success', summary: 'Removida', detail: 'Actividad removida.' });
  }

  protected async onAddService(): Promise<void> {
    const id = this.getId();
    const serviceId = this.selectedServiceSignal();
    if (!id || !serviceId) return;
    await this.cultureState.addLibraryService(id, serviceId);
    this.selectedServiceSignal.set(null);
    this.messageService.add({ severity: 'success', summary: 'Agregado', detail: 'Servicio agregado.' });
  }

  protected async onRemoveService(serviceId: string): Promise<void> {
    const id = this.getId();
    if (!id) return;
    await this.cultureState.removeLibraryService(id, serviceId);
    this.messageService.add({ severity: 'success', summary: 'Removido', detail: 'Servicio removido.' });
  }

  protected async onPictureSelected(event: Event): Promise<void> {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];
    if (!file) return;
    const id = this.getId();
    if (!id) return;
    const formData = new FormData();
    formData.append('picture', file);
    await this.cultureState.addLibraryPicture(id, formData);
    input.value = '';
    this.messageService.add({ severity: 'success', summary: 'Subida', detail: 'Imagen subida.' });
  }

  protected async onRemovePicture(key: string): Promise<void> {
    const id = this.getId();
    if (!id) return;
    await this.cultureState.removeLibraryPicture(id, key);
    this.messageService.add({ severity: 'success', summary: 'Eliminada', detail: 'Imagen eliminada.' });
  }

  protected onEditEvent(evt: { id: string; name: string; schedule: { date: string; initTime: string; endTime: string } }): void {
    this.editingEventId.set(evt.id);
    this.eventFormName = evt.name;
    const dateStr = evt.schedule.date ?? '';
    if (dateStr.includes('-')) {
      this.eventFormDate = dateStr;
    } else if (dateStr.includes('/')) {
      const [d, m, y] = dateStr.split('/');
      this.eventFormDate = `${y}-${m.padStart(2, '0')}-${d.padStart(2, '0')}`;
    } else {
      this.eventFormDate = '';
    }
    this.eventFormStartTime = evt.schedule.initTime ?? '09:00';
    this.eventFormEndTime = evt.schedule.endTime ?? '17:00';
    this.showEventDialog.set(true);
  }

  protected async onSaveEvent(): Promise<void> {
    const id = this.getId();
    if (!id) return;
    const [startH, startM] = (this.eventFormStartTime || '09:00').split(':').map(Number);
    const [endH, endM] = (this.eventFormEndTime || '17:00').split(':').map(Number);
    const dateParts = (this.eventFormDate || '').split('-').map(Number);
    const dto = {
      name: this.eventFormName,
      typeId: this.eventFormTypeId ?? '',
      libraryId: id,
      day: dateParts[2] || 1,
      month: dateParts[1] || 1,
      year: dateParts[0] || new Date().getFullYear(),
      startTimeHour: startH,
      startTimeMin: startM,
      endTimeHour: endH,
      endTimeMin: endM,
      description: this.eventFormDescription
    };
    try {
      if (this.editingEventId()) {
        await this.cultureState.updateEvent(this.editingEventId()!, dto);
        this.messageService.add({ severity: 'success', summary: 'Actualizado', detail: 'Evento actualizado.' });
      } else {
        await this.cultureState.createEvent(dto);
        this.messageService.add({ severity: 'success', summary: 'Creado', detail: 'Evento creado.' });
      }
      this.closeEventDialog();
      await this.cultureState.loadLibrary(id);
    } catch {
      this.messageService.add({ severity: 'error', summary: 'Error', detail: 'No se pudo guardar el evento.' });
    }
  }

  protected async onDeleteEvent(eventId: string): Promise<void> {
    const id = this.getId();
    if (!id) return;
    await this.cultureState.deleteEvent(eventId);
    await this.cultureState.loadLibrary(id);
    this.messageService.add({ severity: 'success', summary: 'Eliminado', detail: 'Evento eliminado.' });
  }

  protected closeEventDialog(): void {
    this.showEventDialog.set(false);
    this.editingEventId.set(null);
    this.eventFormName = '';
    this.eventFormTypeId = null;
    this.eventFormDate = '';
    this.eventFormStartTime = '09:00';
    this.eventFormEndTime = '17:00';
    this.eventFormDescription = '';
  }

  private getId(): string | null {
    return this.route.snapshot.paramMap.get('id');
  }

  ngOnDestroy(): void {
    this.effectRef.destroy();
  }
}
