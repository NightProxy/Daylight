import React, { ReactNode } from 'react';

interface ErrorBoundaryProps {
  children: ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
}

class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: any): ErrorBoundaryState {
    return { hasError: true };
  }

  componentDidCatch(error: any, errorInfo: any) {
    console.error("Error caught by Error Boundary: ", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <>
        <h1 className="horizon"><p className="horizon-outline">Something</p> went wrong.</h1>
        <br />
        <h3>Check the console for any errors and report them to Daylight's developers. We're sorry for any inconvenience this may have caused.</h3>
        </>
        
      )
      
    }
    return this.props.children; 
  }
}

export default ErrorBoundary;
