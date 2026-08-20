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
    label: 'Cultura',
    items: [
      { label: 'Bibliotecas', icon: 'pi pi-building', routerLink: '/culture/bibliotecas' },
      { label: 'Eventos', icon: 'pi pi-calendar', routerLink: '/culture/eventos' },
      { label: 'Mapa', icon: 'pi pi-map-marker', routerLink: '/culture/mapa' },
      { label: 'Tipo bibliotecas', icon: 'pi pi-list', routerLink: '/culture/tipo-bibliotecas' },
      { label: 'Tipo eventos', icon: 'pi pi-list', routerLink: '/culture/tipo-eventos' },
      { label: 'Cat. actividades', icon: 'pi pi-list', routerLink: '/culture/categorias-actividades' },
      { label: 'Servicios', icon: 'pi pi-wrench', routerLink: '/culture/servicios' },
      { label: 'Corregimientos', icon: 'pi pi-map', routerLink: '/culture/corregimientos' },
      { label: 'Actividades', icon: 'pi pi-check-square', routerLink: '/culture/actividades' }
    ]
  },
  {
    label: 'Módulos',
    items: [
      { label: 'Becas', icon: 'pi pi-heart', disabled: true },
      { label: 'Aprendizaje', icon: 'pi pi-users', disabled: true }
    ]
  }
];