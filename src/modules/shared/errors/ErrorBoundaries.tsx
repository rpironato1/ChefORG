import React, { Component, ErrorInfo, ReactNode } from 'react';

interface Props {
  children: ReactNode;
  moduleName: string;
  fallback?: ReactNode;
  onError?: (error: Error, errorInfo: ErrorInfo) => void;
}

interface State {
  hasError: boolean;
  error?: Error;
  errorInfo?: ErrorInfo;
}

// Base error boundary for all modules
export class ModuleErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error(`Error in ${this.props.moduleName} module:`, error, errorInfo);

    this.setState({
      error,
      errorInfo,
    });

    // Call custom error handler if provided
    if (this.props.onError) {
      this.props.onError(error, errorInfo);
    }

    // Send error to monitoring service in production
    if (process.env.NODE_ENV === 'production') {
      this.reportError(error, errorInfo);
    }
  }

  private reportError = (error: Error, errorInfo: ErrorInfo) => {
    // TODO: Integrate with error monitoring service (Sentry, LogRocket, etc.)
    console.error('Production error reported:', {
      module: this.props.moduleName,
      error: error.message,
      stack: error.stack,
      componentStack: errorInfo.componentStack,
    });
  };

  private handleRetry = () => {
    this.setState({ hasError: false, error: undefined, errorInfo: undefined });
  };

  render() {
    if (this.state.hasError) {
      // Use custom fallback if provided
      if (this.props.fallback) {
        return this.props.fallback;
      }

      // Default error UI
      return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
          <div className="max-w-md w-full space-y-8">
            <div className="text-center">
              <div className="mx-auto h-16 w-16 text-red-500 mb-4">
                <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"
                  />
                </svg>
              </div>
              <h2 className="mt-6 text-3xl font-extrabold text-gray-900">Ops! Algo deu errado</h2>
              <p className="mt-2 text-sm text-gray-600">
                Ocorreu um erro no módulo <strong>{this.props.moduleName}</strong>
              </p>

              {process.env.NODE_ENV === 'development' && this.state.error && (
                <details className="mt-4 text-left">
                  <summary className="cursor-pointer text-sm text-gray-500 hover:text-gray-700">
                    Detalhes do erro (desenvolvimento)
                  </summary>
                  <pre className="mt-2 text-xs text-red-600 bg-red-50 p-2 rounded overflow-auto max-h-40">
                    {this.state.error.message}
                    {this.state.error.stack}
                  </pre>
                </details>
              )}
            </div>

            <div className="space-y-4">
              <button
                onClick={this.handleRetry}
                className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-orange-600 hover:bg-orange-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500"
              >
                Tentar novamente
              </button>

              <button
                onClick={() => window.location.reload()}
                className="group relative w-full flex justify-center py-2 px-4 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500"
              >
                Recarregar página
              </button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

// Specific error boundaries for different modules

export const ReservationsErrorBoundary: React.FC<{ children: ReactNode }> = ({ children }) => (
  <ModuleErrorBoundary moduleName="Reservas">{children}</ModuleErrorBoundary>
);

export const TablesErrorBoundary: React.FC<{ children: ReactNode }> = ({ children }) => (
  <ModuleErrorBoundary moduleName="Mesas">{children}</ModuleErrorBoundary>
);

export const MenuErrorBoundary: React.FC<{ children: ReactNode }> = ({ children }) => (
  <ModuleErrorBoundary moduleName="Menu">{children}</ModuleErrorBoundary>
);

export const OrdersErrorBoundary: React.FC<{ children: ReactNode }> = ({ children }) => (
  <ModuleErrorBoundary moduleName="Pedidos">{children}</ModuleErrorBoundary>
);

export const PaymentsErrorBoundary: React.FC<{ children: ReactNode }> = ({ children }) => (
  <ModuleErrorBoundary moduleName="Pagamentos">{children}</ModuleErrorBoundary>
);

export const AuthErrorBoundary: React.FC<{ children: ReactNode }> = ({ children }) => (
  <ModuleErrorBoundary moduleName="Autenticação">{children}</ModuleErrorBoundary>
);

// Higher-order component for wrapping components with error boundaries
export const withErrorBoundary = <P extends object>(
  Component: React.ComponentType<P>,
  moduleName: string
) => {
  const WrappedComponent = (props: P) => (
    <ModuleErrorBoundary moduleName={moduleName}>
      <Component {...props} />
    </ModuleErrorBoundary>
  );

  WrappedComponent.displayName = `withErrorBoundary(${Component.displayName || Component.name})`;

  return WrappedComponent;
};
