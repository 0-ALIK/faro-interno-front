import type { MockEndpoint } from '../../../../core/http/mock-api';
import type {
  ActivityLibraryItemDto,
  CatalogItemDto,
  EventDetailDto,
  EventListItemDto,
  LibraryDetailDto,
  LibraryListItemDto,
  LibraryLocationDto
} from '../culture.dto';

const typeLibraries: CatalogItemDto[] = [
  { id: 'tl-001', name: 'Pública' },
  { id: 'tl-002', name: 'Privada' },
  { id: 'tl-003', name: 'Comunitaria' },
  { id: 'tl-004', name: 'Digital' }
];

const typeEvents: CatalogItemDto[] = [
  { id: 'te-001', name: 'Cultural' },
  { id: 'te-002', name: 'Educativo' },
  { id: 'te-003', name: 'Recreativo' },
  { id: 'te-004', name: 'Social' }
];

const categoryActivities: CatalogItemDto[] = [
  { id: 'ca-001', name: 'Educación' },
  { id: 'ca-002', name: 'Cultura' },
  { id: 'ca-003', name: 'Deportes' },
  { id: 'ca-004', name: 'Salud' }
];

const serviceLibraries: CatalogItemDto[] = [
  { id: 'sl-001', name: 'Préstamo de libros' },
  { id: 'sl-002', name: 'Uso de computadora' },
  { id: 'sl-003', name: 'WiFi' },
  { id: 'sl-004', name: 'Impresión' },
  { id: 'sl-005', name: 'Salas de reuniones' }
];

const corregimientos: CatalogItemDto[] = [
  { id: 'cr-001', name: 'San Felipe' },
  { id: 'cr-002', name: 'Calidonia' },
  { id: 'cr-003', name: 'Santa Ana' },
  { id: 'cr-004', name: 'Bethel' },
  { id: 'cr-005', name: 'Curundú' }
];

const activityLibraries: ActivityLibraryItemDto[] = [
  { id: 'al-001', name: 'Club de lectura', description: 'Sesiones semanales de lectura y discusión literaria', categoryId: 'ca-002' },
  { id: 'al-002', name: 'Taller de programación', description: 'Introducción a la programación para jóvenes', categoryId: 'ca-001' },
  { id: 'al-003', name: 'Clase de arte', description: 'Técnicas de pintura y dibujo para todas las edades', categoryId: 'ca-002' },
  { id: 'al-004', name: 'Clases de música', description: 'Aprende a tocar guitarra y percusión', categoryId: 'ca-002' }
];

