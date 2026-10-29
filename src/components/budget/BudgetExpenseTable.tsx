import React from 'react';
import { BudgetItem, CurrencyCode } from '../../types/event';
import { BUDGET_CATEGORIES } from '../../constants/categories';
import { formatCurrency } from '../../utils/formatters';
import { CheckCircle, Circle, Trash2 } from 'lucide-react';

interface BudgetExpenseTableProps {
  items: BudgetItem[];
  currency: CurrencyCode;
  onTogglePaid: (id: string) => void;
  onDeleteItem: (id: string) => void;
}

/**
 * Single-responsibility component for rendering the detailed tabular expenses ledger.
 */
export const BudgetExpenseTable: React.FC<BudgetExpenseTableProps> = ({
  items,
  currency,
  onTogglePaid,
  onDeleteItem,
}) => {
  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden shadow-sm">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse text-xs sm:text-sm">
          <thead>
            <tr className="border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50 text-slate-500 font-bold uppercase text-[11px] tracking-wider">
              <th className="py-3 px-4 w-12 text-center">Status</th>
              <th className="py-3 px-4">Item Name</th>
              <th className="py-3 px-4">Category</th>
              <th className="py-3 px-4 text-right">Estimated</th>
              <th className="py-3 px-4 text-right">Actual</th>
              <th className="py-3 px-4">Due Date</th>
              <th className="py-3 px-4 text-center">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
            {items.length === 0 ? (
              <tr>
                <td colSpan={7} className="py-12 text-center text-slate-400">
                  No budget items found in this category. Click "Add Expense" or generate via AI!
                </td>
              </tr>
            ) : (
              items.map((item) => {
                const catConfig = BUDGET_CATEGORIES.find((c) => c.id === item.category);
                return (
                  <tr key={item.id} className="hover:bg-slate-50/70 dark:hover:bg-slate-800/30 transition-colors">
                    <td className="py-3 px-4 text-center">
                      <button
                        onClick={() => onTogglePaid(item.id)}
                        className="text-slate-400 hover:text-emerald-500 transition-colors"
                        title={item.paid ? 'Mark as Unpaid' : 'Mark as Paid'}
                        aria-label={`Toggle paid status for ${item.name}`}
                      >
                        {item.paid ? (
                          <CheckCircle className="w-5 h-5 text-emerald-500 fill-emerald-50 dark:fill-emerald-950" />
                        ) : (
                          <Circle className="w-5 h-5" />
                        )}
                      </button>
                    </td>
                    <td className="py-3 px-4 font-semibold text-slate-900 dark:text-white">
                      <div>
                        <span>{item.name}</span>
                        {item.notes && (
                          <p className="text-[11px] font-normal text-slate-500 line-clamp-1">{item.notes}</p>
                        )}
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-xs font-medium bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
                        <span
                          className="w-2.5 h-2.5 rounded-full"
                          style={{ backgroundColor: item.color || catConfig?.color || '#cbd5e1' }}
                        />
                        {catConfig?.name || item.category}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-right font-medium text-slate-700 dark:text-slate-300 tabular-nums">
                      {formatCurrency(item.estimatedCost, currency)}
                    </td>
                    <td className="py-3 px-4 text-right font-bold text-slate-900 dark:text-white tabular-nums">
                      {item.actualCost > 0 ? formatCurrency(item.actualCost, currency) : '—'}
                    </td>
                    <td className="py-3 px-4 text-slate-500 text-xs">
                      {item.dueDate || '—'}
                    </td>
                    <td className="py-3 px-4 text-center">
                      <button
                        onClick={() => onDeleteItem(item.id)}
                        className="p-1.5 text-slate-400 hover:text-rose-600 rounded-lg hover:bg-rose-50 dark:hover:bg-rose-950/30 transition-colors"
                        title="Delete expense"
                        aria-label={`Delete ${item.name}`}
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};
