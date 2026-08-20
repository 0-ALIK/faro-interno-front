import { Injectable, computed, inject, signal } from '@angular/core';
import { firstValueFrom } from 'rxjs';

import { CultureApi } from '../api/culture.api';
import type {
  ActivityLibraryItemDto,
  CatalogItemDto,
  EventDetailDto,
  EventListItemDto,
  LibraryDetailDto,
  LibraryListItemDto,
  LibraryLocationDto,
  PaginatedDto
} from '../api/culture.dto';

function cleanDto<T extends Record<string, unknown>>(obj: T): Partial<T> {
  const result: Record<string, unknown> = {};
  for (const [key, value] of Object.entries(obj)) {
    if (value !== null && value !== undefined && value !== '') {
      result[key] = value;
    }
  }
  return result as Partial<T>;
}

@Injectable({ providedIn: 'root' })
export class CultureStateService {
  private readonly api = inject(CultureApi);

  readonly libraries = signal<LibraryListItemDto[]>([]);
  readonly libraryDetail = signal<LibraryDetailDto | null>(null);
  readonly libraryPage = signal(1);
  readonly libraryTotal = signal(0);
  readonly libraryName = signal('');
  readonly libraryTypeId = signal('');
  readonly libraryCorregimientoId = signal('');
  readonly libraryStatus = signal<string | null>(null);
  readonly libraryZone = signal<string | null>(null);
  readonly libraryActivityId = signal('');
  readonly libraryServiceId = signal('');
  readonly libraryOpen = signal<boolean | null>(null);

  readonly events = signal<EventListItemDto[]>([]);
  readonly eventDetail = signal<EventDetailDto | null>(null);
  readonly eventPage = signal(1);
  readonly eventTotal = signal(0);
  readonly eventName = signal('');
  readonly eventTypeId = signal('');
  readonly eventLibraryId = signal('');

  readonly typeLibraries = signal<CatalogItemDto[]>([]);
  readonly typeEvents = signal<CatalogItemDto[]>([]);
  readonly categoryActivities = signal<CatalogItemDto[]>([]);
  readonly serviceLibraries = signal<CatalogItemDto[]>([]);
  readonly corregimientos = signal<CatalogItemDto[]>([]);
  readonly activityLibraries = signal<ActivityLibraryItemDto[]>([]);
  readonly locations = signal<LibraryLocationDto[]>([]);

  readonly loading = signal(false);

  private typeLibrariesLoaded = false;
  private typeEventsLoaded = false;
  private categoryActivitiesLoaded = false;
  private serviceLibrariesLoaded = false;
  private corregimientosLoaded = false;
  private activityLibrariesLoaded = false;

  readonly typeLibraryOptions = computed(() =>
    this.typeLibraries().map((t) => ({ label: t.name, value: t.id }))
  );
  readonly typeEventOptions = computed(() =>
    this.typeEvents().map((t) => ({ label: t.name, value: t.id }))
  );
  readonly categoryActivityOptions = computed(() =>
    this.categoryActivities().map((c) => ({ label: c.name, value: c.id }))
  );
  readonly serviceLibraryOptions = computed(() =>
    this.serviceLibraries().map((s) => ({ label: s.name, value: s.id }))
  );
  readonly corregimientoOptions = computed(() =>
    this.corregimientos().map((c) => ({ label: c.name, value: c.id }))
  );
  readonly activityLibraryOptions = computed(() =>
    this.activityLibraries().map((a) => ({ label: a.name, value: a.id }))
  );

  async loadLibraries(): Promise<void> {
    this.loading.set(true);
    try {
      const result = await firstValueFrom(this.api.listLibraries({
        page: this.libraryPage(),
        limit: 10,
        name: this.libraryName() || undefined,
        typeId: this.libraryTypeId() || undefined,
        corregimientoId: this.libraryCorregimientoId() || undefined,
        status: this.libraryStatus() || undefined,
        zone: this.libraryZone() || undefined,
        activityId: this.libraryActivityId() || undefined,
        serviceId: this.libraryServiceId() || undefined,
        open: this.libraryOpen() ?? undefined
      }));
      this.libraries.set(result.data);
      this.libraryTotal.set(result.pagination.total);
    } finally {
      this.loading.set(false);
    }
  }

