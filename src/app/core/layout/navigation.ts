export interface NavLink {
  label: string;
  icon: string;
  routerLink?: string;
  disabled?: boolean;
}

export interface NavSection {
  label: string;
  items: NavLink[];
}

export const NAV_SECTIONS: NavSection[] = [
  {
    label: 'Catálogo',
    items: [
      { label: 'Cursos', icon: 'pi pi-book', routerLink: '/catalog/courses' },
      { label: 'Categorías', icon: 'pi pi-tags', routerLink: '/catalog/categories' },
      { label: 'Proveedores', icon: 'pi pi-building', routerLink: '/catalog/providers' },
      { label: 'Competencias', icon: 'pi pi-star', routerLink: '/catalog/competencies' },
      { label: 'Etiquetas', icon: 'pi pi-tag', routerLink: '/catalog/tags' }
    ]
  },
  {
    label: 'Formación',
    items: [
      { label: 'Cursos municipales', icon: 'pi pi-graduation-cap', routerLink: '/formation/courses' }
    ]
  },
  {
    label: 'Módulos',
    items: [
      { label: 'Becas', icon: 'pi pi-heart', disabled: true },
      { label: 'Aprendizaje', icon: 'pi pi-users', disabled: true },
      { label: 'Cultura', icon: 'pi pi-sun', disabled: true }
    ]
  }
];