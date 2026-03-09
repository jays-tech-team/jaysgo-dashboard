/**
 * Creates a debounced version of the provided function that delays its execution until after
 * a specified wait time has elapsed since the last time it was invoked.
 *
 * @typeParam T - The type of the function to debounce.
 * @param func - The function to debounce.
 * @param wait - The number of milliseconds to delay.
 * @returns A debounced function that delays invoking `func` until after `wait` milliseconds have elapsed since the last invocation.
 *
 * @example
 * ```typescript
 * const debouncedLog = debounce(console.log, 300);
 * debouncedLog('Hello');
 * debouncedLog('World'); // Only 'World' will be logged after 300ms
 * ```
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeOut: number;

  return function executedFunction(...args: Parameters<T>) {
    const later = () => {
      clearTimeout(timeOut);
      func(...args);
    };

    clearTimeout(timeOut);
    timeOut = window.setTimeout(later, wait);
  };
}
