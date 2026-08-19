import { Injectable, computed, inject, signal } from '@angular/core';
import { firstValueFrom } from 'rxjs';

import { CatalogApi } from '../api/catalog.api';
import type { Category, Competency, NamedRef, Provider, Tag } from '../models/catalog.model';

@Injectable({ providedIn: 'root' })
export class CatalogStateService {
  private readonly api = inject(CatalogApi);

  readonly categories = signal<Category[]>([]);
  readonly providers = signal<Provider[]>([]);
  readonly competencies = signal<Competency[]>([]);
  readonly tags = signal<Tag[]>([]);

  readonly loading = signal(false);

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
    this.loading.set(true);
    try {
      const [catPage, prvPage, cmpPage, tagPage] = await Promise.all([
        firstValueFrom(this.api.listCategories({ limit: 100 })),
        firstValueFrom(this.api.listProviders({ limit: 100 })),
        firstValueFrom(this.api.listCompetencies({ limit: 100 })),
        firstValueFrom(this.api.listTags({ limit: 100 }))
      ]);
      this.categories.set(catPage.data.map((d) => ({ id: d.id, name: d.name })));
      this.providers.set(prvPage.data.map((d) => ({ id: d.id, name: d.name, type: d.type })));
      this.competencies.set(cmpPage.data.map((d) => ({ id: d.id, name: d.name })));
      this.tags.set(tagPage.data.map((d) => ({ id: d.id, name: d.name })));
    } finally {
      this.loading.set(false);
    }
  }

  async createCategory(name: string): Promise<string> {
    const res = await firstValueFrom(this.api.createCategory(name));
    this.categories.update((list) => [...list, { id: res.id, name }]);
    return res.id;
  }

  async renameCategory(id: string, name: string): Promise<void> {
    await firstValueFrom(this.api.renameCategory(id, name));
    this.categories.update((list) => list.map((c) => (c.id === id ? { ...c, name } : c)));
  }

  async createProvider(name: string, type: Provider['type']): Promise<string> {
    const res = await firstValueFrom(this.api.createProvider(name, type));
    this.providers.update((list) => [...list, { id: res.id, name, type }]);
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
    this.competencies.update((list) => [...list, { id: res.id, name }]);
    return res.id;
  }

  async renameCompetency(id: string, name: string): Promise<void> {
    await firstValueFrom(this.api.renameCompetency(id, name));
    this.competencies.update((list) => list.map((c) => (c.id === id ? { ...c, name } : c)));
  }

  async createTag(name: string): Promise<string> {
    const res = await firstValueFrom(this.api.createTag(name));
    this.tags.update((list) => [...list, { id: res.id, name }]);
    return res.id;
  }

  async renameTag(id: string, name: string): Promise<void> {
    await firstValueFrom(this.api.renameTag(id, name));
    this.tags.update((list) => list.map((t) => (t.id === id ? { ...t, name } : t)));
  }
}