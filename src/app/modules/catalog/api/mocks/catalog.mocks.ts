import type { MockEndpoint } from '../../../../core/http/mock-api';
import type {
  CategoryDetailDto,
  CompetencyDetailDto,
  CourseDetailDto,
  CourseListItemDto,
  ProviderDetailDto,
  TagDetailDto
} from '../catalog.dto';

const categoryDetails: CategoryDetailDto[] = [
  { id: 'cat-001', name: 'Tecnología', createdAt: '2025-01-10T08:00:00Z', updatedAt: '2025-01-10T08:00:00Z' },
  { id: 'cat-002', name: 'Emprendimiento', createdAt: '2025-01-12T09:30:00Z', updatedAt: '2025-02-01T10:00:00Z' },
  { id: 'cat-003', name: 'Artes y Oficios', createdAt: '2025-02-03T11:15:00Z', updatedAt: '2025-02-03T11:15:00Z' },
  { id: 'cat-004', name: 'Salud y Bienestar', createdAt: '2025-02-20T14:45:00Z', updatedAt: '2025-03-05T08:20:00Z' }
];

const providerDetails: ProviderDetailDto[] = [
  { id: 'prv-001', name: 'Municipio de Panamá', type: 'GOVERNMENT', createdAt: '2025-01-05T08:00:00Z', updatedAt: '2025-01-05T08:00:00Z' },
  { id: 'prv-002', name: 'Universidad de Panamá', type: 'EDUCATIONAL_INSTITUTION', createdAt: '2025-01-06T09:00:00Z', updatedAt: '2025-01-06T09:00:00Z' },
  { id: 'prv-003', name: 'Fundación Semilla', type: 'NGO', createdAt: '2025-01-07T10:00:00Z', updatedAt: '2025-01-07T10:00:00Z' },
  { id: 'prv-004', name: 'Academia Digital Faro', type: 'PRIVATE_COMPANY', createdAt: '2025-01-08T11:00:00Z', updatedAt: '2025-01-08T11:00:00Z' },
  { id: 'prv-005', name: 'Plataforma AprendePanamá', type: 'DIGITAL_PLATFORM', createdAt: '2025-01-09T12:00:00Z', updatedAt: '2025-01-09T12:00:00Z' }
];

const competencyDetails: CompetencyDetailDto[] = [
  { id: 'cmp-001', name: 'Pensamiento computacional', createdAt: '2025-01-10T08:00:00Z', updatedAt: '2025-01-10T08:00:00Z' },
  { id: 'cmp-002', name: 'Comunicación efectiva', createdAt: '2025-01-10T08:05:00Z', updatedAt: '2025-01-10T08:05:00Z' },
  { id: 'cmp-003', name: 'Gestión financiera', createdAt: '2025-01-10T08:10:00Z', updatedAt: '2025-01-10T08:10:00Z' },
  { id: 'cmp-004', name: 'Trabajo en equipo', createdAt: '2025-01-10T08:15:00Z', updatedAt: '2025-01-10T08:15:00Z' },
  { id: 'cmp-005', name: 'Liderazgo', createdAt: '2025-01-10T08:20:00Z', updatedAt: '2025-01-10T08:20:00Z' }
];

const tagDetails: TagDetailDto[] = [
  { id: 'tag-001', name: 'Gratuito', createdAt: '2025-01-10T08:00:00Z', updatedAt: '2025-01-10T08:00:00Z' },
  { id: 'tag-002', name: 'Virtual', createdAt: '2025-01-10T08:00:00Z', updatedAt: '2025-01-10T08:00:00Z' },
  { id: 'tag-003', name: 'Empleo', createdAt: '2025-01-10T08:00:00Z', updatedAt: '2025-01-10T08:00:00Z' },
  { id: 'tag-004', name: 'Certificación', createdAt: '2025-01-10T08:00:00Z', updatedAt: '2025-01-10T08:00:00Z' },
  { id: 'tag-005', name: 'Jóvenes', createdAt: '2025-01-10T08:00:00Z', updatedAt: '2025-01-10T08:00:00Z' },
  { id: 'tag-006', name: 'Corta duración', createdAt: '2025-01-10T08:00:00Z', updatedAt: '2025-01-10T08:00:00Z' }
];

