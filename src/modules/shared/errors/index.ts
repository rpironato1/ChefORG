// Error handling utilities for modules

export { 
  ModuleErrorBoundary,
  ReservationsErrorBoundary,
  TablesErrorBoundary,
  MenuErrorBoundary,
  OrdersErrorBoundary,
  PaymentsErrorBoundary,
  AuthErrorBoundary,
  withErrorBoundary
} from './ErrorBoundaries';

// Custom error classes for better error handling
export class ChefOrgError extends Error {
  public readonly module: string;
  public readonly code?: string;
  public readonly context?: Record<string, any>;

  constructor(
    message: string,
    module: string,
    code?: string,
    context?: Record<string, any>
  ) {
    super(message);
    this.name = 'ChefOrgError';
    this.module = module;
    this.code = code;
    this.context = context;
  }
}

export class ReservationError extends ChefOrgError {
  constructor(message: string, code?: string, context?: Record<string, any>) {
    super(message, 'Reservations', code, context);
    this.name = 'ReservationError';
  }
}

export class TableError extends ChefOrgError {
  constructor(message: string, code?: string, context?: Record<string, any>) {
    super(message, 'Tables', code, context);
    this.name = 'TableError';
  }
}

export class MenuError extends ChefOrgError {
  constructor(message: string, code?: string, context?: Record<string, any>) {
    super(message, 'Menu', code, context);
    this.name = 'MenuError';
  }
}

export class OrderError extends ChefOrgError {
  constructor(message: string, code?: string, context?: Record<string, any>) {
    super(message, 'Orders', code, context);
    this.name = 'OrderError';
  }
}

export class PaymentError extends ChefOrgError {
  constructor(message: string, code?: string, context?: Record<string, any>) {
    super(message, 'Payments', code, context);
    this.name = 'PaymentError';
  }
}

export class AuthError extends ChefOrgError {
  constructor(message: string, code?: string, context?: Record<string, any>) {
    super(message, 'Auth', code, context);
    this.name = 'AuthError';
  }
}

// Error logging utility
export const logError = (error: Error, additionalContext?: Record<string, any>) => {
  const errorData = {
    message: error.message,
    name: error.name,
    stack: error.stack,
    timestamp: new Date().toISOString(),
    url: window.location.href,
    userAgent: navigator.userAgent,
    ...additionalContext
  };

  // Log to console in development
  if (process.env.NODE_ENV === 'development') {
    console.error('ChefOrg Error:', errorData);
  }

  // In production, send to monitoring service
  if (process.env.NODE_ENV === 'production') {
    // TODO: Send to monitoring service (Sentry, LogRocket, etc.)
    console.error('Production error logged:', errorData);
  }
};

// Error recovery utilities
export const createErrorHandler = (moduleName: string) => {
  return (error: Error, errorInfo?: any) => {
    logError(error, { module: moduleName, errorInfo });
  };
};

// Async error handler for promises
export const handleAsyncError = (moduleName: string) => {
  return (error: Error) => {
    logError(error, { module: moduleName, type: 'async' });
    throw error; // Re-throw to maintain promise rejection
  };
};