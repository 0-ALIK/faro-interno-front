import { Injectable, computed, inject, signal } from '@angular/core';
import { firstValueFrom } from 'rxjs';

import { CatalogApi } from '../api/catalog.api';
import type { ProviderTypeDto } from '../api/catalog.dto';
import type { Category, Competency, NamedRef, Provider, ProviderType, Tag } from '../models/catalog.model';

const PROVIDER_TYPE_TO_DTO: Record<ProviderType, ProviderTypeDto> = {
  GOVERNMENT: 'gobierno',
  EDUCATIONAL_INSTITUTION: 'institucion educativa',
  NGO: 'ong',
  PRIVATE_COMPANY: 'empresa privada',
  DIGITAL_PLATFORM: 'plataforma digital'
};

const PROVIDER_TYPE_FROM_DTO: Record<ProviderTypeDto, ProviderType> = {
  gobierno: 'GOVERNMENT',
  'institucion educativa': 'EDUCATIONAL_INSTITUTION',
  ong: 'NGO',
  'empresa privada': 'PRIVATE_COMPANY',
  'plataforma digital': 'DIGITAL_PLATFORM'
};

@Injectable({ providedIn: 'root' })
export class CatalogStateService {
  private readonly api = inject(CatalogApi);

  readonly categories = signal<Category[]>([]);
  readonly providers = signal<Provider[]>([]);
  readonly competencies = signal<Competency[]>([]);
  readonly tags = signal<Tag[]>([]);

  readonly loading = signal(false);

  private categoriesLoaded = false;
  private providersLoaded = false;
  private competenciesLoaded = false;
  private tagsLoaded = false;

  readonly categoryPage = signal(1);
  readonly categoryTotal = signal(0);
  readonly categorySearch = signal('');

  readonly providerPage = signal(1);
  readonly providerTotal = signal(0);
  readonly providerSearch = signal('');

  readonly competencyPage = signal(1);
  readonly competencyTotal = signal(0);
  readonly competencySearch = signal('');

  readonly tagPage = signal(1);
  readonly tagTotal = signal(0);
  readonly tagSearch = signal('');

  readonly categoryOptions = computed(() =>
    this.categories().map((c) => ({ label: c.name, value: c.id }))
  );
  readonly providerOptions = computed(() =>
    this.providers().map((p) => ({ label: `${p.name} (${p.type})`, value: p.id }))
  );
  readonly competencyOptions = computed(() =>
    this.competencies().map((c) => ({ label: c.name, value: c.id }))
  );
  readonly tagOptions = computed(() =>
    this.tags().map((t) => ({ label: t.name, value: t.id }))
  );

  async loadAll(): Promise<void> {
    this.categoriesLoaded = false;
    this.providersLoaded = false;
    this.competenciesLoaded = false;
    this.tagsLoaded = false;
    await Promise.all([
      this.loadCategories(),
      this.loadProviders(),
      this.loadCompetencies(),
      this.loadTags()
    ]);
  }

  async loadCategories(): Promise<void> {
    if (this.categoriesLoaded) return;
    this.loading.set(true);
    try {
      const result = await firstValueFrom(this.api.listCategories({
        page: this.categoryPage(),
        limit: 10,
        search: this.categorySearch() || undefined
      }));
      this.categories.set(result.data.map((d) => ({ id: d.id, name: d.name })));
      this.categoryTotal.set(result.pagination.total);
      this.categoriesLoaded = true;
    } finally {
      this.loading.set(false);
    }
  }

  async loadProviders(): Promise<void> {
    if (this.providersLoaded) return;
    this.loading.set(true);
    try {
      const result = await firstValueFrom(this.api.listProviders({
        page: this.providerPage(),
        limit: 10,
        search: this.providerSearch() || undefined
      }));
      this.providers.set(result.data.map((d) => ({ id: d.id, name: d.name, type: PROVIDER_TYPE_FROM_DTO[d.type] })));
      this.providerTotal.set(result.pagination.total);
      this.providersLoaded = true;
    } finally {
      this.loading.set(false);
    }
  }

