// Shared constants for cross-platform use (Sprint 4)

// App configuration
export const APP_CONFIG = {
  name: 'ChefORG',
  version: '1.0.0',
  description: 'Sistema de Gestão para Restaurantes',
} as const;

// API configuration
export const API_CONFIG = {
  timeout: 10000,
  retryAttempts: 3,
  cacheTimeout: 5 * 60 * 1000, // 5 minutes
} as const;

// UI constants
export const BREAKPOINTS = {
  mobile: 768,
  tablet: 1024,
  desktop: 1280,
} as const;

export const COLORS = {
  primary: {
    50: '#f0f9ff',
    100: '#e0f2fe',
    500: '#0ea5e9',
    600: '#0284c7',
    700: '#0369a1',
  },
  gray: {
    50: '#f9fafb',
    100: '#f3f4f6',
    500: '#6b7280',
    700: '#374151',
    900: '#111827',
  },
  success: '#10b981',
  warning: '#f59e0b',
  error: '#ef4444',
} as const;

export const SPACING = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
} as const;

// Business constants
export const MESA_STATUS = {
  LIVRE: 'livre',
  OCUPADA: 'ocupada',
  RESERVADA: 'reservada',
  LIMPEZA: 'limpeza',
  AGUARDANDO: 'aguardando',
} as const;

export const PEDIDO_STATUS = {
  CARRINHO: 'carrinho',
  CONFIRMADO: 'confirmado',
  PREPARANDO: 'preparando',
  PRONTO: 'pronto',
  ENTREGUE: 'entregue',
  PAGO: 'pago',
} as const;

export const RESERVA_STATUS = {
  CONFIRMADA: 'confirmada',
  CANCELADA: 'cancelada',
  REALIZADA: 'realizada',
  AGUARDANDO: 'aguardando',
  EM_ATENDIMENTO: 'em_atendimento',
} as const;

export const PAGAMENTO_METODOS = {
  PIX: 'pix',
  APPLE_PAY: 'apple_pay',
  GOOGLE_PAY: 'google_pay',
  SAMSUNG_PAY: 'samsung_pay',
  DINHEIRO: 'dinheiro',
  CARTAO: 'cartao',
} as const;

export const FUNCIONARIO_CARGOS = {
  RECEPCAO: 'recepcao',
  GARCOM: 'garcom',
  COZINHEIRO: 'cozinheiro',
  CAIXA: 'caixa',
  GERENTE: 'gerente',
} as const;

// Navigation constants
export const ROUTES = {
  WEB: {
    HOME: '/',
    MENU: '/menu',
    RESERVA: '/reserva',
    ADMIN: '/admin',
    STAFF: '/staff',
    CLIENTE: '/cliente',
  },
  NATIVE: {
    HOME: 'Home',
    MENU: 'Menu',
    RESERVA: 'Reserva',
    PROFILE: 'Profile',
    SETTINGS: 'Settings',
  },
} as const;

// Time constants
export const TIME_CONSTANTS = {
  CACHE_DURATION: 5 * 60 * 1000, // 5 minutes
  REQUEST_TIMEOUT: 10 * 1000, // 10 seconds
  DEBOUNCE_DELAY: 300, // 300ms
  TOAST_DURATION: 3000, // 3 seconds
} as const;

// Validation constants
export const VALIDATION = {
  CPF_LENGTH: 11,
  PHONE_MIN_LENGTH: 10,
  PHONE_MAX_LENGTH: 11,
  PASSWORD_MIN_LENGTH: 6,
  MAX_FILE_SIZE: 5 * 1024 * 1024, // 5MB
} as const;

// Feature flags
export const FEATURES = {
  PWA_ENABLED: true,
  OFFLINE_MODE: true,
  PUSH_NOTIFICATIONS: true,
  BIOMETRIC_AUTH: false, // Will be enabled for native apps
  QR_SCANNER: false, // Will be enabled for native apps
} as const;

// Platform-specific constants
export const PLATFORM = {
  WEB: 'web',
  IOS: 'ios',
  ANDROID: 'android',
} as const;
