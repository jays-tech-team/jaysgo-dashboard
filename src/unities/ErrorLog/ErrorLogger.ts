export interface IErrorLogs {
  context: string;
  message: string;
  timestamp: string;
  stack: string;
  response?: string;
  apiURL?: string;
  requestBody?: string;
}

/**
 * A utility class for logging, retrieving, and clearing error logs in the browser's sessionStorage. only last 10 error.
 *
 * The `ErrorLogger` class provides static methods to:
 * - Log errors with contextual information and stack traces.
 * - Retrieve all stored error logs.
 * - Clear all error logs from sessionStorage.
 *
 * Error logs are stored as an array of objects, each containing a timestamp, context, message, and stack trace.
 * The logs are persisted in sessionStorage under the key `"errorLogs"`.
 *
 * Example usage:
 * ```typescript
 * try {
 *   // some code that may throw
 * } catch (error) {
 *   ErrorLogger.log(error, "MyComponent");
 * }
 *
 * const logs = ErrorLogger.getLogs();
 * ErrorLogger.clearLogs();
 * ```
 */
export class ErrorLogger {
  static log(
    error: Error,
    context: string = "Unknown",
    apiURL: string = "",
    response: string = "",
    requestBody: string = ""
  ) {
    try {
      const previousLogs = this.getLogsSafe();

      const newLog: IErrorLogs = {
        timestamp: new Date().toISOString(),
        context,
        response,
        apiURL,
        message: error?.message || String(error),
        stack: error?.stack || "",
        requestBody,
      };

      const updatedLogs = [...previousLogs, newLog].slice(-12); //only add last 10 error
      sessionStorage.setItem("errorLogs", JSON.stringify(updatedLogs));
    } catch (storageError) {
      console.error("Error writing to sessionStorage:", storageError);
    }
  }

  static getLogs(): IErrorLogs[] {
    return this.getLogsSafe();
  }

  static clearLogs() {
    try {
      sessionStorage.removeItem("errorLogs");
    } catch (error) {
      console.error("Error clearing sessionStorage:", error);
    }
  }

  private static getLogsSafe(): IErrorLogs[] {
    try {
      const raw = sessionStorage.getItem("errorLogs");
      return raw ? JSON.parse(raw) : [];
    } catch (error) {
      console.error("Error reading from sessionStorage:", error);
      return [];
    }
  }
}
