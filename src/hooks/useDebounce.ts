import { useState, useEffect } from 'react';

/**
 * Custom React hook to debounce state changes, preventing expensive re-renders
 * and API over-fetching during rapid user keystrokes.
 *
 * @template T
 * @param {T} value - The input value to debounce.
 * @param {number} delayMs - Delay duration in milliseconds (default: 300ms).
 * @returns {T} The debounced value.
 *
 * @example
 * const debouncedSearchQuery = useDebounce(searchTerm, 400);
 */
export function useDebounce<T>(value: T, delayMs: number = 300): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delayMs);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delayMs]);

  return debouncedValue;
}
