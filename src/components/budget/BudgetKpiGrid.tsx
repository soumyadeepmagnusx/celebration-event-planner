import React from 'react';
import { BudgetMetrics } from '../../utils/calculations';
import { CurrencyCode } from '../../types/event';
import { formatCurrency } from '../../utils/formatters';

interface BudgetKpiGridProps {
  metrics: BudgetMetrics;
  currency: CurrencyCode;
  totalBudget: number;
}

/**
 * Single-responsibility component that renders the top 4 executive KPI financial summary cards.
 */
export const BudgetKpiGrid: React.FC<BudgetKpiGridProps> = ({ metrics, currency, totalBudget }) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {/* Target Budget */}
      <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
        <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Target Budget</p>
        <p className="text-2xl font-black text-slate-900 dark:text-white mt-1">
          {formatCurrency(totalBudget, currency)}
        </p>
        <p className="text-xs text-slate-400 mt-1">Allocated financial ceiling</p>
      </div>

      {/* Estimated Expenses */}
      <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
        <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Total Estimated</p>
        <p className="text-2xl font-black text-slate-900 dark:text-white mt-1">
          {formatCurrency(metrics.totalEstimated, currency)}
        </p>
        <p className={`text-xs mt-1 font-medium ${metrics.isOverBudget ? 'text-rose-500 font-bold' : 'text-emerald-600 dark:text-emerald-400'}`}>
          {metrics.isOverBudget 
            ? `Over target by ${formatCurrency(Math.abs(metrics.variance), currency)}` 
            : `${formatCurrency(metrics.remainingBudget, currency)} remaining buffer`}
        </p>
      </div>

      {/* Actual Committed */}
      <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
        <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Actual Spent</p>
        <p className="text-2xl font-black text-slate-900 dark:text-white mt-1">
          {formatCurrency(metrics.totalActual, currency)}
        </p>
        <p className="text-xs text-slate-400 mt-1">Confirmed signed contracts</p>
      </div>

      {/* Total Paid */}
      <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
        <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Deposits Paid</p>
        <p className="text-2xl font-black text-emerald-600 dark:text-emerald-400 mt-1">
          {formatCurrency(metrics.totalPaid, currency)}
        </p>
        <p className="text-xs text-slate-400 mt-1">Settled payments</p>
      </div>
    </div>
  );
};