  async loadLibrary(id: string): Promise<void> {
    this.loading.set(true);
    try {
      const result = await firstValueFrom(this.api.getLibrary(id));
      this.libraryDetail.set(result);
    } finally {
      this.loading.set(false);
    }
  }

  async loadEvents(): Promise<void> {
    this.loading.set(true);
    try {
      const result = await firstValueFrom(this.api.listEvents({
        page: this.eventPage(),
        limit: 10,
        name: this.eventName() || undefined,
        typeId: this.eventTypeId() || undefined,
        libraryId: this.eventLibraryId() || undefined
      }));
      this.events.set(result.data);
      this.eventTotal.set(result.pagination.total);
    } finally {
      this.loading.set(false);
    }
  }

  async loadEvent(id: string): Promise<void> {
    this.loading.set(true);
    try {
      const result = await firstValueFrom(this.api.getEvent(id));
      this.eventDetail.set(result);
    } finally {
      this.loading.set(false);
    }
  }

  async loadLocations(): Promise<void> {
    const result = await firstValueFrom(this.api.getLocations());
    this.locations.set(result);
  }

  async loadAllCatalogs(): Promise<void> {
    this.typeLibrariesLoaded = false;
    this.typeEventsLoaded = false;
    this.categoryActivitiesLoaded = false;
    this.serviceLibrariesLoaded = false;
    this.corregimientosLoaded = false;
    this.activityLibrariesLoaded = false;
    await Promise.all([
      this.loadTypeLibraries(),
      this.loadTypeEvents(),
      this.loadCategoryActivities(),
      this.loadServiceLibraries(),
      this.loadCorregimientos(),
      this.loadActivityLibraries()
    ]);
  }

  async loadTypeLibraries(): Promise<void> {
    if (this.typeLibrariesLoaded) return;
    const result = await firstValueFrom(this.api.listTypeLibraries({ limit: 100 }));
    this.typeLibraries.set(result.data);
    this.typeLibrariesLoaded = true;
  }

  async loadTypeEvents(): Promise<void> {
    if (this.typeEventsLoaded) return;
    const result = await firstValueFrom(this.api.listTypeEvents({ limit: 100 }));
    this.typeEvents.set(result.data);
    this.typeEventsLoaded = true;
  }

  async loadCategoryActivities(): Promise<void> {
    if (this.categoryActivitiesLoaded) return;
    const result = await firstValueFrom(this.api.listCategoryActivities({ limit: 100 }));
    this.categoryActivities.set(result.data);
    this.categoryActivitiesLoaded = true;
  }

  async loadServiceLibraries(): Promise<void> {
    if (this.serviceLibrariesLoaded) return;
    const result = await firstValueFrom(this.api.listServiceLibraries({ limit: 100 }));
    this.serviceLibraries.set(result.data);
    this.serviceLibrariesLoaded = true;
  }

  async loadCorregimientos(): Promise<void> {
    if (this.corregimientosLoaded) return;
    const result = await firstValueFrom(this.api.listCorregimientos({ limit: 100 }));
    this.corregimientos.set(result.data);
    this.corregimientosLoaded = true;
  }

  async loadActivityLibraries(): Promise<void> {
    if (this.activityLibrariesLoaded) return;
    const result = await firstValueFrom(this.api.listActivityLibraries({ limit: 100 }));
    this.activityLibraries.set(result.data);
    this.activityLibrariesLoaded = true;
  }

  async createLibrary(name: string, description: string): Promise<string> {
    const res = await firstValueFrom(this.api.createLibrary({ name, description }));
    await this.loadLibraries();
    return res.id;
  }

  async deleteLibrary(id: string): Promise<void> {
    await firstValueFrom(this.api.deleteLibrary(id));
    await this.loadLibraries();
  }

