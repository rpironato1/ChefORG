// Shared API endpoints for cross-platform use

export * from './base';

// API endpoint constants
export const API_ENDPOINTS = {
  // Authentication
  AUTH: {
    LOGIN: '/auth/login',
    LOGOUT: '/auth/logout',
    REGISTER: '/auth/register',
    REFRESH: '/auth/refresh',
    PROFILE: '/auth/profile',
  },

  // Reservations
  RESERVATIONS: {
    LIST: '/reservations',
    CREATE: '/reservations',
    UPDATE: (id: string) => `/reservations/${id}`,
    DELETE: (id: string) => `/reservations/${id}`,
    FIND: (id: string) => `/reservations/${id}`,
    BY_DATE: '/reservations/by-date',
    BY_STATUS: '/reservations/by-status',
    CHECK_IN: (id: string) => `/reservations/${id}/check-in`,
  },

  // Tables
  TABLES: {
    LIST: '/tables',
    CREATE: '/tables',
    UPDATE: (id: string) => `/tables/${id}`,
    DELETE: (id: string) => `/tables/${id}`,
    FIND: (id: string) => `/tables/${id}`,
    BY_STATUS: '/tables/by-status',
    OCCUPY: (id: string) => `/tables/${id}/occupy`,
    RELEASE: (id: string) => `/tables/${id}/release`,
    GENERATE_PIN: (id: string) => `/tables/${id}/pin`,
  },

  // Menu
  MENU: {
    LIST: '/menu',
    CREATE: '/menu',
    UPDATE: (id: string) => `/menu/${id}`,
    DELETE: (id: string) => `/menu/${id}`,
    FIND: (id: string) => `/menu/${id}`,
    BY_CATEGORY: '/menu/by-category',
    SEARCH: '/menu/search',
    CATEGORIES: '/menu/categories',
  },

  // Orders
  ORDERS: {
    LIST: '/orders',
    CREATE: '/orders',
    UPDATE: (id: string) => `/orders/${id}`,
    DELETE: (id: string) => `/orders/${id}`,
    FIND: (id: string) => `/orders/${id}`,
    BY_STATUS: '/orders/by-status',
    BY_TABLE: '/orders/by-table',
    ADD_ITEM: (id: string) => `/orders/${id}/items`,
    UPDATE_ITEM: (orderId: string, itemId: string) => `/orders/${orderId}/items/${itemId}`,
    REMOVE_ITEM: (orderId: string, itemId: string) => `/orders/${orderId}/items/${itemId}`,
    CONFIRM: (id: string) => `/orders/${id}/confirm`,
    CANCEL: (id: string) => `/orders/${id}/cancel`,
  },

  // Payments
  PAYMENTS: {
    LIST: '/payments',
    CREATE: '/payments',
    FIND: (id: string) => `/payments/${id}`,
    WEBHOOK: '/payments/webhook',
    STATUS: (id: string) => `/payments/${id}/status`,
    MANUAL: '/payments/manual',
    BY_ORDER: (orderId: string) => `/payments/order/${orderId}`,
  },

  // Reports
  REPORTS: {
    SALES: '/reports/sales',
    RESERVATIONS: '/reports/reservations',
    QUEUE: '/reports/queue',
    AVERAGE_TIME: '/reports/average-time',
    DASHBOARD: '/reports/dashboard',
  },

  // Stock
  STOCK: {
    LIST: '/stock',
    CREATE: '/stock',
    UPDATE: (id: string) => `/stock/${id}`,
    DELETE: (id: string) => `/stock/${id}`,
    FIND: (id: string) => `/stock/${id}`,
    CONSUME: (id: string) => `/stock/${id}/consume`,
    DISCARD: (id: string) => `/stock/${id}/discard`,
    LOW_STOCK: '/stock/low-stock',
    MOVEMENTS: '/stock/movements',
  },

  // Loyalty
  LOYALTY: {
    CUSTOMERS: '/loyalty/customers',
    CREATE_CUSTOMER: '/loyalty/customers',
    ADD_POINTS: (customerId: string) => `/loyalty/customers/${customerId}/points`,
    REDEEM_POINTS: (customerId: string) => `/loyalty/customers/${customerId}/redeem`,
    COUPONS: '/loyalty/coupons',
    GENERATE_COUPON: '/loyalty/coupons',
    USE_COUPON: (code: string) => `/loyalty/coupons/${code}/use`,
    HISTORY: (customerId: string) => `/loyalty/customers/${customerId}/history`,
  },

  // Notifications
  NOTIFICATIONS: {
    SEND: '/notifications/send',
    WHATSAPP: '/notifications/whatsapp',
    SMS: '/notifications/sms',
    EMAIL: '/notifications/email',
  },
} as const;

// Type-safe endpoint builder
export const buildEndpoint = (template: string, params?: Record<string, string>): string => {
  if (!params) return template;

  let endpoint = template;
  for (const [key, value] of Object.entries(params)) {
    endpoint = endpoint.replace(`:${key}`, encodeURIComponent(value));
  }

  return endpoint;
};

// Query parameter builder
export const buildQueryParams = (params: Record<string, any>): string => {
  const filteredParams = Object.entries(params)
    .filter(([_, value]) => value !== undefined && value !== null && value !== '')
    .map(([key, value]) => [key, String(value)]);

  if (filteredParams.length === 0) return '';

  const searchParams = new URLSearchParams(filteredParams);
  return `?${searchParams.toString()}`;
};

// Common API request configurations
export const API_CONFIG = {
  CACHE_TIMES: {
    MENU: 10, // 10 minutes
    TABLES: 2, // 2 minutes
    RESERVATIONS: 5, // 5 minutes
    ORDERS: 1, // 1 minute
    REPORTS: 15, // 15 minutes
    STOCK: 5, // 5 minutes
    LOYALTY: 10, // 10 minutes
  },

  TIMEOUTS: {
    FAST: 5000, // 5 seconds
    NORMAL: 10000, // 10 seconds
    SLOW: 30000, // 30 seconds
  },

  RETRIES: {
    NONE: 0,
    LOW: 1,
    NORMAL: 3,
    HIGH: 5,
  },
} as const;
