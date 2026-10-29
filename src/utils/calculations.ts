import { EventData, BudgetCategory } from '../types/event';
import { BUDGET_CATEGORIES } from '../constants/categories';

export interface BudgetMetrics {
  totalBudget: number;
  totalEstimated: number;
  totalActual: number;
  totalPaid: number;
  remainingBudget: number;
  variance: number; // positive = under budget, negative = over budget
  percentBudgetUsed: number;
  isOverBudget: boolean;
  categoryBreakdown: {
    category: BudgetCategory;
    name: string;
    color: string;
    estimated: number;
    actual: number;
    percentOfBudget: number;
  }[];
}

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

export interface MilestoneMetrics {
  total: number;
  completed: number;
  pending: number;
  highPriorityPending: number;
  percentage: number;
}

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
