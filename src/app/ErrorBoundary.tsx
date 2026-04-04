import { Component, ErrorInfo, ReactNode } from 'react';

import { analyticsActor } from '@/lib/analytics-actor';
import { Sentry } from '@/lib/sentry';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
}

export class ErrorBoundary extends Component<Props, State> {
  state: State = { hasError: false };

  static getDerivedStateFromError(): State {
    return { hasError: true };
  }

  componentDidCatch(error: Error, info: ErrorInfo): void {
    Sentry.captureException(error, {
      contexts: { react: { componentStack: info.componentStack } },
    });

    analyticsActor.send({
      type: 'LOG_EVENT',
      name: 'UNCAUGHT_RENDER_ERROR',
      payload: {
        message: error.message,
        stack: error.stack,
        componentStack: info.componentStack,
      },
    });
  }

  render(): ReactNode {
    if (this.state.hasError) {
      if ('fallback' in this.props) {
        return this.props.fallback;
      }

      return (
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            height: '100vh',
            fontFamily: 'sans-serif',
            gap: '12px',
          }}
        >
          <h2>Something went wrong</h2>
          <p style={{ color: '#666' }}>Try refreshing the page. Your progress has been saved.</p>
          <button onClick={() => window.location.reload()}>Refresh</button>
        </div>
      );
    }

    return this.props.children;
  }
}