const libraryDetails: LibraryDetailDto[] = [
  {
    id: 'lib-001',
    name: 'Biblioteca Pública de San Felipe',
    type: { id: 'tl-001', name: 'Pública' },
    description: 'Biblioteca municipal ubicada en el corazón del casco antiguo de San Felipe. Ofrece acceso gratuito a libros, internet y actividades culturales para toda la comunidad.',
    email: 'sanfelipe@faro.gob.pa',
    phone: '+507 211-0001',
    status: 'ACTIVE',
    direction: {
      description: 'Avenida Central, frente a la Plaza de Francia',
      zone: 'CENTER',
      lat: 8.9511,
      lon: -79.5347,
      corregimiento: { id: 'cr-001', name: 'San Felipe' }
    },
    activities: [
      { id: 'al-001', name: 'Club de lectura' },
      { id: 'al-003', name: 'Clase de arte' }
    ],
    services: [
      { id: 'sl-001', name: 'Préstamo de libros' },
      { id: 'sl-002', name: 'Uso de computadora' },
      { id: 'sl-003', name: 'WiFi' }
    ],
    dailySchedules: [
      { day: 'Lunes', startTime: '08:00', endTime: '17:00', closed: false },
      { day: 'Martes', startTime: '08:00', endTime: '17:00', closed: false },
      { day: 'Miércoles', startTime: '08:00', endTime: '17:00', closed: false },
      { day: 'Jueves', startTime: '08:00', endTime: '17:00', closed: false },
      { day: 'Viernes', startTime: '08:00', endTime: '16:00', closed: false },
      { day: 'Sábado', startTime: '09:00', endTime: '13:00', closed: false },
      { day: 'Domingo', startTime: '00:00', endTime: '00:00', closed: true }
    ],
    pictures: [
      { key: 'libs/san-felipe-1.jpg', name: 'san-felipe-1.jpg', type: 'image/jpeg', url: 'https://picsum.photos/seed/sanfelipe1/800/600' },
      { key: 'libs/san-felipe-2.jpg', name: 'san-felipe-2.jpg', type: 'image/jpeg', url: 'https://picsum.photos/seed/sanfelipe2/800/600' }
    ],
    events: [
      { id: 'evt-001', name: 'Noche de poesía', schedule: { date: '2026-09-15', initTime: '19:00', endTime: '21:00' }, picture: null },
      { id: 'evt-003', name: 'Taller de artesanía', schedule: { date: '2026-09-20', initTime: '10:00', endTime: '13:00' }, picture: null }
    ]
  },
  {
    id: 'lib-002',
    name: 'Biblioteca Comunitaria de Calidonia',
    type: { id: 'tl-003', name: 'Comunitaria' },
    description: 'Espacio comunitario de lectura y aprendizaje en el barrio de Calidonia. Enfocada en programas de alfabetización digital para adultos.',
    email: 'calidonia@faro.gob.pa',
    phone: '+507 211-0002',
    status: 'ACTIVE',
    direction: {
      description: 'Calle 12, junto al mercado municipal',
      zone: 'CENTER',
      lat: 8.9630,
      lon: -79.5420,
      corregimiento: { id: 'cr-002', name: 'Calidonia' }
    },
    activities: [
      { id: 'al-002', name: 'Taller de programación' }
    ],
    services: [
      { id: 'sl-001', name: 'Préstamo de libros' },
      { id: 'sl-003', name: 'WiFi' },
      { id: 'sl-005', name: 'Salas de reuniones' }
    ],
    dailySchedules: [
      { day: 'Lunes', startTime: '09:00', endTime: '18:00', closed: false },
      { day: 'Martes', startTime: '09:00', endTime: '18:00', closed: false },
      { day: 'Miércoles', startTime: '09:00', endTime: '18:00', closed: false },
      { day: 'Jueves', startTime: '09:00', endTime: '18:00', closed: false },
      { day: 'Viernes', startTime: '09:00', endTime: '17:00', closed: false },
      { day: 'Sábado', startTime: '00:00', endTime: '00:00', closed: true },
      { day: 'Domingo', startTime: '00:00', endTime: '00:00', closed: true }
    ],
    pictures: [
      { key: 'libs/calidonia-1.jpg', name: 'calidonia-1.jpg', type: 'image/jpeg', url: 'https://picsum.photos/seed/calidonia1/800/600' }
    ],
    events: [
      { id: 'evt-002', name: 'Curso de computación básica', schedule: { date: '2026-09-18', initTime: '14:00', endTime: '16:00' }, picture: null }
    ]
  },
  {
    id: 'lib-003',
    name: 'Biblioteca Privada Bethel',
    type: { id: 'tl-002', name: 'Privada' },
    description: 'Biblioteca especializada en literatura infantil y juvenil. Cuenta con un amplio catálogo de cuentos y novelas para jóvenes lectores.',
    email: 'bethel@faro.gob.pa',
    phone: '+507 211-0003',
    status: 'STANDOUT',
    direction: {
      description: 'Vía principal, Edificio Cultural Bethel, piso 2',
      zone: 'EAST',
      lat: 8.9780,
      lon: -79.5200,
      corregimiento: { id: 'cr-004', name: 'Bethel' }
    },
    activities: [
      { id: 'al-001', name: 'Club de lectura' },
      { id: 'al-004', name: 'Clases de música' }
    ],
    services: [
      { id: 'sl-001', name: 'Préstamo de libros' },
      { id: 'sl-002', name: 'Uso de computadora' },
      { id: 'sl-003', name: 'WiFi' },
      { id: 'sl-004', name: 'Impresión' },
      { id: 'sl-005', name: 'Salas de reuniones' }
    ],
    dailySchedules: [
      { day: 'Lunes', startTime: '07:30', endTime: '19:00', closed: false },
      { day: 'Martes', startTime: '07:30', endTime: '19:00', closed: false },
      { day: 'Miércoles', startTime: '07:30', endTime: '19:00', closed: false },
      { day: 'Jueves', startTime: '07:30', endTime: '19:00', closed: false },
      { day: 'Viernes', startTime: '07:30', endTime: '18:00', closed: false },
      { day: 'Sábado', startTime: '08:00', endTime: '14:00', closed: false },
      { day: 'Domingo', startTime: '10:00', endTime: '14:00', closed: false }
    ],
    pictures: [
      { key: 'libs/bethel-1.jpg', name: 'bethel-1.jpg', type: 'image/jpeg', url: 'https://picsum.photos/seed/bethel1/800/600' },
      { key: 'libs/bethel-2.jpg', name: 'bethel-2.jpg', type: 'image/jpeg', url: 'https://picsum.photos/seed/bethel2/800/600' },
      { key: 'libs/bethel-3.jpg', name: 'bethel-3.jpg', type: 'image/jpeg', url: 'https://picsum.photos/seed/bethel3/800/600' }
    ],
    events: [
      { id: 'evt-004', name: 'Festival de narración oral', schedule: { date: '2026-10-01', initTime: '16:00', endTime: '20:00' }, picture: null }
    ]
  },
  {
    id: 'lib-004',
    name: 'Biblioteca Digital Curundú',
    type: { id: 'tl-004', name: 'Digital' },
    description: 'Centro de acceso digital con recursos en línea, cursos virtuales y talleres de tecnología para el desarrollo de habilidades digitales.',
    email: 'curundu@faro.gob.pa',
    phone: '+507 211-0004',
    status: 'ACTIVE',
    direction: {
      description: 'Avenida del Perú, módulo 3 del corregimiento',
      zone: 'WEST',
      lat: 8.9690,
      lon: -79.5550,
      corregimiento: { id: 'cr-005', name: 'Curundú' }
    },
    activities: [
      { id: 'al-002', name: 'Taller de programación' }
    ],
    services: [
      { id: 'sl-002', name: 'Uso de computadora' },
      { id: 'sl-003', name: 'WiFi' },
      { id: 'sl-004', name: 'Impresión' }
    ],
    dailySchedules: [
      { day: 'Lunes', startTime: '08:00', endTime: '20:00', closed: false },
      { day: 'Martes', startTime: '08:00', endTime: '20:00', closed: false },
      { day: 'Miércoles', startTime: '08:00', endTime: '20:00', closed: false },
      { day: 'Jueves', startTime: '08:00', endTime: '20:00', closed: false },
      { day: 'Viernes', startTime: '08:00', endTime: '18:00', closed: false },
      { day: 'Sábado', startTime: '10:00', endTime: '16:00', closed: false },
      { day: 'Domingo', startTime: '00:00', endTime: '00:00', closed: true }
    ],
    pictures: [
      { key: 'libs/curundu-1.jpg', name: 'curundu-1.jpg', type: 'image/jpeg', url: 'https://picsum.photos/seed/curundu1/800/600' }
    ],
    events: []
  },
  {
    id: 'lib-005',
    name: 'Biblioteca Municipal de Santa Ana',
    type: { id: 'tl-001', name: 'Pública' },
    description: 'Biblioteca histórica del corregimiento de Santa Ana. Cuenta con una colección de libros panameños y espacios de estudio silencioso.',
    email: 'santaana@faro.gob.pa',
    phone: '+507 211-0005',
    status: 'INACTIVE',
    direction: {
      description: 'Calle 1 Oeste, frente a la iglesia de Santa Ana',
      zone: 'NORTH',
      lat: 8.9750,
      lon: -79.5480,
      corregimiento: { id: 'cr-003', name: 'Santa Ana' }
    },
    activities: [],
    services: [
      { id: 'sl-001', name: 'Préstamo de libros' },
      { id: 'sl-003', name: 'WiFi' }
    ],
    dailySchedules: [
      { day: 'Lunes', startTime: '09:00', endTime: '17:00', closed: false },
      { day: 'Martes', startTime: '09:00', endTime: '17:00', closed: false },
      { day: 'Miércoles', startTime: '09:00', endTime: '17:00', closed: false },
      { day: 'Jueves', startTime: '09:00', endTime: '17:00', closed: false },
      { day: 'Viernes', startTime: '09:00', endTime: '16:00', closed: false },
      { day: 'Sábado', startTime: '00:00', endTime: '00:00', closed: true },
      { day: 'Domingo', startTime: '00:00', endTime: '00:00', closed: true }
    ],
    pictures: [],
    events: []
  }
];

