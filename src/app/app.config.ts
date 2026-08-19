import { ApplicationConfig, provideBrowserGlobalErrorListeners } from '@angular/core';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { provideRouter } from '@angular/router';

import { catalogMockEndpoints } from './modules/catalog/api/mocks/catalog.mocks';
import { registerMockEndpoints } from './core/http/mock-api';
import { mockApiInterceptor } from './core/http/mock-api.interceptor';
import { provideFaroPrimeNG } from './core/config/primeng/primeng.config';
import { routes } from './app.routes';

registerMockEndpoints(catalogMockEndpoints);

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideHttpClient(withInterceptors([mockApiInterceptor])),
    provideFaroPrimeNG(),
    provideRouter(routes)
  ]
};