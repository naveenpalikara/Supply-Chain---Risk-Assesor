import React from 'react';

interface State {
  hasError: boolean;
  error?: Error | null;
  info?: React.ErrorInfo | null;
}

class ErrorBoundary extends React.Component<React.PropsWithChildren<{}>, State> {
  constructor(props: React.PropsWithChildren<{}>) {
    super(props);
    this.state = { hasError: false, error: null, info: null };
  }

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, info: React.ErrorInfo) {
    this.setState({ error, info });
    // eslint-disable-next-line no-console
    console.error('Caught by ErrorBoundary:', error, info);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center p-6 bg-white">
          <div className="max-w-3xl w-full">
            <h1 className="text-2xl font-bold mb-2 text-red-700">Application Error</h1>
            <div className="bg-red-50 border border-red-200 rounded p-4 mb-4">
              <div className="text-sm text-red-800 font-medium">{this.state.error?.message}</div>
            </div>
            <details className="bg-gray-50 border rounded p-3 text-xs text-gray-700">
              <summary className="cursor-pointer font-medium">Stack trace / component tree</summary>
              <pre className="whitespace-pre-wrap mt-2">{this.state.info?.componentStack}</pre>
            </details>
          </div>
        </div>
      );
    }

    return this.props.children as React.ReactElement;
  }
}

export default ErrorBoundary;
