import { Component, ErrorInfo, ReactNode } from "react";
import ApplicationErrorMessage from "../components/ApplicationErrorMessage";
import { CopyToClipboard } from "../components/ui/CopyToClipboard";
import { ErrorLogger } from "../unities/ErrorLog/ErrorLogger";

interface ErrorBoundaryProps {
  children: ReactNode;
  fallback?: ReactNode;
  message?: "";
}

interface ErrorBoundaryState {
  hasError: boolean;
  error?: Error;
  copied?: boolean;
}

export class ErrorBoundary extends Component<
  ErrorBoundaryProps,
  ErrorBoundaryState
> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false, copied: false };
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    ErrorLogger.log(error, "Uncaught Error");
    console.error("⚠️ Uncaught error:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }
      return (
        <div>
          <ApplicationErrorMessage message={this.props.message || ""} />
          {this.state.error && (
            <div style={{ marginTop: 16 }}>
              <CopyToClipboard
                textToCopy={[
                  `Error: ${this.state.error?.message}`,
                  this.state.error?.stack
                    ? `\nStack:\n${this.state.error.stack}`
                    : "",
                ].join("\n")}
              >
                Copy Error details
              </CopyToClipboard>

              {this.state.copied && (
                <span style={{ marginLeft: 8, color: "green" }}>Copied!</span>
              )}
            </div>
          )}
        </div>
      );
    }
    return this.props.children;
  }
}

export default ErrorBoundary;
