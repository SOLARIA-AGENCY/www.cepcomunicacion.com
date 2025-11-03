/**
 * ErrorBoundary Component
 *
 * Generic error boundary that catches JavaScript errors in child component tree.
 * Logs error information and displays a fallback UI.
 *
 * React Error Boundaries: https://react.dev/reference/react/Component#catching-rendering-errors-with-an-error-boundary
 *
 * @example
 * <ErrorBoundary fallback={<div>Something went wrong</div>}>
 *   <MyComponent />
 * </ErrorBoundary>
 */

import { Component } from 'react';
import type { ReactNode, ErrorInfo } from 'react';

export interface ErrorBoundaryProps {
  /**
   * Child components to render
   */
  children: ReactNode;

  /**
   * Fallback UI to render when an error is caught
   */
  fallback?: ReactNode | ((error: Error, reset: () => void) => ReactNode);

  /**
   * Callback function called when an error is caught
   */
  onError?: (error: Error, errorInfo: ErrorInfo) => void;

  /**
   * Keys that will trigger a reset when changed
   * Useful for resetting when route changes or data updates
   */
  resetKeys?: Array<string | number>;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}

/**
 * Generic Error Boundary component
 *
 * Catches errors in the component tree and displays fallback UI.
 * Must be a class component as componentDidCatch is not available in function components.
 */
export class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
    };
  }

  /**
   * Update state when an error is caught
   */
  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return {
      hasError: true,
      error,
    };
  }

  /**
   * Log error information
   */
  componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
    // Log to console in development
    if (import.meta.env.DEV) {
      console.error('ErrorBoundary caught an error:', error);
      console.error('Error Info:', errorInfo);
      console.error('Component Stack:', errorInfo.componentStack);
    }

    // Call onError callback if provided
    if (this.props.onError) {
      this.props.onError(error, errorInfo);
    }

    // TODO: In production, send error to logging service
    // Example: logErrorToService(error, errorInfo);
  }

  /**
   * Reset error boundary state
   * Allows user to retry rendering the component tree
   */
  resetErrorBoundary = (): void => {
    this.setState({
      hasError: false,
      error: null,
    });
  };

  /**
   * Reset when resetKeys change
   */
  componentDidUpdate(prevProps: ErrorBoundaryProps): void {
    const { resetKeys } = this.props;
    const { hasError } = this.state;

    // Reset if resetKeys have changed and we currently have an error
    if (hasError && resetKeys && prevProps.resetKeys) {
      const hasResetKeyChanged = resetKeys.some(
        (key, index) => key !== prevProps.resetKeys?.[index]
      );

      if (hasResetKeyChanged) {
        this.resetErrorBoundary();
      }
    }
  }

  render(): ReactNode {
    const { hasError, error } = this.state;
    const { children, fallback } = this.props;

    if (hasError && error) {
      // Render fallback UI
      if (typeof fallback === 'function') {
        return fallback(error, this.resetErrorBoundary);
      }

      if (fallback) {
        return fallback;
      }

      // Default fallback UI
      return (
        <div className="container py-12 text-center">
          <div className="max-w-md mx-auto">
            <svg
              className="mx-auto h-16 w-16 text-red-500 mb-4"
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
            <h1 className="text-2xl font-bold text-neutral-900 mb-2">
              Ha ocurrido un error
            </h1>
            <p className="text-neutral-600 mb-6">
              Lo sentimos, algo salió mal. Por favor, intenta de nuevo.
            </p>
            <button onClick={this.resetErrorBoundary} className="btn-primary">
              Reintentar
            </button>
            {import.meta.env.DEV && (
              <details className="mt-6 text-left">
                <summary className="cursor-pointer text-sm text-neutral-500 hover:text-neutral-700">
                  Detalles del error (solo en desarrollo)
                </summary>
                <pre className="mt-2 p-4 bg-red-50 text-red-800 text-xs overflow-auto rounded">
                  {error.toString()}
                  {'\n\n'}
                  {error.stack}
                </pre>
              </details>
            )}
          </div>
        </div>
      );
    }

    return children;
  }
}