  async updateLibraryInfo(id: string, dto: { name?: string; description?: string; typeId?: string; email?: string; phone?: string }): Promise<void> {
    await firstValueFrom(this.api.updateInfo(id, cleanDto(dto)));
    await this.loadLibrary(id);
  }

  async updateLibraryDirection(id: string, dto: { description?: string; zone?: string; lon?: number; lat?: number; corregimientoId?: string }): Promise<void> {
    await firstValueFrom(this.api.updateDirection(id, cleanDto(dto)));
    await this.loadLibrary(id);
  }

  async updateLibrarySchedule(id: string, schedule: { day: number; startTimeHour: number; startTimeMin: number; endTimeHour: number; endTimeMin: number; closed: boolean }): Promise<void> {
    await firstValueFrom(this.api.updateSchedule(id, schedule));
    await this.loadLibrary(id);
  }

  async activateLibrary(id: string): Promise<void> {
    await firstValueFrom(this.api.activate(id));
    await this.loadLibrary(id);
  }

  async deactivateLibrary(id: string): Promise<void> {
    await firstValueFrom(this.api.deactivate(id));
    await this.loadLibrary(id);
  }

  async standoutLibrary(id: string): Promise<void> {
    await firstValueFrom(this.api.standout(id));
    await this.loadLibrary(id);
  }

  async addLibraryActivity(id: string, activityId: string): Promise<void> {
    await firstValueFrom(this.api.addActivity(id, activityId));
    await this.loadLibrary(id);
  }

  async removeLibraryActivity(id: string, activityId: string): Promise<void> {
    await firstValueFrom(this.api.removeActivity(id, activityId));
    await this.loadLibrary(id);
  }

  async addLibraryService(id: string, serviceId: string): Promise<void> {
    await firstValueFrom(this.api.addService(id, serviceId));
    await this.loadLibrary(id);
  }

  async removeLibraryService(id: string, serviceId: string): Promise<void> {
    await firstValueFrom(this.api.removeService(id, serviceId));
    await this.loadLibrary(id);
  }

  async addLibraryPicture(id: string, formData: FormData): Promise<void> {
    await firstValueFrom(this.api.addPicture(id, formData));
    await this.loadLibrary(id);
  }

  async removeLibraryPicture(id: string, key: string): Promise<void> {
    await firstValueFrom(this.api.removePicture(id, key));
    await this.loadLibrary(id);
  }

  async createEvent(dto: { name: string; typeId: string; libraryId: string; day: number; month: number; year: number; startTimeHour: number; startTimeMin: number; endTimeHour: number; endTimeMin: number; description: string }): Promise<string> {
    const res = await firstValueFrom(this.api.createEvent(dto));
    await this.loadEvents();
    return res.id;
  }

  async updateEvent(id: string, dto: { name?: string; typeId?: string; libraryId?: string; day?: number; month?: number; year?: number; startTimeHour?: number; startTimeMin?: number; endTimeHour?: number; endTimeMin?: number; description?: string }): Promise<void> {
    await firstValueFrom(this.api.updateEvent(id, cleanDto(dto)));
    await this.loadEvent(id);
  }

  async deleteEvent(id: string): Promise<void> {
    await firstValueFrom(this.api.deleteEvent(id));
    await this.loadEvents();
  }

  async changeEventPicture(id: string, formData: FormData): Promise<void> {
    await firstValueFrom(this.api.changePicture(id, formData));
    await this.loadEvent(id);
  }

  async createTypeLibrary(name: string): Promise<string> {
    const res = await firstValueFrom(this.api.createTypeLibrary({ name }));
    await this.loadTypeLibraries();
    return res.id;
  }

  async renameTypeLibrary(id: string, name: string): Promise<void> {
    await firstValueFrom(this.api.renameTypeLibrary(id, name));
    await this.loadTypeLibraries();
  }

