import React, { Component, type ReactNode } from "react";

import Error from "./Error";

interface Props {
  children: ReactNode;
  // Optional custom error message to display instead of the caught error message
  fallbackMessage?: string;
}

interface State {
  hasError: boolean;
  errorMessage?: string;
}

/**
 * Error boundary component that catches JavaScript errors in child components
 * Displays a fallback UI instead of crashing the entire app
 * Wraps parts of the app to provide graceful error handling
 */
export default class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false, errorMessage: undefined };
  }

  // Called when an error is thrown in a child component
  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, errorMessage: error.message };
  }

  // Lifecycle method for logging errors - called after error is caught
  componentDidCatch(error: Error, info: React.ErrorInfo) {
    console.error("ErrorBoundary caught an error:", error, info);
    // Optional: send error to backend logging service
  }

  render() {
    if (this.state.hasError) {
      return (
        <Error
          message={this.props.fallbackMessage ?? this.state.errorMessage}
          requestId="UI-ERR-001"
        />
      );
    }
    return this.props.children;
  }
}
