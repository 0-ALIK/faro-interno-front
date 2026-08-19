import { registerMockEndpoints, resolveMock } from './mock-api';

describe('mock-api', () => {
  beforeEach(() => {
    registerMockEndpoints([
      { method: 'GET', path: '/catalog/courses', body: () => ({ data: [], pagination: { total: 0 } }) },
      { method: 'GET', path: '/catalog/courses/:id', body: (params) => ({ id: params['id'] }) },
      { method: 'PATCH', path: '/catalog/courses/:id/category', body: (params) => ({ id: params['id'] }) }
    ]);
  });

  it('should resolve an exact path ignoring query string and base url', () => {
    const match = resolveMock('GET', '/api/v1/catalog/courses?page=1&limit=10');
    expect(match).not.toBeNull();
    expect(match!.endpoint.path).toBe('/catalog/courses');
  });

  it('should resolve a parameterized path and extract params', () => {
    const match = resolveMock('GET', '/api/v1/catalog/courses/crs-001');
    expect(match).not.toBeNull();
    expect(match!.params).toEqual({ id: 'crs-001' });
  });

  it('should match a sub-resource path over a shorter pattern', () => {
    const match = resolveMock('PATCH', '/api/v1/catalog/courses/crs-001/category');
    expect(match).not.toBeNull();
    expect(match!.endpoint.path).toBe('/catalog/courses/:id/category');
    expect(match!.params).toEqual({ id: 'crs-001' });
  });

  it('should return null when no mock matches', () => {
    expect(resolveMock('DELETE', '/api/v1/catalog/courses/crs-001')).toBeNull();
    expect(resolveMock('GET', '/api/v1/scholarships/calls')).toBeNull();
  });
});