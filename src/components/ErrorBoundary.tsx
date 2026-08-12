import { Component, type ErrorInfo, type ReactNode } from "react";

interface ErrorBoundaryProps {
  children: ReactNode;
}

interface ErrorBoundaryState {
  error: Error | null;
}

export class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  public override state: ErrorBoundaryState = { error: null };

  public static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { error };
  }

  public override componentDidCatch(error: Error, info: ErrorInfo): void {
    console.error("Unhandled error in component tree:", error, info.componentStack);
  }

  private handleReload = (): void => {
    window.location.href = "/";
  };

  public override render(): ReactNode {
    if (this.state.error) {
      return (
        <div className="flex min-h-screen flex-col items-center justify-center gap-4 px-6 text-center">
          <p className="text-pencil font-mono text-xs uppercase">Something went wrong</p>
          <h1 className="font-display text-2xl">Style Lab hit an unexpected error.</h1>
          <p className="text-bone/70 max-w-sm text-sm">
            Try reloading. If it keeps happening, the console has more detail.
          </p>
          <button
            type="button"
            onClick={this.handleReload}
            className="bg-index text-bone mt-2 px-5 py-2.5 text-sm font-medium transition-opacity hover:opacity-90"
          >
            Back to start
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}