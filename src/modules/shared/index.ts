// Main exports for shared module - Sprint 3 Business Logic Modular

// Hooks - Modularized business logic
export * from './hooks';

// Stores - Zustand state management with intelligent caching
export * from './stores';

// API - Shared layer for web/native compatibility
export * from './api';

// Error Handling - Module-specific error boundaries
export * from './errors';

// Re-export key utilities for convenience
export { clearAllCaches, getCacheStatus } from './stores';

export { apiClient, apiCache, API_ENDPOINTS, API_CONFIG } from './api';
