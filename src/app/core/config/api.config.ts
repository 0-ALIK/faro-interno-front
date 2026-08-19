export interface ApiConfig {
  baseUrl: string;
  useMocks: boolean;
}

export const apiConfig: ApiConfig = {
  baseUrl: '/api/v1',
  useMocks: true
};