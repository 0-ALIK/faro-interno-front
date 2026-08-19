import type { MockEndpoint } from '../../../../core/http/mock-api';
import type {
  EvaluationDto,
  LessonDetailDto,
  MunicipalCourseDetailDto,
  MunicipalCourseListItemDto
} from '../formation.dto';

const courseDetails: MunicipalCourseDetailDto[] = [
  {
    id: 'mcrs-001',
    courseId: 'crs-001',
    courseTitle: 'Ofimática para el empleo',
    courseCover: { key: 'covers/ofimatica-empleo.jpg', name: 'ofimatica-empleo.jpg', type: 'image/jpeg' },
    courseStatus: 'PUBLISHED',
    moduleCount: 2,
    lessonCount: 5,
    modules: [
      {
        id: 'mod-001',
        title: 'Introducción a las herramientas ofimáticas',
        description: 'Conceptos básicos del entorno de office y productividad.',
        position: 1,
        hasEvaluation: true,
        createdBy: 'usr-001',
        lessons: [
          { id: 'les-001', title: 'El escritorio y el panel de control', type: 'LESSON', position: 1, createdBy: 'usr-001' },
          { id: 'les-002', title: 'Gestión de archivos y carpetas', type: 'LESSON', position: 2, createdBy: 'usr-001' },
          { id: 'les-003', title: 'Práctica: crear una carpeta organizada', type: 'ACTIVITY', position: 3, createdBy: 'usr-001' }
        ]
      },
      {
        id: 'mod-002',
        title: 'Procesador de texto',
        description: 'Uso de Word para documentos laborales.',
        position: 2,
        hasEvaluation: false,
        createdBy: 'usr-001',
        lessons: [
          { id: 'les-004', title: 'Formato de texto y párrafos', type: 'LESSON', position: 1, createdBy: 'usr-001' },
          { id: 'les-005', title: 'Tablas e imágenes en documentos', type: 'LESSON', position: 2, createdBy: 'usr-001' }
        ]
      }
    ]
  },
  {
    id: 'mcrs-002',
    courseId: 'crs-002',
    courseTitle: 'Emprendimiento digital',
    courseCover: null,
    courseStatus: 'PUBLISHED',
    moduleCount: 2,
    lessonCount: 4,
    modules: [
      {
        id: 'mod-003',
        title: 'Modelo de negocio Canvas',
        description: 'Herramienta para diseñar modelos de negocio.',
        position: 1,
        hasEvaluation: true,
        createdBy: 'usr-002',
        lessons: [
          { id: 'les-006', title: 'Los 9 bloques del Canvas', type: 'LESSON', position: 1, createdBy: 'usr-002' },
          { id: 'les-007', title: 'Ejercicio: mi primer Canvas', type: 'ACTIVITY', position: 2, createdBy: 'usr-002' }
        ]
      },
      {
        id: 'mod-004',
        title: 'Presencia digital',
        description: 'Creación de presencia en línea para emprendedores.',
        position: 2,
        hasEvaluation: false,
        createdBy: 'usr-002',
        lessons: [
          { id: 'les-008', title: 'Redes sociales para negocios', type: 'LESSON', position: 1, createdBy: 'usr-002' },
          { id: 'les-009', title: 'Página web básica', type: 'ACTIVITY', position: 2, createdBy: 'usr-002' }
        ]
      }
    ]
  }
];

const courseListItems: MunicipalCourseListItemDto[] = courseDetails.map((c) => ({
  id: c.id,
  courseId: c.courseId,
  courseTitle: c.courseTitle,
  courseCover: c.courseCover,
  courseStatus: c.courseStatus,
  moduleCount: c.moduleCount,
  lessonCount: c.lessonCount
}));

const lessonDetails: LessonDetailDto[] = [
  {
    id: 'les-001',
    moduleId: 'mod-001',
    title: 'El escritorio y el panel de control',
    description: 'Conoce el entorno de Windows y sus herramientas principales.',
    type: 'LESSON',
    order: 1,
    mainContent: {
      type: 'ARTICLE',
      article: { id: 'art-001', content: '<p>El escritorio de Windows es el punto de partida para acceder a todas las aplicaciones y archivos.</p><p><strong>Elementos principales:</strong></p><ul><li>Iconos de acceso directo</li><li>Barra de tareas</li><li>Botón de inicio</li></ul>' },
      video: null,
      documentPdf: null
    },
    resources: [
      { id: 'res-001', name: 'Guía rápida de Windows', fileName: 'guia-windows.pdf', fileKey: 'resources/guia-windows.pdf', fileType: 'application/pdf' }
    ]
  },
  {
    id: 'les-002',
    moduleId: 'mod-001',
    title: 'Gestión de archivos y carpetas',
    description: 'Aprende a crear, renombrar y organizar archivos.',
    type: 'LESSON',
    order: 2,
    mainContent: {
      type: 'VIDEO',
      article: null,
      video: { key: 'videos/gestion-archivos.mp4', name: 'gestion-archivos.mp4', type: 'video/mp4' },
      documentPdf: null
    },
    resources: []
  }
];