  async loadCompetencies(): Promise<void> {
    if (this.competenciesLoaded) return;
    this.loading.set(true);
    try {
      const result = await firstValueFrom(this.api.listCompetencies({
        page: this.competencyPage(),
        limit: 10,
        search: this.competencySearch() || undefined
      }));
      this.competencies.set(result.data.map((d) => ({ id: d.id, name: d.name })));
      this.competencyTotal.set(result.pagination.total);
      this.competenciesLoaded = true;
    } finally {
      this.loading.set(false);
    }
  }

  async loadTags(): Promise<void> {
    if (this.tagsLoaded) return;
    this.loading.set(true);
    try {
      const result = await firstValueFrom(this.api.listTags({
        page: this.tagPage(),
        limit: 10,
        search: this.tagSearch() || undefined
      }));
      this.tags.set(result.data.map((d) => ({ id: d.id, name: d.name })));
      this.tagTotal.set(result.pagination.total);
      this.tagsLoaded = true;
    } finally {
      this.loading.set(false);
    }
  }

  async createCategory(name: string): Promise<string> {
    const res = await firstValueFrom(this.api.createCategory(name));
    if (this.categories().length < 10) {
      this.categories.update((list) => [...list, { id: res.id, name }]);
      this.categoryTotal.update((t) => t + 1);
    } else {
      this.categoryTotal.update((t) => t + 1);
    }
    return res.id;
  }

  async renameCategory(id: string, name: string): Promise<void> {
    await firstValueFrom(this.api.renameCategory(id, name));
    this.categories.update((list) => list.map((c) => (c.id === id ? { ...c, name } : c)));
  }

  async createProvider(name: string, type: Provider['type']): Promise<string> {
    const res = await firstValueFrom(this.api.createProvider(name, type));
    if (this.providers().length < 10) {
      this.providers.update((list) => [...list, { id: res.id, name, type }]);
      this.providerTotal.update((t) => t + 1);
    } else {
      this.providerTotal.update((t) => t + 1);
    }
    return res.id;
  }

  async renameProvider(id: string, name: string): Promise<void> {
    await firstValueFrom(this.api.renameProvider(id, name));
    this.providers.update((list) => list.map((p) => (p.id === id ? { ...p, name } : p)));
  }

  async changeProviderType(id: string, type: Provider['type']): Promise<void> {
    await firstValueFrom(this.api.changeProviderType(id, type));
    this.providers.update((list) => list.map((p) => (p.id === id ? { ...p, type } : p)));
  }

  async createCompetency(name: string): Promise<string> {
    const res = await firstValueFrom(this.api.createCompetency(name));
    if (this.competencies().length < 10) {
      this.competencies.update((list) => [...list, { id: res.id, name }]);
      this.competencyTotal.update((t) => t + 1);
    } else {
      this.competencyTotal.update((t) => t + 1);
    }
    return res.id;
  }

  async renameCompetency(id: string, name: string): Promise<void> {
    await firstValueFrom(this.api.renameCompetency(id, name));
    this.competencies.update((list) => list.map((c) => (c.id === id ? { ...c, name } : c)));
  }

  async createTag(name: string): Promise<string> {
    const res = await firstValueFrom(this.api.createTag(name));
    if (this.tags().length < 10) {
      this.tags.update((list) => [...list, { id: res.id, name }]);
      this.tagTotal.update((t) => t + 1);
    } else {
      this.tagTotal.update((t) => t + 1);
    }
    return res.id;
  }

  async renameTag(id: string, name: string): Promise<void> {
    await firstValueFrom(this.api.renameTag(id, name));
    this.tags.update((list) => list.map((t) => (t.id === id ? { ...t, name } : t)));
  }
}
