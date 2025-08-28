import * as Sentry from '@sentry/react';

// Sentry configuration for ChefORG
export const initSentry = () => {
  if (import.meta.env.PROD) {
    Sentry.init({
      dsn: import.meta.env.VITE_SENTRY_DSN || 'https://example@sentry.io/project-id',
      environment: import.meta.env.VITE_ENVIRONMENT || 'development',
      integrations: [
        Sentry.browserTracingIntegration(),
        Sentry.replayIntegration({
          maskAllText: false,
          blockAllMedia: false,
        }),
      ],
      tracesSampleRate: 1.0,
      replaysSessionSampleRate: 0.1,
      replaysOnErrorSampleRate: 1.0,
    });
  }
};

// Error boundary component
export const SentryErrorBoundary = Sentry.withErrorBoundary;

// Performance monitoring
export const sentryTrace = (name: string, op: string) => {
  if (import.meta.env.PROD) {
    return Sentry.startSpan({ name, op }, () => {});
  }
  return null;
};

// Manual error reporting
export const reportError = (error: Error, context?: Record<string, any>) => {
  if (import.meta.env.PROD) {
    Sentry.captureException(error, { extra: context });
  } else {
    console.error('ChefORG Error:', error, context);
  }
};

// User context
export const setSentryUser = (user: { id: string; email?: string; role?: string }) => {
  if (import.meta.env.PROD) {
    Sentry.setUser(user);
  }
};

// Custom performance monitoring
export const startTransaction = (name: string, op: string) => {
  if (import.meta.env.PROD) {
    return Sentry.startSpan({ name, op }, () => {});
  }
  return null;
};

export default {
  initSentry,
  SentryErrorBoundary,
  sentryTrace,
  reportError,
  setSentryUser,
  startTransaction,
};
