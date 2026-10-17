import React, { Component, type ErrorInfo, type ReactNode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App.tsx';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

class RootErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Portfolio Caught Error:', error, errorInfo);
  }

  public render() {
    if (this.state.hasError) {
      return (
        <div
          style={{
            minHeight: '100vh',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '2rem',
            backgroundColor: '#06080d',
            color: '#f8fafc',
            fontFamily: 'sans-serif',
            textAlign: 'center',
          }}
        >
          <h2 style={{ fontSize: '1.75rem', marginBottom: '1rem', color: '#00f2fe' }}>
            Portfolio Initializing
          </h2>
          <p style={{ maxWidth: '500px', color: '#94a3b8', marginBottom: '1.5rem', lineHeight: 1.6 }}>
            {this.state.error?.message || 'A minor initialization issue occurred.'}
          </p>
          <button
            onClick={() => window.location.reload()}
            style={{
              padding: '0.75rem 1.5rem',
              borderRadius: '8px',
              backgroundColor: '#00f2fe',
              color: '#000',
              fontWeight: 600,
              border: 'none',
              cursor: 'pointer',
            }}
          >
            Reload Experience
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}

// Global script error listener
window.addEventListener('error', (event) => {
  console.error('Global Error Detected:', event.error || event.message);
});

const rootElement = document.getElementById('root');
if (rootElement) {
  createRoot(rootElement).render(
    <React.StrictMode>
      <RootErrorBoundary>
        <App />
      </RootErrorBoundary>
    </React.StrictMode>
  );
}
