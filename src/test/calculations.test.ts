import { describe, it, expect } from 'vitest';
import { calculateBudgetMetrics, calculateMilestoneMetrics, calculateVendorMetrics } from '../utils/calculations';
import { EventData } from '../types/event';

describe('Event Calculations & Metrics', () => {
  const sampleEvent: EventData = {
    id: 'test-evt',
    title: 'Silver Anniversary Celebration',
    type: 'anniversary',
    date: '2026-12-15',
    location: 'Hilltop Terrace',
    guestCount: 80,
    totalBudget: 10000,
    currency: 'USD',
    createdAt: '2026-10-01',
    updatedAt: '2026-10-01',
    budgetItems: [
      { id: '1', category: 'venue', name: 'Terrace Rental', estimatedCost: 3000, actualCost: 3200, paid: true },
      { id: '2', category: 'catering', name: 'Plated Dinner', estimatedCost: 4000, actualCost: 3800, paid: false },
      { id: '3', category: 'decor', name: 'Floral Arches', estimatedCost: 1500, actualCost: 0, paid: false },
    ],
    milestones: [
      { id: 'm1', title: 'Sign Venue Contract', description: '', phase: '6_months', dueDate: '2026-06-01', completed: true, category: 'venue', priority: 'high' },
      { id: 'm2', title: 'Tasting Session', description: '', phase: '3_months', dueDate: '2026-09-01', completed: true, category: 'catering', priority: 'medium' },
      { id: 'm3', title: 'Final Guest Count', description: '', phase: '1_week', dueDate: '2026-12-08', completed: false, category: 'general', priority: 'high' },
      { id: 'm4', title: 'Distribute Schedule', description: '', phase: '1_week', dueDate: '2026-12-10', completed: false, category: 'general', priority: 'low' },
    ],
    runOfShow: [],
    vendors: [
      { id: 'v1', name: 'Hilltop Terrace', category: 'venue', status: 'booked', estimatedCost: 3000, quoteAmount: 3200, depositPaid: 1500 },
      { id: 'v2', name: 'Chef Andre', category: 'catering', status: 'quoted', estimatedCost: 4000, quoteAmount: 3800, depositPaid: 0 },
      { id: 'v3', name: 'Petal Dreams', category: 'florist', status: 'researching', estimatedCost: 1500, quoteAmount: 0, depositPaid: 0 },
    ],
    themes: [],
    invitations: [],
    menus: [],
    entertainment: [],
    speeches: [],
    contingencies: [],
  };

  it('calculates budget metrics correctly', () => {
    const metrics = calculateBudgetMetrics(sampleEvent);
    expect(metrics.totalBudget).toBe(10000);
    expect(metrics.totalEstimated).toBe(8500); // 3000 + 4000 + 1500
    expect(metrics.totalActual).toBe(7000); // 3200 + 3800 + 0
    expect(metrics.totalPaid).toBe(3200); // Only item 1 is paid
    expect(metrics.isOverBudget).toBe(false);
    expect(metrics.variance).toBe(3000); // 10000 - 7000
    expect(metrics.categoryBreakdown.length).toBeGreaterThanOrEqual(3);
  });

  it('detects when an event is over budget', () => {
    const overBudgetEvent: EventData = {
      ...sampleEvent,
      totalBudget: 5000,
      budgetItems: [
        { id: '1', category: 'venue', name: 'Terrace', estimatedCost: 6000, actualCost: 6500, paid: true },
      ],
    };
    const metrics = calculateBudgetMetrics(overBudgetEvent);
    expect(metrics.isOverBudget).toBe(true);
    expect(metrics.variance).toBe(-1500);
  });

  it('calculates milestone metrics and percentages accurately', () => {
    const metrics = calculateMilestoneMetrics(sampleEvent);
    expect(metrics.total).toBe(4);
    expect(metrics.completed).toBe(2);
    expect(metrics.pending).toBe(2);
    expect(metrics.highPriorityPending).toBe(1); // m3 is high priority pending
    expect(metrics.percentage).toBe(50); // 2 out of 4 = 50%
  });

  it('calculates vendor pipeline metrics', () => {
    const metrics = calculateVendorMetrics(sampleEvent);
    expect(metrics.total).toBe(3);
    expect(metrics.booked).toBe(1);
    expect(metrics.quoted).toBe(1);
    expect(metrics.researching).toBe(1);
    expect(metrics.totalCommittedAmount).toBe(3200);
    expect(metrics.totalDepositPaid).toBe(1500);
  });
});
