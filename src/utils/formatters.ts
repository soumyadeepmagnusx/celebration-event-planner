import { CurrencyCode } from '../types/event';
import { CURRENCIES } from '../constants/categories';

/**
 * Formats a numeric monetary quantity into an international localized currency string.
 *
 * @param {number} amount - The numeric monetary value to format.
 * @param {CurrencyCode} [currency='USD'] - Target currency symbol/code (USD, INR, EUR, GBP).
 * @returns {string} Fully localized monetary representation (e.g. "$25,000", "₹50,000").
 *
 * @example
 * formatCurrency(68000, 'USD'); // "$68,000"
 * formatCurrency(500000, 'INR'); // "₹500,000"
 */
export function formatCurrency(amount: number, currency: CurrencyCode = 'USD'): string {
  const config = CURRENCIES[currency] || CURRENCIES.USD;
  try {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: config.code,
      maximumFractionDigits: 0,
    }).format(amount);
  } catch {
    return `${config.symbol}${amount.toLocaleString()}`;
  }
}

/**
 * Parses and formats ISO date strings into human-readable medium dates.
 *
 * @param {string} dateString - ISO-8601 or standard date format string.
 * @returns {string} Formatted date (e.g. "Sep 19, 2026") or original string if invalid.
 *
 * @example
 * formatDate("2026-09-19T17:00:00"); // "Sep 19, 2026"
 */
export function formatDate(dateString: string): string {
  if (!dateString) return '';
  const date = new Date(dateString);
  if (isNaN(date.getTime())) return dateString;
  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  }).format(date);
}

/**
 * Computes calendar day variance between current epoch time and target celebration date.
 *
 * @param {string} targetDate - The target event date string.
 * @returns {{ days: number; isPast: boolean; label: string }} Countdown telemetry.
 *
 * @example
 * calculateDaysRemaining("2026-12-31"); // { days: 63, isPast: false, label: "63 days to go" }
 */
export function calculateDaysRemaining(targetDate: string): { days: number; isPast: boolean; label: string } {
  if (!targetDate) return { days: 0, isPast: false, label: 'Date not set' };
  
  const target = new Date(targetDate).getTime();
  const now = new Date().getTime();
  const diffTime = target - now;
  const days = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  
  if (days < 0) {
    return { days: Math.abs(days), isPast: true, label: `${Math.abs(days)} days ago` };
  } else if (days === 0) {
    return { days: 0, isPast: false, label: 'Today!' };
  } else if (days === 1) {
    return { days: 1, isPast: false, label: 'Tomorrow!' };
  } else {
    return { days, isPast: false, label: `${days} days to go` };
  }
}

/**
 * Safely computes an integer percentage ratio clamped between 0 and 100.
 *
 * @param {number} part - Numerator value.
 * @param {number} total - Denominator value.
 * @returns {number} Integer between 0 and 100.
 */
export function formatPercentage(part: number, total: number): number {
  if (!total || total <= 0) return 0;
  return Math.min(100, Math.round((part / total) * 100));
}