const courseDetails: CourseDetailDto[] = [
  {
    id: 'crs-001',
    title: 'Ofimática para el empleo',
    description: 'Herramientas de oficina aplicadas a la búsqueda y desempeño laboral.',
    modality: 'VIRTUAL',
    level: 'BASIC',
    origin: 'MUNICIPAL',
    status: 'PUBLISHED',
    enrollmentMode: 'OPEN',
    durationHours: 40,
    cover: { key: 'covers/ofimatica-empleo.jpg', name: 'ofimatica-empleo.jpg', type: 'image/jpeg' },
    publishedAt: '2026-01-15T12:00:00Z',
    category: { id: 'cat-001', name: 'Tecnología' },
    provider: { id: 'prv-001', name: 'Municipio de Panamá', type: 'GOVERNMENT' },
    competencies: [
      { id: 'cmp-001', name: 'Pensamiento computacional' },
      { id: 'cmp-002', name: 'Comunicación efectiva' }
    ],
    tags: [
      { id: 'tag-001', name: 'Gratuito' },
      { id: 'tag-002', name: 'Virtual' },
      { id: 'tag-003', name: 'Empleo' }
    ],
    createdBy: 'usr-001',
    stateHistory: [
      {
        id: 'sth-0011',
        official: { id: 'usr-001', name: 'Ana', lastName: 'López', photo: null },
        from: 'DRAFT',
        to: 'UNDER_REVIEW',
        date: '2026-01-10',
        time: '09:15 AM'
      },
      {
        id: 'sth-0012',
        official: { id: 'usr-002', name: 'Luis', lastName: 'González', photo: null },
        from: 'UNDER_REVIEW',
        to: 'PUBLISHED',
        date: '2026-01-15',
        time: '12:00 PM'
      }
    ],
    createdAt: '2026-01-08T08:00:00Z',
    updatedAt: '2026-01-15T12:00:00Z'
  },
  {
    id: 'crs-002',
    title: 'Emprendimiento digital',
    description: 'Convierte una idea de negocio en un plan digital accionable.',
    modality: 'VIRTUAL',
    level: 'INTERMEDIATE',
    origin: 'MUNICIPAL',
    status: 'PUBLISHED',
    enrollmentMode: 'SCHOLARSHIP_ONLY',
    durationHours: 60,
    cover: null,
    publishedAt: '2026-02-02T10:00:00Z',
    category: { id: 'cat-002', name: 'Emprendimiento' },
    provider: { id: 'prv-001', name: 'Municipio de Panamá', type: 'GOVERNMENT' },
    competencies: [{ id: 'cmp-003', name: 'Gestión financiera' }],
    tags: [
      { id: 'tag-004', name: 'Certificación' },
      { id: 'tag-005', name: 'Jóvenes' }
    ],
    createdBy: 'usr-001',
    stateHistory: [
      {
        id: 'sth-0021',
        official: { id: 'usr-002', name: 'Luis', lastName: 'González', photo: null },
        from: 'DRAFT',
        to: 'UNDER_REVIEW',
        date: '2026-01-28',
        time: '08:40 AM'
      },
      {
        id: 'sth-0022',
        official: { id: 'usr-002', name: 'Luis', lastName: 'González', photo: null },
        from: 'UNDER_REVIEW',
        to: 'PUBLISHED',
        date: '2026-02-02',
        time: '10:00 AM'
      }
    ],
    createdAt: '2026-01-25T08:00:00Z',
    updatedAt: '2026-02-02T10:00:00Z'
  },
  {
    id: 'crs-003',
    title: 'Inglés conversacional básico',
    description: 'Fundamentos de conversación en inglés para el ámbito laboral.',
    modality: 'HYBRID',
    level: 'BASIC',
    origin: 'EXTERNAL',
    status: 'UNDER_REVIEW',
    enrollmentMode: 'OPEN',
    durationHours: 80,
    cover: null,
    publishedAt: null,
    category: null,
    provider: { id: 'prv-002', name: 'Universidad de Panamá', type: 'EDUCATIONAL_INSTITUTION' },
    competencies: [{ id: 'cmp-002', name: 'Comunicación efectiva' }],
    tags: [{ id: 'tag-004', name: 'Certificación' }],
    createdBy: 'usr-002',
    stateHistory: [
      {
        id: 'sth-0031',
        official: { id: 'usr-001', name: 'Ana', lastName: 'López', photo: null },
        from: 'DRAFT',
        to: 'UNDER_REVIEW',
        date: '2026-03-01',
        time: '11:20 AM'
      }
    ],
    createdAt: '2026-02-20T08:00:00Z',
    updatedAt: '2026-03-01T11:20:00Z'
  },
  {
    id: 'crs-004',
    title: 'Contabilidad para pequeñas empresas',
    description: 'Registro contable básico y control financiero para micro negocios.',
    modality: 'IN_PERSON',
    level: 'INTERMEDIATE',
    origin: 'EXTERNAL',
    status: 'PUBLISHED',
    enrollmentMode: 'OPEN',
    durationHours: 90,
    cover: null,
    publishedAt: '2025-11-20T09:00:00Z',
    category: { id: 'cat-002', name: 'Emprendimiento' },
    provider: { id: 'prv-003', name: 'Fundación Semilla', type: 'NGO' },
    competencies: [{ id: 'cmp-003', name: 'Gestión financiera' }],
    tags: [
      { id: 'tag-003', name: 'Empleo' },
      { id: 'tag-004', name: 'Certificación' }
    ],
    createdBy: 'usr-002',
    stateHistory: [
      {
        id: 'sth-0041',
        official: { id: 'usr-002', name: 'Luis', lastName: 'González', photo: null },
        from: null,
        to: 'PUBLISHED',
        date: '2025-11-20',
        time: '09:00 AM'
      }
    ],
    createdAt: '2025-10-05T08:00:00Z',
    updatedAt: '2025-11-20T09:00:00Z'
  },
  {
    id: 'crs-005',
    title: 'Artesanía y manualidades',
    description: 'Técnicas de elaboración de artesanías locales.',
    modality: 'IN_PERSON',
    level: 'BASIC',
    origin: 'MUNICIPAL',
    status: 'DRAFT',
    enrollmentMode: 'OPEN',
    durationHours: 30,
    cover: null,
    publishedAt: null,
    category: { id: 'cat-003', name: 'Artes y Oficios' },
    provider: { id: 'prv-001', name: 'Municipio de Panamá', type: 'GOVERNMENT' },
    competencies: [{ id: 'cmp-004', name: 'Trabajo en equipo' }],
    tags: [{ id: 'tag-006', name: 'Corta duración' }],
    createdBy: 'usr-001',
    stateHistory: [],
    createdAt: '2026-04-01T08:00:00Z',
    updatedAt: '2026-04-01T08:00:00Z'
  },
  {
    id: 'crs-006',
    title: 'Programación web introductoria',
    description: 'Primeros pasos en HTML, CSS y JavaScript para la web.',
    modality: 'VIRTUAL',
    level: 'BASIC',
    origin: 'EXTERNAL',
    status: 'PUBLISHED',
    enrollmentMode: 'OPEN',
    durationHours: 50,
    cover: { key: 'covers/programacion-web.jpg', name: 'programacion-web.jpg', type: 'image/jpeg' },
    publishedAt: '2026-03-10T12:00:00Z',
    category: { id: 'cat-001', name: 'Tecnología' },
    provider: { id: 'prv-005', name: 'Plataforma AprendePanamá', type: 'DIGITAL_PLATFORM' },
    competencies: [{ id: 'cmp-001', name: 'Pensamiento computacional' }],
    tags: [
      { id: 'tag-002', name: 'Virtual' },
      { id: 'tag-005', name: 'Jóvenes' }
    ],
    createdBy: 'usr-002',
    stateHistory: [
      {
        id: 'sth-0061',
        official: { id: 'usr-002', name: 'Luis', lastName: 'González', photo: null },
        from: 'UNDER_REVIEW',
        to: 'PUBLISHED',
        date: '2026-03-10',
        time: '12:00 PM'
      }
    ],
    createdAt: '2026-02-28T08:00:00Z',
    updatedAt: '2026-03-10T12:00:00Z'
  },
  {
    id: 'crs-007',
    title: 'Marketing digital avanzado',
    description: 'Estrategias avanzadas de posicionamiento y publicidad digital.',
    modality: 'VIRTUAL',
    level: 'ADVANCED',
    origin: 'EXTERNAL',
    status: 'SUSPENDED',
    enrollmentMode: 'SCHOLARSHIP_ONLY',
    durationHours: 45,
    cover: null,
    publishedAt: '2025-09-05T10:00:00Z',
    category: { id: 'cat-002', name: 'Emprendimiento' },
    provider: { id: 'prv-004', name: 'Academia Digital Faro', type: 'PRIVATE_COMPANY' },
    competencies: [{ id: 'cmp-005', name: 'Liderazgo' }],
    tags: [
      { id: 'tag-004', name: 'Certificación' },
      { id: 'tag-002', name: 'Virtual' }
    ],
    createdBy: 'usr-002',
    stateHistory: [
      {
        id: 'sth-0071',
        official: { id: 'usr-001', name: 'Ana', lastName: 'López', photo: null },
        from: 'PUBLISHED',
        to: 'SUSPENDED',
        date: '2026-01-30',
        time: '03:45 PM'
      }
    ],
    createdAt: '2025-08-01T08:00:00Z',
    updatedAt: '2026-01-30T03:45:00Z'
  },
  {
    id: 'crs-008',
    title: 'Cocina panameña tradicional',
    description: 'Platos típicos y técnicas de la cocina tradicional panameña.',
    modality: 'IN_PERSON',
    level: 'BASIC',
    origin: 'MUNICIPAL',
    status: 'ARCHIVED',
    enrollmentMode: 'OPEN',
    durationHours: 25,
    cover: null,
    publishedAt: '2025-05-12T09:00:00Z',
    category: { id: 'cat-003', name: 'Artes y Oficios' },
    provider: { id: 'prv-001', name: 'Municipio de Panamá', type: 'GOVERNMENT' },
    competencies: [{ id: 'cmp-004', name: 'Trabajo en equipo' }],
    tags: [{ id: 'tag-006', name: 'Corta duración' }],
    createdBy: 'usr-001',
    stateHistory: [
      {
        id: 'sth-0081',
        official: { id: 'usr-002', name: 'Luis', lastName: 'González', photo: null },
        from: 'SUSPENDED',
        to: 'ARCHIVED',
        date: '2026-02-15',
        time: '08:30 AM'
      }
    ],
    createdAt: '2025-04-20T08:00:00Z',
    updatedAt: '2026-02-15T08:30:00Z'
  }
];

