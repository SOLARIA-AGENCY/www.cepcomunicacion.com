/**
 * PageErrorBoundary Component
 *
 * Specialized error boundary for page-level components.
 * Provides a user-friendly fallback UI with navigation options.
 *
 * @example
 * <PageErrorBoundary>
 *   <CoursesPage />
 * </PageErrorBoundary>
 */

import { ReactNode } from 'react';
import { Link } from 'react-router-dom';
import { ErrorBoundary } from './ErrorBoundary';

export interface PageErrorBoundaryProps {
  /**
   * Child components to render
   */
  children: ReactNode;

  /**
   * Keys that will trigger a reset when changed
   */
  resetKeys?: Array<string | number>;
}

/**
 * Page Error Boundary
 *
 * Wraps page components with error handling.
 * Provides navigation options and user-friendly error messages.
 */
export function PageErrorBoundary({ children, resetKeys }: PageErrorBoundaryProps) {
  const fallback = (error: Error, reset: () => void) => (
    <div className="min-h-screen flex items-center justify-center bg-neutral-50 py-12">
      <div className="container">
        <div className="max-w-2xl mx-auto text-center">
          {/* Error Icon */}
          <div className="inline-flex items-center justify-center w-24 h-24 bg-red-100 rounded-full mb-6">
            <svg
              className="w-12 h-12 text-red-600"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
              />
            </svg>
          </div>

          {/* Error Message */}
          <h1 className="text-4xl font-bold text-neutral-900 mb-4">
            Algo salió mal
          </h1>
          <p className="text-xl text-neutral-600 mb-8">
            Lo sentimos, ha ocurrido un error inesperado al cargar esta página.
            Por favor, intenta de nuevo o vuelve a la página principal.
          </p>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={reset}
              className="btn-primary inline-flex items-center justify-center"
            >
              <svg
                className="w-5 h-5 mr-2"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                />
              </svg>
              Reintentar
            </button>
            <a
              href="/"
              className="btn-secondary inline-flex items-center justify-center"
            >
              <svg
                className="w-5 h-5 mr-2"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
                />
              </svg>
              Volver al Inicio
            </a>
          </div>

          {/* Help Text */}
          <div className="mt-8 pt-8 border-t border-neutral-200">
            <p className="text-sm text-neutral-500">
              Si el problema persiste, por favor{' '}
              <Link to="/contacto" className="text-primary hover:underline font-semibold">
                contáctanos
              </Link>{' '}
              y te ayudaremos a resolverlo.
            </p>
          </div>

          {/* Error Details (Development Only) */}
          {import.meta.env.DEV && (
            <details className="mt-8 text-left">
              <summary className="cursor-pointer text-sm text-neutral-500 hover:text-neutral-700 font-semibold">
                📋 Detalles técnicos del error (solo visible en desarrollo)
              </summary>
              <div className="mt-4 p-6 bg-red-50 rounded-lg">
                <h3 className="text-sm font-semibold text-red-800 mb-2">
                  Error Message:
                </h3>
                <p className="text-sm text-red-700 mb-4 font-mono">{error.message}</p>

                <h3 className="text-sm font-semibold text-red-800 mb-2">
                  Stack Trace:
                </h3>
                <pre className="text-xs text-red-700 overflow-auto whitespace-pre-wrap font-mono">
                  {error.stack}
                </pre>
              </div>
            </details>
          )}
        </div>
      </div>
    </div>
  );

  return (
    <ErrorBoundary
      fallback={fallback}
      resetKeys={resetKeys}
      onError={(error, errorInfo) => {
        // Log error to console in development
        if (import.meta.env.DEV) {
          console.error('Page Error:', error);
          console.error('Component Stack:', errorInfo.componentStack);
        }

        // TODO: In production, log to error tracking service
        // Example: Sentry.captureException(error, { extra: errorInfo });
      }}
    >
      {children}
    </ErrorBoundary>
  );
}
