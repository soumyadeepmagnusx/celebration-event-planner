import React, { useState } from 'react';
import { useEvent } from '../../context/EventContext';
import { BudgetCategory } from '../../types/event';
import { BUDGET_CATEGORIES } from '../../constants/categories';
import { calculateBudgetMetrics } from '../../utils/calculations';
import { formatCurrency } from '../../utils/formatters';
import { optimizeBudgetAI } from '../../services/geminiService';
import { BudgetOptimizationResult } from '../../types/ai';
import { Modal } from '../common/Modal';
import { budgetItemSchema, sanitizeInput } from '../../utils/validation';
import { 
  Plus, 
  Sparkles, 
  Trash2, 
  CheckCircle, 
  Circle, 
  AlertTriangle, 
  TrendingDown, 
  Loader2
} from 'lucide-react';

export const BudgetOverview: React.FC = () => {
  const { activeEvent, addBudgetItem, deleteBudgetItem, toggleItemPaid } = useEvent();
  const metrics = calculateBudgetMetrics(activeEvent);

  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isAiModalOpen, setIsAiModalOpen] = useState(false);

  // Add Item form state
  const [name, setName] = useState('');
  const [category, setCategory] = useState<BudgetCategory>('venue');
  const [estimatedCost, setEstimatedCost] = useState<number>(500);
  const [actualCost, setActualCost] = useState<number>(0);
  const [dueDate, setDueDate] = useState('');
  const [notes, setNotes] = useState('');
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});

  // AI Optimizer state
  const [isOptimizing, setIsOptimizing] = useState(false);
  const [optimizationResult, setOptimizationResult] = useState<BudgetOptimizationResult | null>(null);

  const filteredItems = activeEvent.budgetItems.filter(item => {
    if (categoryFilter === 'all') return true;
    return item.category === categoryFilter;
  });

  const handleAddItem = (e: React.FormEvent) => {
    e.preventDefault();
    const payload = {
      name: sanitizeInput(name),
      category,
      estimatedCost: Number(estimatedCost) || 0,
      actualCost: Number(actualCost) || 0,
      paid: false,
      dueDate,
      notes: sanitizeInput(notes),
    };

    const result = budgetItemSchema.safeParse(payload);
    if (!result.success) {
      const errMap: Record<string, string> = {};
      result.error.issues.forEach(i => {
        if (i.path[0]) errMap[i.path[0].toString()] = i.message;
      });
      setFormErrors(errMap);
      return;
    }

    addBudgetItem(result.data);
    setName('');
    setEstimatedCost(500);
    setActualCost(0);
    setDueDate('');
    setNotes('');
    setFormErrors({});
    setIsAddModalOpen(false);
  };

  const handleRunAiOptimization = async () => {
    setIsOptimizing(true);
    setIsAiModalOpen(true);
    try {
      const result = await optimizeBudgetAI(activeEvent);
      setOptimizationResult(result);
    } catch (err) {
      console.error('Budget optimization failed:', err);
    } finally {
      setIsOptimizing(false);
    }
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Budget KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
          <p className="text-xs font-semibold text-slate-500 uppercase">Target Budget</p>
          <p className="text-2xl font-black text-slate-900 dark:text-white mt-1">
            {formatCurrency(activeEvent.totalBudget, activeEvent.currency)}
          </p>
          <p className="text-xs text-slate-500 mt-1">Base ceiling set for {activeEvent.title}</p>
        </div>

        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
          <p className="text-xs font-semibold text-slate-500 uppercase">Total Estimated</p>
          <p className="text-2xl font-black text-slate-900 dark:text-white mt-1">
            {formatCurrency(metrics.totalEstimated, activeEvent.currency)}
          </p>
          <p className={`text-xs mt-1 font-semibold ${metrics.isOverBudget ? 'text-rose-600' : 'text-emerald-600'}`}>
            {metrics.isOverBudget ? `Over target by ${formatCurrency(Math.abs(metrics.variance), activeEvent.currency)}` : `${formatCurrency(metrics.remainingBudget, activeEvent.currency)} remaining buffer`}
          </p>
        </div>

        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
          <p className="text-xs font-semibold text-slate-500 uppercase">Total Actual Incurred</p>
          <p className="text-2xl font-black text-slate-900 dark:text-white mt-1">
            {formatCurrency(metrics.totalActual, activeEvent.currency)}
          </p>
          <p className="text-xs text-slate-500 mt-1">Billed or locked through vendor contracts</p>
        </div>

        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
          <p className="text-xs font-semibold text-slate-500 uppercase">Paid Out</p>
          <p className="text-2xl font-black text-slate-900 dark:text-white mt-1">
            {formatCurrency(metrics.totalPaid, activeEvent.currency)}
          </p>
          <p className="text-xs text-slate-500 mt-1">Settled invoices and deposits</p>
        </div>
      </div>

      {/* Toolbar: Filter & Actions */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200 dark:border-slate-800">
        <div className="flex items-center gap-2">
          <label htmlFor="budget-cat-filter" className="text-xs font-bold uppercase text-slate-500 whitespace-nowrap">
            Filter:
          </label>
          <select
            id="budget-cat-filter"
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="text-xs font-semibold bg-slate-50 dark:bg-slate-800 py-1.5 px-3 rounded-lg border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-brand-500"
          >
            <option value="all">All Categories ({activeEvent.budgetItems.length})</option>
            {BUDGET_CATEGORIES.map(c => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleRunAiOptimization}
            className="flex-1 sm:flex-none inline-flex items-center justify-center gap-1.5 px-3.5 py-2 text-xs font-bold text-brand-700 dark:text-brand-300 bg-brand-50 dark:bg-brand-950/40 hover:bg-brand-100 dark:hover:bg-brand-900/60 border border-brand-200 dark:border-brand-800/80 rounded-xl transition-all"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>AI Budget Optimizer</span>
          </button>

          <button
            onClick={() => setIsAddModalOpen(true)}
            className="flex-1 sm:flex-none inline-flex items-center justify-center gap-1.5 px-4 py-2 text-xs font-bold text-white bg-brand-600 hover:bg-brand-700 rounded-xl shadow-sm transition-all"
          >
            <Plus className="w-4 h-4" />
            <span>Add Expense</span>
          </button>
        </div>
      </div>

      {/* Expenses Table */}
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
              {filteredItems.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-slate-400">
                    No budget items found in this category. Click "Add Expense" or generate via AI!
                  </td>
                </tr>
              ) : (
                filteredItems.map(item => {
                  const catConfig = BUDGET_CATEGORIES.find(c => c.id === item.category);
                  return (
                    <tr key={item.id} className="hover:bg-slate-50/70 dark:hover:bg-slate-800/30 transition-colors">
                      <td className="py-3 px-4 text-center">
                        <button
                          onClick={() => toggleItemPaid(item.id)}
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
                          {item.notes && <p className="text-[11px] font-normal text-slate-500 line-clamp-1">{item.notes}</p>}
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-xs font-medium bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
                          <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: item.color || catConfig?.color || '#cbd5e1' }} />
                          {catConfig?.name || item.category}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-right font-medium text-slate-700 dark:text-slate-300 tabular-nums">
                        {formatCurrency(item.estimatedCost, activeEvent.currency)}
                      </td>
                      <td className="py-3 px-4 text-right font-bold text-slate-900 dark:text-white tabular-nums">
                        {item.actualCost > 0 ? formatCurrency(item.actualCost, activeEvent.currency) : '—'}
                      </td>
                      <td className="py-3 px-4 text-slate-500 text-xs">
                        {item.dueDate || '—'}
                      </td>
                      <td className="py-3 px-4 text-center">
                        <button
                          onClick={() => deleteBudgetItem(item.id)}
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

      {/* Add BudgetItem Modal */}
      <Modal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        title="Add Expense Item"
        description="Record a new expense allocation for this celebration."
      >
        <form onSubmit={handleAddItem} className="space-y-4">
          <div>
            <label htmlFor="item-name" className="block text-xs font-bold uppercase text-slate-500 mb-1">
              Expense Item Name
            </label>
            <input
              id="item-name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Wedding Cake & Dessert Tier"
              className="w-full px-3.5 py-2 text-sm bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-brand-500 dark:text-white"
            />
            {formErrors.name && <p className="mt-1 text-xs text-rose-500">{formErrors.name}</p>}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label htmlFor="item-cat" className="block text-xs font-bold uppercase text-slate-500 mb-1">
                Category
              </label>
              <select
                id="item-cat"
                value={category}
                onChange={(e) => setCategory(e.target.value as BudgetCategory)}
                className="w-full px-3.5 py-2 text-sm bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-brand-500 dark:text-white"
              >
                {BUDGET_CATEGORIES.map(c => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label htmlFor="item-est" className="block text-xs font-bold uppercase text-slate-500 mb-1">
                Estimated Cost ({activeEvent.currency})
              </label>
              <input
                id="item-est"
                type="number"
                min="0"
                step="50"
                value={estimatedCost}
                onChange={(e) => setEstimatedCost(Number(e.target.value))}
                className="w-full px-3.5 py-2 text-sm bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-brand-500 dark:text-white"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label htmlFor="item-act" className="block text-xs font-bold uppercase text-slate-500 mb-1">
                Actual Cost (If Incurred)
              </label>
              <input
                id="item-act"
                type="number"
                min="0"
                step="50"
                value={actualCost}
                onChange={(e) => setActualCost(Number(e.target.value))}
                className="w-full px-3.5 py-2 text-sm bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-brand-500 dark:text-white"
              />
            </div>

            <div>
              <label htmlFor="item-due" className="block text-xs font-bold uppercase text-slate-500 mb-1">
                Payment Due Date
              </label>
              <input
                id="item-due"
                type="date"
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
                className="w-full px-3.5 py-2 text-sm bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-brand-500 dark:text-white"
              />
            </div>
          </div>

          <div>
            <label htmlFor="item-notes" className="block text-xs font-bold uppercase text-slate-500 mb-1">
              Notes / Vendor References
            </label>
            <textarea
              id="item-notes"
              rows={2}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="e.g. Quoted by Sweet Dreams Bakery; delivery included."
              className="w-full px-3.5 py-2 text-sm bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-brand-500 dark:text-white"
            />
          </div>

          <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex justify-end gap-2">
            <button
              type="button"
              onClick={() => setIsAddModalOpen(false)}
              className="px-4 py-2 text-sm text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 text-sm font-bold text-white bg-brand-600 hover:bg-brand-700 rounded-xl shadow-sm"
            >
              Add Expense
            </button>
          </div>
        </form>
      </Modal>

      {/* AI Budget Optimizer Modal */}
      <Modal
        isOpen={isAiModalOpen}
        onClose={() => setIsAiModalOpen(false)}
        title="GenAI Smart Budget Optimizer"
        description="Deep analysis of your spending allocations, potential cost overruns, and expert savings tips."
        maxWidth="2xl"
      >
        {isOptimizing ? (
          <div className="py-12 text-center space-y-3">
            <Loader2 className="w-8 h-8 text-brand-600 animate-spin mx-auto" />
            <p className="text-sm font-semibold text-slate-800 dark:text-slate-200">
              Analyzing spending benchmarks against {activeEvent.guestCount} guests...
            </p>
            <p className="text-xs text-slate-500">Evaluating venue, catering, and floral allocations</p>
          </div>
        ) : optimizationResult ? (
          <div className="space-y-5">
            {/* Analysis Summary */}
            <div className="p-4 rounded-xl bg-brand-50 dark:bg-brand-950/40 border border-brand-200 dark:border-brand-900/60 flex items-start gap-3">
              <Sparkles className="w-5 h-5 text-brand-600 dark:text-brand-400 mt-0.5 shrink-0" />
              <div className="text-xs sm:text-sm text-brand-950 dark:text-brand-100 leading-relaxed font-medium">
                {optimizationResult.analysisSummary}
              </div>
            </div>

            {/* Savings Opportunities */}
            <div>
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-2 flex items-center gap-1.5">
                <TrendingDown className="w-4 h-4 text-emerald-600" />
                Targeted Savings Opportunities
              </h3>
              <div className="space-y-2.5">
                {optimizationResult.savingsOpportunities.map((opp, idx) => (
                  <div key={idx} className="p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/40">
                    <div className="flex justify-between items-center text-xs font-bold text-slate-900 dark:text-white mb-1">
                      <span>{opp.category}</span>
                      <span className="text-emerald-600 dark:text-emerald-400">
                        Suggest: {formatCurrency(opp.suggestedEstimated, activeEvent.currency)} (save {formatCurrency(opp.currentEstimated - opp.suggestedEstimated, activeEvent.currency)})
                      </span>
                    </div>
                    <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                      💡 {opp.actionableTip}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* Hidden Cost Warnings */}
            <div>
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-2 flex items-center gap-1.5">
                <AlertTriangle className="w-4 h-4 text-amber-500" />
                Hidden Overrun Watchlist
              </h3>
              <ul className="space-y-1.5 text-xs text-slate-600 dark:text-slate-300">
                {optimizationResult.hiddenCostWarnings.map((w, idx) => (
                  <li key={idx} className="flex items-start gap-2">
                    <span className="text-amber-500 mt-0.5">•</span>
                    <span>{w}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Recommended Reserve */}
            <div className="p-3 rounded-xl bg-slate-100 dark:bg-slate-800 flex justify-between items-center text-xs">
              <span className="font-semibold text-slate-700 dark:text-slate-300">
                Recommended Emergency Contingency Reserve (8%):
              </span>
              <span className="font-extrabold text-slate-900 dark:text-white">
                {formatCurrency(optimizationResult.recommendedReserve, activeEvent.currency)}
              </span>
            </div>

            <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex justify-end">
              <button
                type="button"
                onClick={() => setIsAiModalOpen(false)}
                className="px-4 py-2 text-sm font-semibold text-white bg-brand-600 hover:bg-brand-700 rounded-xl"
              >
                Close Insights
              </button>
            </div>
          </div>
        ) : null}
      </Modal>
    </div>
  );
};