  async deleteTypeLibrary(id: string): Promise<void> {
    await firstValueFrom(this.api.deleteTypeLibrary(id));
    await this.loadTypeLibraries();
  }

  async createTypeEvent(name: string): Promise<string> {
    const res = await firstValueFrom(this.api.createTypeEvent({ name }));
    await this.loadTypeEvents();
    return res.id;
  }

  async renameTypeEvent(id: string, name: string): Promise<void> {
    await firstValueFrom(this.api.renameTypeEvent(id, name));
    await this.loadTypeEvents();
  }

  async deleteTypeEvent(id: string): Promise<void> {
    await firstValueFrom(this.api.deleteTypeEvent(id));
    await this.loadTypeEvents();
  }

  async createCategoryActivity(name: string): Promise<string> {
    const res = await firstValueFrom(this.api.createCategoryActivity({ name }));
    await this.loadCategoryActivities();
    return res.id;
  }

  async renameCategoryActivity(id: string, name: string): Promise<void> {
    await firstValueFrom(this.api.renameCategoryActivity(id, name));
    await this.loadCategoryActivities();
  }

  async deleteCategoryActivity(id: string): Promise<void> {
    await firstValueFrom(this.api.deleteCategoryActivity(id));
    await this.loadCategoryActivities();
  }

  async createServiceLibrary(name: string): Promise<string> {
    const res = await firstValueFrom(this.api.createServiceLibrary({ name }));
    await this.loadServiceLibraries();
    return res.id;
  }

  async renameServiceLibrary(id: string, name: string): Promise<void> {
    await firstValueFrom(this.api.renameServiceLibrary(id, name));
    await this.loadServiceLibraries();
  }

  async deleteServiceLibrary(id: string): Promise<void> {
    await firstValueFrom(this.api.deleteServiceLibrary(id));
    await this.loadServiceLibraries();
  }

  async createCorregimiento(name: string): Promise<string> {
    const res = await firstValueFrom(this.api.createCorregimiento({ name }));
    await this.loadCorregimientos();
    return res.id;
  }

  async deleteCorregimiento(id: string): Promise<void> {
    await firstValueFrom(this.api.deleteCorregimiento(id));
    await this.loadCorregimientos();
  }

  async createActivityLibrary(name: string, description: string, categoryId: string): Promise<string> {
    const res = await firstValueFrom(this.api.createActivityLibrary({ name, description, categoryId }));
    await this.loadActivityLibraries();
    return res.id;
  }

  async deleteActivityLibrary(id: string): Promise<void> {
    await firstValueFrom(this.api.deleteActivityLibrary(id));
    await this.loadActivityLibraries();
  }

  async getTypeLibrariesPage(page: number, search: string): Promise<PaginatedDto<CatalogItemDto>> {
    return firstValueFrom(this.api.listTypeLibraries({ page, limit: 10, name: search || undefined }));
  }

  async getTypeEventsPage(page: number, search: string): Promise<PaginatedDto<CatalogItemDto>> {
    return firstValueFrom(this.api.listTypeEvents({ page, limit: 10, name: search || undefined }));
  }

  async getCategoryActivitiesPage(page: number, search: string): Promise<PaginatedDto<CatalogItemDto>> {
    return firstValueFrom(this.api.listCategoryActivities({ page, limit: 10, name: search || undefined }));
  }

  async getServiceLibrariesPage(page: number, search: string): Promise<PaginatedDto<CatalogItemDto>> {
    return firstValueFrom(this.api.listServiceLibraries({ page, limit: 10, name: search || undefined }));
  }

  async getCorregimientosPage(page: number, search: string): Promise<PaginatedDto<CatalogItemDto>> {
    return firstValueFrom(this.api.listCorregimientos({ page, limit: 10, name: search || undefined }));
  }

  async getActivityLibrariesPage(page: number, search: string): Promise<PaginatedDto<ActivityLibraryItemDto>> {
    return firstValueFrom(this.api.listActivityLibraries({ page, limit: 10, name: search || undefined }));
  }
}
