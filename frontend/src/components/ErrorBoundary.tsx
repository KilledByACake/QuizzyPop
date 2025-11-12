import React, { Component, type ReactNode } from "react";

import Error from "./Error";

interface Props {
  children: ReactNode;
  fallbackMessage?: string;
}

interface State {
  hasError: boolean;
  errorMessage?: string;
}

export default class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false, errorMessage: undefined };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, errorMessage: error.message };
  }

  componentDidCatch(error: Error, info: React.ErrorInfo) {
    console.error("ErrorBoundary caught an error:", error, info);
    // her kan du evt. logge til backend med fetch('/api/log', {...})
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
