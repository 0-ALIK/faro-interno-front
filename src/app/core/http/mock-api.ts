import { apiConfig } from '../config/api.config';

export type MockHttpMethod = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';

export interface MockEndpoint {
  method: MockHttpMethod;
  path: string;
  status?: number;
  body: (params: Record<string, string>) => unknown;
}

export interface MockMatch {
  endpoint: MockEndpoint;
  params: Record<string, string>;
}

const registry = new Map<string, MockEndpoint>();

export function registerMockEndpoints(endpoints: MockEndpoint[]): void {
  for (const endpoint of endpoints) {
    registry.set(`${endpoint.method} ${endpoint.path}`, endpoint);
  }
}

export function resolveMock(method: string, url: string): MockMatch | null {
  const pathname = toPathname(url);
  for (const endpoint of registry.values()) {
    if (endpoint.method !== method) {
      continue;
    }
    const params = matchPath(endpoint.path, pathname);
    if (params) {
      return { endpoint, params };
    }
  }
  return null;
}

function toPathname(url: string): string {
  const withoutQuery = url.split('?')[0] ?? url;
  if (withoutQuery.startsWith(apiConfig.baseUrl)) {
    return withoutQuery.slice(apiConfig.baseUrl.length) || '/';
  }
  return withoutQuery;
}

function matchPath(pattern: string, pathname: string): Record<string, string> | null {
  const patternSegments = pattern.split('/').filter(Boolean);
  const pathSegments = pathname.split('/').filter(Boolean);
  if (patternSegments.length !== pathSegments.length) {
    return null;
  }

  const params: Record<string, string> = {};
  for (let i = 0; i < patternSegments.length; i++) {
    const patternSegment = patternSegments[i];
    const pathSegment = pathSegments[i];
    if (patternSegment.startsWith(':')) {
      params[patternSegment.slice(1)] = decodeURIComponent(pathSegment);
    } else if (patternSegment !== pathSegment) {
      return null;
    }
  }
  return params;
}