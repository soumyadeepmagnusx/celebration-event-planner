import { useState, useEffect } from 'react';

/**
 * Type-safe persistent state hook that synchronizes React state with browser localStorage.
 * Handles JSON serialization, SSR/environment safety, and storage error contingencies.
 *
 * @template T
 * @param {string} key - The localStorage storage key.
 * @param {T} initialValue - Fallback value if no key exists in storage.
 * @returns {[T, (value: T | ((val: T) => T)) => void]} State value and setter tuple.
 *
 * @example
 * const [isMuted, setIsMuted] = useLocalStorage<boolean>('celebratify_audio_muted', false);
 */
export function useLocalStorage<T>(key: string, initialValue: T): [T, (value: T | ((val: T) => T)) => void] {
  const [storedValue, setStoredValue] = useState<T>(() => {
    try {
      if (typeof window === 'undefined') return initialValue;
      const item = window.localStorage.getItem(key);
      return item ? (JSON.parse(item) as T) : initialValue;
    } catch (error) {
      console.warn(`[useLocalStorage] Read error for key "${key}":`, error);
      return initialValue;
    }
  });

  useEffect(() => {
    try {
      if (typeof window !== 'undefined') {
        window.localStorage.setItem(key, JSON.stringify(storedValue));
      }
    } catch (error) {
      console.warn(`[useLocalStorage] Write error for key "${key}":`, error);
    }
  }, [key, storedValue]);

  return [storedValue, setStoredValue];
}
