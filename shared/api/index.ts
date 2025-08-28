// Shared API layer for cross-platform use (Sprint 4)
// Consolidating APIs from src/lib/api and src/modules/shared/api

// Re-export everything from the current shared API
export * from '../../src/modules/shared/api';

// Additional API utilities for cross-platform
export interface ApiResponse<T> {
  data: T;
  error?: string;
  success: boolean;
}

export interface ApiConfig {
  baseUrl: string;
  timeout: number;
  retryAttempts: number;
}

// Platform-agnostic API client configuration
export const DEFAULT_API_CONFIG: ApiConfig = {
  baseUrl: 'https://your-supabase-url.supabase.co',
  timeout: 10000,
  retryAttempts: 3,
};

// Generic API error types
export class ApiError extends Error {
  constructor(
    message: string,
    public statusCode?: number,
    public originalError?: any
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

// Platform-agnostic HTTP client interface
export interface HttpClient {
  get<T>(url: string, config?: any): Promise<ApiResponse<T>>;
  post<T>(url: string, data?: any, config?: any): Promise<ApiResponse<T>>;
  put<T>(url: string, data?: any, config?: any): Promise<ApiResponse<T>>;
  delete<T>(url: string, config?: any): Promise<ApiResponse<T>>;
}
