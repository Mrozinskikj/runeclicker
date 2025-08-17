import React from 'react';
import { renderError } from './errorScreen';

type Props = { children: React.ReactNode };
type State = { error: unknown | null };

export class AppErrorBoundary extends React.Component<Props, State> {
  state: State = { error: null };

  static getDerivedStateFromError(error: unknown) {
    return { error };
  }

  componentDidCatch(error: unknown, info: unknown) {
    // optional: log somewhere
    console.error('React error boundary caught:', error, info);
  }

  componentDidMount() {
    // Listen for fatal app-wide errors from outside React
    window.addEventListener('app:fatal', this.handleFatalEvent as EventListener);
  }
  componentWillUnmount() {
    window.removeEventListener('app:fatal', this.handleFatalEvent as EventListener);
  }
  private handleFatalEvent = (e: CustomEvent) => {
    this.setState({ error: e.detail ?? new Error('Unknown fatal error') });
  };

  render() {
    if (this.state.error) {
      // Use your existing renderer
      return renderError(this.state.error);
    }
    return this.props.children;
  }
}