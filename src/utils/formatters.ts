import { CurrencyCode } from '../types/event';
import { CURRENCIES } from '../constants/categories';

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

export function formatPercentage(part: number, total: number): number {
  if (!total || total <= 0) return 0;
  return Math.min(100, Math.round((part / total) * 100));
}
