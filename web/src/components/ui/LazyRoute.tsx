import React, { Suspense } from 'react';
import { ErrorBoundary } from 'react-error-boundary';
import { Loader2 } from 'lucide-react';

interface LazyRouteProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

// Enhanced loading component
function RouteLoadingSpinner() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-orange-50 to-orange-100">
      <div className="text-center">
        <Loader2 className="h-8 w-8 animate-spin text-orange-600 mx-auto mb-4" />
        <p className="text-gray-600 font-medium">Carregando...</p>
        <div className="mt-2 w-32 h-1 bg-gray-200 rounded-full overflow-hidden mx-auto">
          <div className="h-full bg-orange-600 rounded-full animate-pulse"></div>
        </div>
      </div>
    </div>
  );
}

// Error fallback component
function RouteErrorFallback({
  error,
  resetErrorBoundary,
}: {
  error: Error;
  resetErrorBoundary: () => void;
}) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center p-8">
        <div className="bg-red-50 border border-red-200 rounded-lg p-6 max-w-md">
          <h2 className="text-lg font-semibold text-red-800 mb-2">Erro ao carregar página</h2>
          <p className="text-red-600 mb-4">
            Ocorreu um erro inesperado. Tente recarregar a página.
          </p>
          <button
            onClick={resetErrorBoundary}
            className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors"
          >
            Tentar novamente
          </button>
          {process.env.NODE_ENV === 'development' && (
            <details className="mt-4 text-left">
              <summary className="cursor-pointer text-red-700 font-medium">
                Detalhes do erro (desenvolvimento)
              </summary>
              <pre className="mt-2 text-xs text-red-600 bg-red-100 p-2 rounded overflow-auto">
                {error.message}
              </pre>
            </details>
          )}
        </div>
      </div>
    </div>
  );
}

// Main lazy route wrapper
export function LazyRoute({ children, fallback }: LazyRouteProps) {
  return (
    <ErrorBoundary FallbackComponent={RouteErrorFallback} onReset={() => window.location.reload()}>
      <Suspense fallback={fallback || <RouteLoadingSpinner />}>{children}</Suspense>
    </ErrorBoundary>
  );
}

// Higher-order component for lazy loading routes
export function withLazyLoading<T extends {}>(
  Component: React.ComponentType<T>,
  displayName?: string
) {
  const WrappedComponent = (props: T) => (
    <LazyRoute>
      <Component {...props} />
    </LazyRoute>
  );

  WrappedComponent.displayName =
    displayName || `LazyLoaded(${Component.displayName || Component.name})`;

  return WrappedComponent;
}

// Utility for creating lazy components with better error handling
export function createLazyComponent<T extends Record<string, any>>(
  factory: () => Promise<{ default: React.ComponentType<T> }>
) {
  const LazyComponent = React.lazy(factory);

  return (props: T) => (
    <LazyRoute>
      <LazyComponent {...props} />
    </LazyRoute>
  );
}

export default LazyRoute;
