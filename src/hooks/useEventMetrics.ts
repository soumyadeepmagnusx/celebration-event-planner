import { useMemo } from 'react';
import { EventData } from '../types/event';
import { calculateBudgetMetrics, calculateTimelineMetrics, calculateVendorMetrics, calculateEventReadiness } from '../utils/calculations';
import { calculateDaysRemaining } from '../utils/formatters';

/**
 * Custom aggregation hook that memoizes all event health, financial,
 * and operational milestones to eliminate redundant O(N) calculations.
 *
 * @param {EventData} event - The active celebration event object.
 * @returns {object} Memoized analytics and execution metrics.
 */
export function useEventMetrics(event: EventData) {
  return useMemo(() => {
    const budget = calculateBudgetMetrics(event);
    const timeline = calculateTimelineMetrics(event);
    const vendors = calculateVendorMetrics(event);
    const countdown = calculateDaysRemaining(event.date);
    const readiness = calculateEventReadiness(event);

    return {
      budget,
      timeline,
      vendors,
      countdown,
      readiness,
      isFullyReady: readiness >= 100,
    };
  }, [event]);
}
