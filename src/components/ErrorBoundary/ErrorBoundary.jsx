import React from 'react';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    this.setState({ error, errorInfo });
    // Qui potresti anche loggare l'errore su un servizio di reporting
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="error-boundary">
          <h1>Oops, qualcosa è andato storto.</h1>
          <p>Ci scusiamo per l'inconveniente. Per favore, ricarica la pagina o contatta il supporto se il problema persiste.</p>
          {process.env.NODE_ENV === 'development' && (
            <details style={{ whiteSpace: 'pre-wrap' }}>
              {this.state.error && this.state.error.toString()}
              <br />
              {this.state.errorInfo.componentStack}
            </details>
          )}
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;