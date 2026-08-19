import {
  HttpEvent,
  HttpHandlerFn,
  HttpInterceptorFn,
  HttpRequest,
  HttpResponse
} from '@angular/common/http';
import { Observable, of } from 'rxjs';

import { apiConfig } from '../config/api.config';
import { resolveMock } from './mock-api';

export const mockApiInterceptor: HttpInterceptorFn = (
  req: HttpRequest<unknown>,
  next: HttpHandlerFn
): Observable<HttpEvent<unknown>> => {
  if (!apiConfig.useMocks) {
    return next(req);
  }

  const match = resolveMock(req.method, req.url);
  if (!match) {
    return next(req);
  }

  const status = match.endpoint.status ?? 200;
  const body = match.endpoint.body(match.params);
  return of(new HttpResponse({ status, body }));
};