function toListItem(course: CourseDetailDto): CourseListItemDto {
  return {
    id: course.id,
    title: course.title,
    modality: course.modality,
    level: course.level,
    origin: course.origin,
    status: course.status,
    enrollmentMode: course.enrollmentMode,
    durationHours: course.durationHours,
    cover: course.cover,
    publishedAt: course.publishedAt
  };
}

const courseListItems = courseDetails.map(toListItem);

function findCourse(id: string): CourseDetailDto | undefined {
  return courseDetails.find((course) => course.id === id);
}

export const catalogMockEndpoints: MockEndpoint[] = [
  { method: 'GET', path: '/catalog/categories', body: () => ({ data: categoryDetails, pagination: { total: categoryDetails.length } }) },
  { method: 'GET', path: '/catalog/categories/:id', body: (params: Record<string, string>) => categoryDetails.find((item) => item.id === params['id']) },
  { method: 'POST', path: '/catalog/categories', status: 201, body: () => ({ id: 'cat-new' }) },
  { method: 'PATCH', path: '/catalog/categories/:id', body: (params: Record<string, string>) => ({ id: params['id'] }) },

  { method: 'GET', path: '/catalog/providers', body: () => ({ data: providerDetails, pagination: { total: providerDetails.length } }) },
  { method: 'GET', path: '/catalog/providers/:id', body: (params: Record<string, string>) => providerDetails.find((item) => item.id === params['id']) },
  { method: 'POST', path: '/catalog/providers', status: 201, body: () => ({ id: 'prv-new' }) },
  { method: 'PATCH', path: '/catalog/providers/:id', body: (params: Record<string, string>) => ({ id: params['id'] }) },
  { method: 'PATCH', path: '/catalog/providers/:id/type', body: (params: Record<string, string>) => ({ id: params['id'] }) },

  { method: 'GET', path: '/catalog/competencies', body: () => ({ data: competencyDetails, pagination: { total: competencyDetails.length } }) },
  { method: 'GET', path: '/catalog/competencies/:id', body: (params: Record<string, string>) => competencyDetails.find((item) => item.id === params['id']) },
  { method: 'POST', path: '/catalog/competencies', status: 201, body: () => ({ id: 'cmp-new' }) },
  { method: 'PATCH', path: '/catalog/competencies/:id', body: (params: Record<string, string>) => ({ id: params['id'] }) },

  { method: 'GET', path: '/catalog/tags', body: () => ({ data: tagDetails, pagination: { total: tagDetails.length } }) },
  { method: 'GET', path: '/catalog/tags/:id', body: (params: Record<string, string>) => tagDetails.find((item) => item.id === params['id']) },
  { method: 'POST', path: '/catalog/tags', status: 201, body: () => ({ id: 'tag-new' }) },
  { method: 'PATCH', path: '/catalog/tags/:id', body: (params: Record<string, string>) => ({ id: params['id'] }) },

  { method: 'GET', path: '/catalog/courses', body: () => ({ data: courseListItems, pagination: { total: courseListItems.length } }) },
  { method: 'GET', path: '/catalog/courses/:id', body: (params: Record<string, string>) => findCourse(params['id']) },
  { method: 'POST', path: '/catalog/courses', status: 201, body: () => ({ id: 'crs-new' }) },
  { method: 'PATCH', path: '/catalog/courses/:id', body: (params: Record<string, string>) => ({ id: params['id'] }) },
  { method: 'PATCH', path: '/catalog/courses/:id/cover', body: (params: Record<string, string>) => ({ id: params['id'] }) },
  { method: 'POST', path: '/catalog/courses/:id/submit-review', body: (params: Record<string, string>) => ({ id: params['id'] }) },
  { method: 'POST', path: '/catalog/courses/:id/return-draft', body: (params: Record<string, string>) => ({ id: params['id'] }) },
  { method: 'POST', path: '/catalog/courses/:id/publish', body: (params: Record<string, string>) => ({ id: params['id'] }) },
  { method: 'POST', path: '/catalog/courses/:id/suspend', body: (params: Record<string, string>) => ({ id: params['id'] }) },
  { method: 'POST', path: '/catalog/courses/:id/archive', body: (params: Record<string, string>) => ({ id: params['id'] }) },
  { method: 'POST', path: '/catalog/courses/:id/resubmit-review', body: (params: Record<string, string>) => ({ id: params['id'] }) },
  { method: 'PATCH', path: '/catalog/courses/:id/category', body: (params: Record<string, string>) => ({ id: params['id'] }) },
  { method: 'PATCH', path: '/catalog/courses/:id/provider', body: (params: Record<string, string>) => ({ id: params['id'] }) },
  { method: 'PATCH', path: '/catalog/courses/:id/duration', body: (params: Record<string, string>) => ({ id: params['id'] }) },
  { method: 'POST', path: '/catalog/courses/:id/competencies', body: (params: Record<string, string>) => ({ id: params['id'] }) },
  { method: 'DELETE', path: '/catalog/courses/:id/competencies', body: (params: Record<string, string>) => ({ id: params['id'] }) },
  { method: 'POST', path: '/catalog/courses/:id/tags', body: (params: Record<string, string>) => ({ id: params['id'] }) },
  { method: 'DELETE', path: '/catalog/courses/:id/tags', body: (params: Record<string, string>) => ({ id: params['id'] }) }
];