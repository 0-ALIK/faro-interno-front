
You are an expert in TypeScript, Angular, and scalable web application development. You write functional, maintainable, performant, and accessible code following Angular and TypeScript best practices.

## TypeScript Best Practices

- Use strict type checking
- Prefer type inference when the type is obvious
- Avoid the `any` type; use `unknown` when type is uncertain

## Angular Best Practices

- Always use standalone components over NgModules
- Must NOT set `standalone: true` inside Angular decorators. It's the default in Angular v20+.
- Do NOT set `changeDetection: ChangeDetectionStrategy.OnPush` explicitly. `OnPush` is the default in Angular v22+.
- Use signals for state management
- Implement lazy loading for feature routes
- Do NOT use the `@HostBinding` and `@HostListener` decorators. Put host bindings inside the `host` object of the `@Component` or `@Directive` decorator instead
- Use `NgOptimizedImage` for all static images.
  - `NgOptimizedImage` does not work for inline base64 images.

## Accessibility Requirements

- It MUST pass all AXE checks.
- It MUST follow all WCAG AA minimums, including focus management, color contrast, and ARIA attributes.

### Components

- Keep components small and focused on a single responsibility
- Use `input()` and `output()` functions instead of decorators
- Use `computed()` for derived state
- Angular components are always **single-file**: class, template, and styles live in one `.ts` file. Never split into separate `.html`/`.css` files.
- Prefer Signal Forms (`@angular/forms/signals`) for new forms. They are stable in Angular v22+ and provide signal-based state, type-safe field access, and schema-based validation
- When not using Signal Forms, prefer Reactive forms instead of Template-driven ones
- Do NOT use `ngClass`, use `class` bindings instead
- Do NOT use `ngStyle`, use `style` bindings instead

### Styling

- Style exclusively with Tailwind utility classes (the project uses Tailwind CSS v4).
- Do NOT create separate `.css` or `.scss` files for components.
- Avoid `:host` styles and component-level CSS blocks unless a dynamic value cannot be expressed with utilities.

## State Management

- Use signals for local component state
- Use `computed()` for derived state
- Keep state transformations pure and predictable
- Do NOT use `mutate` on signals, use `update` or `set` instead

## Templates

- Keep templates simple and avoid complex logic
- Use native control flow (`@if`, `@for`, `@switch`) instead of `*ngIf`, `*ngFor`, `*ngSwitch`
- Use the async pipe to handle observables
- Do not assume globals like (`new Date()`) are available.

## Services

- Design services around a single responsibility
- Use the `providedIn: 'root'` option for singleton services
- Prefer the `@Service` decorator over `@Injectable({providedIn: 'root'})` for new singleton services (Angular v22+)
- Use the `inject()` function instead of constructor injection

## Project Architecture

Feature-first structure. The rule is: **feature first, responsibility second** (e.g. `courses/api` before an app-wide `api/`). This keeps the project navigable as it grows to hundreds of components.

```
src/app/
├── core/              # Angular transversal infrastructure
│   ├── auth/          # authentication
│   ├── http/          # interceptors, error-handler
│   ├── guards/
│   └── config/        # global configuration
│
├── shared/            # truly generic, reusable pieces
│   ├── ui/            # button, modal, data-table, pagination
│   ├── pipes/
│   ├── directives/
│   └── utils/
│
└── features/          # one folder per domain
    ├── courses/
    ├── scholarships/
    ├── users/
    └── profile/
```

Each feature follows the same internal layout:

```
feature/
├── ui/                # presentation only
│   ├── pages/         # route-bound pages (course-list.ts, course-detail.ts)
│   ├── components/    # reusable pieces (course-card.ts, course-form.ts)
│   └── dialogs/
├── services/          # frontend logic that doesn't belong in components
│   ├── course.service.ts         # coordination / data flow
│   ├── course-filter.service.ts  # presentation logic
│   └── course-state.service.ts   # feature state
├── api/               # backend communication
│   ├── courses.api.ts            # HttpClient calls only
│   ├── course.dto.ts             # API wire format
│   └── course.mapper.ts          # DTO <-> model mapping
├── models/            # domain models (course.model.ts, course-status.ts)
└── feature.routes.ts  # lazy-loaded feature routes
```

### Rules

- **Group files by type, not by file.** Do NOT create a folder per file. Files live directly in their type folder: `components/user-avatar.ts`, NOT `components/user-avatar/user-avatar.ts`.
- **Dependency direction** — components never use `HttpClient` directly. Flow: `UI → Services → API → Backend`, with `Models` shared by both UI and Services:
  ```
  UI
   ↓
  Services
   ↓
  API
   ↓
  Backend

  Models
   ↗   ↖
  UI   Services
  ```
  Don't obsess over strict direction; keep it intuitive.
- **DTOs live in `api/`, models live in `models/`.** Never mix them (`models/course.dto.ts` is wrong).
- **Feature services stay in their feature.** `shared/services/course.service.ts` is a smell; move it into `courses/services/`.
- **`shared/` only holds genuinely generic code** (button, modal, pipes, directives, utils). Domain-specific code belongs in the feature.
- **`core/` holds only cross-cutting Angular infrastructure** (auth, http interceptors, guards, global config).
- Use `models/` for domain types, `api/*.dto.ts` for wire format, and `api/*.mapper.ts` to convert between them.