const evaluationDetails: EvaluationDto[] = [
  {
    id: 'eval-001',
    moduleId: 'mod-001',
    title: 'Evaluación módulo 1',
    description: 'Evalúa los conocimientos básicos de ofimática.',
    minimumScore: 70,
    createdBy: 'usr-001',
    questions: [
      {
        id: 'qst-001',
        statement: '¿Cuál es la función principal del escritorio de Windows?',
        type: 'MULTIPLE_CHOICE',
        answers: [
          { id: 'ans-001', description: 'Ejecutar programas del sistema', correct: true },
          { id: 'ans-002', description: 'Almacenar archivos permanentemente', correct: false },
          { id: 'ans-003', description: 'Conectarse a internet', correct: false }
        ]
      },
      {
        id: 'qst-002',
        statement: 'La barra de tareas se encuentra en la parte inferior del escritorio.',
        type: 'TRUE_FALSE',
        answers: [
          { id: 'ans-004', description: 'Verdadero', correct: true },
          { id: 'ans-005', description: 'Falso', correct: false }
        ]
      }
    ]
  }
];

function findCourse(id: string): MunicipalCourseDetailDto | undefined {
  return courseDetails.find((c) => c.id === id);
}

function findLesson(id: string): LessonDetailDto | undefined {
  return lessonDetails.find((l) => l.id === id);
}

function findEvaluation(moduleId: string): EvaluationDto | undefined {
  return evaluationDetails.find((e) => e.moduleId === moduleId);
}

export const formationMockEndpoints: MockEndpoint[] = [
  { method: 'GET', path: '/formation/courses', body: () => ({ data: courseListItems, pagination: { total: courseListItems.length } }) },
  { method: 'GET', path: '/formation/courses/:id', body: (params: Record<string, string>) => findCourse(params['id']) },
  { method: 'POST', path: '/formation/courses/:id/modules', status: 201, body: () => ({ id: 'mod-new' }) },
  { method: 'PATCH', path: '/formation/modules/:id', body: (params: Record<string, string>) => ({ id: params['id'] }) },
  { method: 'DELETE', path: '/formation/courses/:courseId/modules/:moduleId', body: () => ({ id: 'ok' }) },
  { method: 'PATCH', path: '/formation/courses/:courseId/modules/:moduleId/order', body: (params: Record<string, string>) => ({ id: params['moduleId'] }) },
  { method: 'POST', path: '/formation/courses/:id/validate', body: (params: Record<string, string>) => ({ id: params['id'] }) },

  { method: 'POST', path: '/formation/modules/:id/lessons', status: 201, body: () => ({ id: 'les-new' }) },
  { method: 'GET', path: '/formation/lessons/:id', body: (params: Record<string, string>) => findLesson(params['id']) },
  { method: 'PATCH', path: '/formation/lessons/:id', body: (params: Record<string, string>) => ({ id: params['id'] }) },
  { method: 'DELETE', path: '/formation/modules/:moduleId/lessons/:lessonId', body: () => ({ id: 'ok' }) },
  { method: 'PATCH', path: '/formation/modules/:moduleId/lessons/:lessonId/order', body: (params: Record<string, string>) => ({ id: params['lessonId'] }) },
  { method: 'PUT', path: '/formation/lessons/:id/main-content', body: (params: Record<string, string>) => ({ id: params['id'] }) },
  { method: 'PATCH', path: '/formation/lessons/:lessonId/main-content/article/:articleId', body: (params: Record<string, string>) => ({ id: params['articleId'] }) },
  { method: 'POST', path: '/formation/lessons/:id/resources', status: 201, body: () => ({ id: 'res-new' }) },
  { method: 'DELETE', path: '/formation/lessons/:lessonId/resources/:resourceId', body: () => ({ id: 'ok' }) },

  { method: 'GET', path: '/formation/modules/:id/evaluation', body: (params: Record<string, string>) => findEvaluation(params['id']) },
  { method: 'POST', path: '/formation/modules/:id/evaluation', status: 201, body: () => ({ id: 'eval-new' }) },
  { method: 'PATCH', path: '/formation/modules/:id/evaluation', body: (params: Record<string, string>) => ({ id: params['id'] }) },
  { method: 'POST', path: '/formation/modules/:moduleId/evaluation/questions', status: 201, body: () => ({ id: 'qst-new' }) },
  { method: 'DELETE', path: '/formation/modules/:moduleId/evaluation/questions/:questionId', body: () => ({ id: 'ok' }) },
  { method: 'PATCH', path: '/formation/modules/:moduleId/evaluation/questions/:questionId/statement', body: (params: Record<string, string>) => ({ id: params['questionId'] }) },
  { method: 'PATCH', path: '/formation/modules/:moduleId/evaluation/questions/:questionId/type', body: (params: Record<string, string>) => ({ id: params['questionId'] }) },
  { method: 'POST', path: '/formation/modules/:moduleId/evaluation/questions/:questionId/answers', status: 201, body: () => ({ id: 'ans-new' }) },
  { method: 'DELETE', path: '/formation/modules/:moduleId/evaluation/questions/:questionId/answers/:answerId', body: () => ({ id: 'ok' }) }
];
