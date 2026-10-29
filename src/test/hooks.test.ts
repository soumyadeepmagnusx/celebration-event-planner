import { describe, it, expect } from 'vitest';
import { renderHook } from '@testing-library/react';
import { useEventMetrics } from '../hooks/useEventMetrics';
import { EventData } from '../types/event';

const mockEvent: EventData = {
  id: 'evt-hooks-test',
  title: 'Ruby Jubilee Gala',
  type: 'anniversary',
  date: '2027-01-01',
  location: 'Metropolitan Hall',
  guestCount: 150,
  totalBudget: 25000,
  currency: 'USD',
  createdAt: '2026-10-01',
  updatedAt: '2026-10-01',
  budgetItems: [
    { id: '1', category: 'venue', name: 'Grand Ballroom', estimatedCost: 10000, actualCost: 9500, paid: true },
    { id: '2', category: 'catering', name: 'Gourmet Buffet', estimatedCost: 8000, actualCost: 8000, paid: true },
  ],
  milestones: [
    { id: 'm1', title: 'Contract Signed', description: '', phase: '6_months', dueDate: '2026-07-01', completed: true, category: 'venue', priority: 'high' },
    { id: 'm2', title: 'Invitations Sent', description: '', phase: '3_months', dueDate: '2026-10-01', completed: true, category: 'general', priority: 'medium' },
  ],
  runOfShow: [],
  vendors: [
    { id: 'v1', name: 'Grand Ballroom', category: 'venue', status: 'booked', estimatedCost: 10000, quoteAmount: 9500, depositPaid: 5000 },
  ],
  themes: [],
  invitations: [{ id: 'inv1', tone: 'formal', headline: 'Join us for the Ruby Jubilee', body: 'You are cordially invited.', rsvpWording: 'Please RSVP by Dec 1st.', dressCodeNotice: 'Black Tie Optional' }],
  menus: [],
  entertainment: [],
  speeches: [],
  contingencies: [],
};

describe('Custom Hooks Architecture', () => {
  it('useEventMetrics accurately aggregates financial and milestone status', () => {
    const { result } = renderHook(() => useEventMetrics(mockEvent));

    expect(result.current.budget.totalBudget).toBe(25000);
    expect(result.current.budget.totalActual).toBe(17500);
    expect(result.current.budget.isOverBudget).toBe(false);
    expect(result.current.timeline.percentage).toBe(100);
    expect(result.current.vendors.booked).toBe(1);
    expect(result.current.readiness).toBeGreaterThan(50);
  });
});
