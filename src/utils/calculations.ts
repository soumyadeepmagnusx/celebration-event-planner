import { EventData, BudgetCategory } from '../types/event';
import { BUDGET_CATEGORIES } from '../constants/categories';

/**
 * Encapsulates computed financial metrics for celebration budgeting.
 */
export interface BudgetMetrics {
  /** Target allocated budget ceiling */
  totalBudget: number;
  /** Aggregate estimated costs across all line items */
  totalEstimated: number;
  /** Actual expenditures booked and finalized */
  totalActual: number;
  /** Liquid cash paid out to date */
  totalPaid: number;
  /** Remaining buffer before hitting ceiling */
  remainingBudget: number;
  /** Positive indicates under-budget; negative indicates deficit */
  variance: number;
  /** Percentage of allocated budget utilized (capped at 150) */
  percentBudgetUsed: number;
  /** Flag denoting whether current spending exceeds target */
  isOverBudget: boolean;
  /** Detailed proportional spending breakdown by category */
  categoryBreakdown: {
    category: BudgetCategory;
    name: string;
    color: string;
    estimated: number;
    actual: number;
    percentOfBudget: number;
  }[];
}

/**
 * Calculates real-time financial metrics, spending variances, and category distributions.
 *
 * @param {EventData} event - The celebration event object.
 * @returns {BudgetMetrics} Computed financial status.
 *
 * @example
 * const metrics = calculateBudgetMetrics(activeEvent);
 * console.log(`Remaining buffer: $${metrics.remainingBudget}`);
 */
export function calculateBudgetMetrics(event: EventData): BudgetMetrics {
  const totalBudget = event.totalBudget || 0;
  
  let totalEstimated = 0;
  let totalActual = 0;
  let totalPaid = 0;

  const categoryMap = new Map<BudgetCategory, { estimated: number; actual: number }>();
  
  BUDGET_CATEGORIES.forEach(cat => {
    categoryMap.set(cat.id, { estimated: 0, actual: 0 });
  });

  event.budgetItems.forEach(item => {
    totalEstimated += item.estimatedCost || 0;
    totalActual += item.actualCost || 0;
    if (item.paid) {
      totalPaid += item.actualCost || item.estimatedCost || 0;
    }

    const current = categoryMap.get(item.category) || { estimated: 0, actual: 0 };
    current.estimated += item.estimatedCost || 0;
    current.actual += item.actualCost || 0;
    categoryMap.set(item.category, current);
  });

  const remainingBudget = totalBudget - (totalActual > 0 ? totalActual : totalEstimated);
  const variance = totalBudget - totalActual;
  const isOverBudget = totalActual > totalBudget || (totalActual === 0 && totalEstimated > totalBudget);
  const effectiveCost = totalActual > 0 ? totalActual : totalEstimated;
  const percentBudgetUsed = totalBudget > 0 ? Math.min(150, Math.round((effectiveCost / totalBudget) * 100)) : 0;

  const categoryBreakdown = BUDGET_CATEGORIES.map(cat => {
    const data = categoryMap.get(cat.id) || { estimated: 0, actual: 0 };
    const cost = data.actual > 0 ? data.actual : data.estimated;
    const percentOfBudget = totalBudget > 0 ? Math.round((cost / totalBudget) * 100) : 0;
    return {
      category: cat.id,
      name: cat.name,
      color: cat.color,
      estimated: data.estimated,
      actual: data.actual,
      percentOfBudget,
    };
  }).filter(c => c.estimated > 0 || c.actual > 0);

  return {
    totalBudget,
    totalEstimated,
    totalActual,
    totalPaid,
    remainingBudget,
    variance,
    percentBudgetUsed,
    isOverBudget,
    categoryBreakdown,
  };
}

/**
 * Metric representation for phased milestone execution.
 */
export interface MilestoneMetrics {
  total: number;
  completed: number;
  pending: number;
  highPriorityPending: number;
  percentage: number;
}

/**
 * Analyzes execution velocity and critical path dependencies for milestone checklists.
 *
 * @param {EventData} event - The celebration event object.
 * @returns {MilestoneMetrics} Progress and velocity breakdown.
 */
export function calculateMilestoneMetrics(event: EventData): MilestoneMetrics {
  const total = event.milestones.length;
  if (total === 0) {
    return { total: 0, completed: 0, pending: 0, highPriorityPending: 0, percentage: 0 };
  }

  const completed = event.milestones.filter(m => m.completed).length;
  const pending = total - completed;
  const highPriorityPending = event.milestones.filter(m => !m.completed && m.priority === 'high').length;
  const percentage = Math.round((completed / total) * 100);

  return {
    total,
    completed,
    pending,
    highPriorityPending,
    percentage,
  };
}

/** Alias for backward compatibility */
export const calculateTimelineMetrics = calculateMilestoneMetrics;

/**
 * Operational vendor tracking metrics across booking pipelines.
 */
export interface VendorMetrics {
  total: number;
  booked: number;
  quoted: number;
  contacted: number;
  researching: number;
  completed: number;
  totalCommittedAmount: number;
  totalDepositPaid: number;
}

/**
 * Aggregates vendor procurement statuses, contractual commitments, and deposit outlays.
 *
 * @param {EventData} event - The celebration event object.
 * @returns {VendorMetrics} Procurement metrics.
 */
export function calculateVendorMetrics(event: EventData): VendorMetrics {
  const total = event.vendors.length;
  let booked = 0;
  let quoted = 0;
  let contacted = 0;
  let researching = 0;
  let completed = 0;
  let totalCommittedAmount = 0;
  let totalDepositPaid = 0;

  event.vendors.forEach(v => {
    if (v.status === 'booked') booked++;
    else if (v.status === 'quoted') quoted++;
    else if (v.status === 'contacted') contacted++;
    else if (v.status === 'researching') researching++;
    else if (v.status === 'completed') completed++;

    const committed = v.quoteAmount > 0 ? v.quoteAmount : v.estimatedCost;
    if (v.status === 'booked' || v.status === 'completed') {
      totalCommittedAmount += committed;
    }
    totalDepositPaid += v.depositPaid || 0;
  });

  return {
    total,
    booked,
    quoted,
    contacted,
    researching,
    completed,
    totalCommittedAmount,
    totalDepositPaid,
  };
}

/**
 * Computes a weighted aggregate Event Readiness Score (0 to 100) based on:
 * - 40% Milestone Completion
 * - 30% Vendor Procurement Confirmation
 * - 20% Budget Stability & Health
 * - 10% Creative Suite Content Generation
 *
 * @param {EventData} event - The celebration event object.
 * @returns {number} Score between 0 and 100.
 */
export function calculateEventReadiness(event: EventData): number {
  const milestoneScore = calculateMilestoneMetrics(event).percentage;
  
  const vendorMetrics = calculateVendorMetrics(event);
  const vendorScore = vendorMetrics.total > 0
    ? Math.round(((vendorMetrics.booked + vendorMetrics.completed) / vendorMetrics.total) * 100)
    : 50;

  const budgetMetrics = calculateBudgetMetrics(event);
  const budgetScore = budgetMetrics.isOverBudget ? 40 : 100;

  const creativeItemsCount = (event.invitations?.length || 0) + (event.menus?.length || 0) + (event.entertainment?.length || 0);
  const creativeScore = Math.min(100, creativeItemsCount * 25);

  const weighted = Math.round(
    milestoneScore * 0.40 +
    vendorScore * 0.30 +
    budgetScore * 0.20 +
    creativeScore * 0.10
  );

  return Math.min(100, Math.max(0, weighted));
}