function toLibraryListItem(lib: LibraryDetailDto): LibraryListItemDto {
  return {
    id: lib.id,
    name: lib.name,
    type: lib.type,
    direction: {
      lat: lib.direction.lat,
      lon: lib.direction.lon,
      corregimiento: lib.direction.corregimiento
    },
    status: lib.status,
    isOpen: lib.dailySchedules.some((s) => !s.closed)
  };
}

const libraryListItems = libraryDetails.map(toLibraryListItem);

function findLibrary(id: string): LibraryDetailDto | undefined {
  return libraryDetails.find((lib) => lib.id === id);
}

const eventDetails: EventDetailDto[] = [
  {
    id: 'evt-001',
    name: 'Noche de poesía',
    type: { id: 'te-001', name: 'Cultural' },
    library: { id: 'lib-001', name: 'Biblioteca Pública de San Felipe' },
    schedule: { date: '2026-09-15', initTime: '19:00', endTime: '21:00' },
    description: 'Velada de poesía con autores locales y abierta al micrófono para la comunidad.',
    picture: null
  },
  {
    id: 'evt-002',
    name: 'Curso de computación básica',
    type: { id: 'te-002', name: 'Educativo' },
    library: { id: 'lib-002', name: 'Biblioteca Comunitaria de Calidonia' },
    schedule: { date: '2026-09-18', initTime: '14:00', endTime: '16:00' },
    description: 'Curso introductorio de uso de computadora e internet para adultos mayores.',
    picture: null
  },
  {
    id: 'evt-003',
    name: 'Taller de artesanía',
    type: { id: 'te-003', name: 'Recreativo' },
    library: { id: 'lib-001', name: 'Biblioteca Pública de San Felipe' },
    schedule: { date: '2026-09-20', initTime: '10:00', endTime: '13:00' },
    description: 'Taller práctico de elaboración de artesanías con materiales reciclados.',
    picture: null
  },
  {
    id: 'evt-004',
    name: 'Festival de narración oral',
    type: { id: 'te-004', name: 'Social' },
    library: { id: 'lib-003', name: 'Biblioteca Privada Bethel' },
    schedule: { date: '2026-10-01', initTime: '16:00', endTime: '20:00' },
    description: 'Festival de narradores orales con historias tradicionales panameñas.',
    picture: null
  }
];

const eventListItems: EventListItemDto[] = eventDetails.map((evt) => ({
  id: evt.id,
  name: evt.name,
  picture: evt.picture,
  type: evt.type,
  library: evt.library,
  schedule: { date: evt.schedule.date, initTime: evt.schedule.initTime }
}));

function findEvent(id: string): EventDetailDto | undefined {
  return eventDetails.find((evt) => evt.id === id);
}

const libraryLocations: LibraryLocationDto[] = libraryDetails.map((lib) => ({
  id: lib.id,
  name: lib.name,
  description: lib.description,
  lat: lib.direction.lat,
  lon: lib.direction.lon,
  zone: lib.direction.zone,
  corregimiento: lib.direction.corregimiento.name
}));

export const cultureMockEndpoints: MockEndpoint[] = [
  { method: 'GET', path: '/culture/libraries', body: () => ({ data: libraryListItems, pagination: { total: libraryListItems.length } }) },
  { method: 'GET', path: '/culture/libraries/:id', body: (params: Record<string, string>) => findLibrary(params['id']) },
  { method: 'POST', path: '/culture/libraries', status: 201, body: () => ({ id: 'lib-new' }) },
  { method: 'DELETE', path: '/culture/libraries/:id', body: () => ({ success: true }) },
  { method: 'PATCH', path: '/culture/libraries/:id/info', body: (params: Record<string, string>) => ({ id: params['id'] }) },
  { method: 'PATCH', path: '/culture/libraries/:id/direction', body: (params: Record<string, string>) => ({ id: params['id'] }) },
  { method: 'PATCH', path: '/culture/libraries/:id/schedule', body: (params: Record<string, string>) => ({ id: params['id'] }) },
  { method: 'POST', path: '/culture/libraries/:id/activate', body: (params: Record<string, string>) => ({ id: params['id'] }) },
  { method: 'POST', path: '/culture/libraries/:id/deactivate', body: (params: Record<string, string>) => ({ id: params['id'] }) },
  { method: 'POST', path: '/culture/libraries/:id/standout', body: (params: Record<string, string>) => ({ id: params['id'] }) },
  { method: 'POST', path: '/culture/libraries/:id/activities', body: (params: Record<string, string>) => ({ id: params['id'] }) },
  { method: 'DELETE', path: '/culture/libraries/:id/activities/:activityId', body: (params: Record<string, string>) => ({ id: params['id'] }) },
  { method: 'POST', path: '/culture/libraries/:id/services', body: (params: Record<string, string>) => ({ id: params['id'] }) },
  { method: 'DELETE', path: '/culture/libraries/:id/services/:serviceId', body: (params: Record<string, string>) => ({ id: params['id'] }) },
  { method: 'POST', path: '/culture/libraries/:id/pictures', body: (params: Record<string, string>) => ({ id: params['id'] }) },
  { method: 'DELETE', path: '/culture/libraries/:id/pictures/:key', body: (params: Record<string, string>) => ({ id: params['id'] }) },
  { method: 'GET', path: '/culture/libraries/locations', body: () => libraryLocations },

  { method: 'GET', path: '/culture/events', body: () => ({ data: eventListItems, pagination: { total: eventListItems.length } }) },
  { method: 'GET', path: '/culture/events/:id', body: (params: Record<string, string>) => findEvent(params['id']) },
  { method: 'POST', path: '/culture/events', status: 201, body: () => ({ id: 'evt-new' }) },
  { method: 'PATCH', path: '/culture/events/:id', body: (params: Record<string, string>) => ({ id: params['id'] }) },
  { method: 'DELETE', path: '/culture/events/:id', body: () => ({ success: true }) },
  { method: 'PATCH', path: '/culture/events/:id/picture', body: (params: Record<string, string>) => ({ id: params['id'] }) },

  { method: 'GET', path: '/culture/type-libraries', body: () => ({ data: typeLibraries, pagination: { total: typeLibraries.length } }) },
  { method: 'GET', path: '/culture/type-libraries/:id', body: (params: Record<string, string>) => typeLibraries.find((t) => t.id === params['id']) },
  { method: 'POST', path: '/culture/type-libraries', status: 201, body: () => ({ id: 'tl-new' }) },
  { method: 'PATCH', path: '/culture/type-libraries/:id', body: (params: Record<string, string>) => ({ id: params['id'] }) },
  { method: 'DELETE', path: '/culture/type-libraries/:id', body: () => ({ success: true }) },

  { method: 'GET', path: '/culture/type-events', body: () => ({ data: typeEvents, pagination: { total: typeEvents.length } }) },
  { method: 'GET', path: '/culture/type-events/:id', body: (params: Record<string, string>) => typeEvents.find((t) => t.id === params['id']) },
  { method: 'POST', path: '/culture/type-events', status: 201, body: () => ({ id: 'te-new' }) },
  { method: 'PATCH', path: '/culture/type-events/:id', body: (params: Record<string, string>) => ({ id: params['id'] }) },
  { method: 'DELETE', path: '/culture/type-events/:id', body: () => ({ success: true }) },

  { method: 'GET', path: '/culture/category-activities', body: () => ({ data: categoryActivities, pagination: { total: categoryActivities.length } }) },
  { method: 'GET', path: '/culture/category-activities/:id', body: (params: Record<string, string>) => categoryActivities.find((c) => c.id === params['id']) },
  { method: 'POST', path: '/culture/category-activities', status: 201, body: () => ({ id: 'ca-new' }) },
  { method: 'PATCH', path: '/culture/category-activities/:id', body: (params: Record<string, string>) => ({ id: params['id'] }) },
  { method: 'DELETE', path: '/culture/category-activities/:id', body: () => ({ success: true }) },

  { method: 'GET', path: '/culture/service-libraries', body: () => ({ data: serviceLibraries, pagination: { total: serviceLibraries.length } }) },
  { method: 'GET', path: '/culture/service-libraries/:id', body: (params: Record<string, string>) => serviceLibraries.find((s) => s.id === params['id']) },
  { method: 'POST', path: '/culture/service-libraries', status: 201, body: () => ({ id: 'sl-new' }) },
  { method: 'PATCH', path: '/culture/service-libraries/:id', body: (params: Record<string, string>) => ({ id: params['id'] }) },
  { method: 'DELETE', path: '/culture/service-libraries/:id', body: () => ({ success: true }) },

  { method: 'GET', path: '/culture/corregimientos', body: () => ({ data: corregimientos, pagination: { total: corregimientos.length } }) },
  { method: 'GET', path: '/culture/corregimientos/:id', body: (params: Record<string, string>) => corregimientos.find((c) => c.id === params['id']) },
  { method: 'POST', path: '/culture/corregimientos', status: 201, body: () => ({ id: 'cr-new' }) },
  { method: 'DELETE', path: '/culture/corregimientos/:id', body: () => ({ success: true }) },

  { method: 'GET', path: '/culture/activity-libraries', body: () => ({ data: activityLibraries, pagination: { total: activityLibraries.length } }) },
  { method: 'GET', path: '/culture/activity-libraries/:id', body: (params: Record<string, string>) => activityLibraries.find((a) => a.id === params['id']) },
  { method: 'POST', path: '/culture/activity-libraries', status: 201, body: () => ({ id: 'al-new' }) },
  { method: 'DELETE', path: '/culture/activity-libraries/:id', body: () => ({ success: true }) }
];
