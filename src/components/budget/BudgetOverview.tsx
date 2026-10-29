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
import { BudgetKpiGrid } from './BudgetKpiGrid';
import { BudgetExpenseTable } from './BudgetExpenseTable';
import { 
  Plus, 
  Sparkles, 
  AlertTriangle, 
  TrendingDown, 
  Loader2 
} from 'lucide-react';

/**
 * Controller component orchestrating Budget KPIs, expense filtering, multi-currency toggles,
 * and GenAI reallocation analysis.
 */
export const BudgetOverview: React.FC = () => {
  const { activeEvent, addBudgetItem, deleteBudgetItem, toggleItemPaid, updateEventDetails } = useEvent();
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
      {/* 1. Sub-modular Executive KPI Grid */}
      <BudgetKpiGrid 
        metrics={metrics} 
        currency={activeEvent.currency} 
        totalBudget={activeEvent.totalBudget} 
      />

      {/* 2. Filter & Multi-Currency Controls Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
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

        {/* Currency Switcher */}
        <div className="flex items-center gap-1 bg-slate-100 dark:bg-slate-800 p-1 rounded-xl border border-slate-200 dark:border-slate-700">
          <span className="text-[10px] font-extrabold uppercase text-slate-400 px-1.5 hidden sm:inline">Currency:</span>
          {(['USD', 'INR', 'EUR', 'GBP'] as const).map(curr => (
            <button
              key={curr}
              onClick={() => updateEventDetails({ currency: curr })}
              className={`px-2.5 py-1 text-xs font-bold rounded-lg transition-all ${
                activeEvent.currency === curr
                  ? 'bg-white dark:bg-slate-900 text-brand-600 dark:text-brand-400 shadow-xs'
                  : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
              }`}
            >
              {curr === 'USD' ? '$ USD' : curr === 'INR' ? '₹ INR' : curr === 'EUR' ? '€ EUR' : '£ GBP'}
            </button>
          ))}
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

      {/* 3. Sub-modular Tabular Expenses Ledger */}
      <BudgetExpenseTable 
        items={filteredItems}
        currency={activeEvent.currency}
        onTogglePaid={toggleItemPaid}
        onDeleteItem={deleteBudgetItem}
      />

      {/* 4. Add BudgetItem Modal */}
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
                value={estimatedCost}
                onChange={(e) => setEstimatedCost(Number(e.target.value))}
                className="w-full px-3.5 py-2 text-sm bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-brand-500 dark:text-white"
              />
              {formErrors.estimatedCost && <p className="mt-1 text-xs text-rose-500">{formErrors.estimatedCost}</p>}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label htmlFor="item-act" className="block text-xs font-bold uppercase text-slate-500 mb-1">
                Actual Cost ({activeEvent.currency})
              </label>
              <input
                id="item-act"
                type="number"
                min="0"
                value={actualCost}
                onChange={(e) => setActualCost(Number(e.target.value))}
                className="w-full px-3.5 py-2 text-sm bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-brand-500 dark:text-white"
              />
            </div>

            <div>
              <label htmlFor="item-due" className="block text-xs font-bold uppercase text-slate-500 mb-1">
                Due Date
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
              Notes & Contract Terms
            </label>
            <textarea
              id="item-notes"
              rows={2}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="e.g. 50% deposit paid upon signing, final payment due 2 weeks before."
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
              className="px-5 py-2 text-sm font-bold text-white bg-brand-600 hover:bg-brand-700 rounded-xl shadow-sm transition-all"
            >
              Save Allocation
            </button>
          </div>
        </form>
      </Modal>

      {/* 5. AI Optimizer Modal */}
      <Modal
        isOpen={isAiModalOpen}
        onClose={() => setIsAiModalOpen(false)}
        title="GenAI Budget Optimizer & Reallocation Analysis"
        description={`Algorithmic spending review for ${activeEvent.title}`}
        maxWidth="2xl"
      >
        {isOptimizing ? (
          <div className="py-12 text-center space-y-3">
            <Loader2 className="w-8 h-8 text-brand-600 animate-spin mx-auto" />
            <p className="text-sm font-semibold text-slate-800 dark:text-slate-200">
              Analyzing expense allocations against benchmark variance models...
            </p>
            <p className="text-xs text-slate-500">Synthesizing realistic cost-saving trade-offs and reallocation safeguards</p>
          </div>
        ) : optimizationResult ? (
          <div className="space-y-6">
            <div className="p-4 rounded-2xl border bg-emerald-50 dark:bg-emerald-950/30 border-emerald-200 dark:border-emerald-900/50">
              <div className="flex items-center gap-2 mb-1">
                <AlertTriangle className="w-5 h-5 text-amber-500" />
                <h4 className="text-sm font-bold uppercase tracking-wider text-slate-900 dark:text-white">
                  GenAI Financial Analysis Summary
                </h4>
              </div>
              <p className="text-sm leading-relaxed text-slate-700 dark:text-slate-300">
                {optimizationResult.analysisSummary}
              </p>
              {optimizationResult.recommendedReserve > 0 && (
                <p className="text-xs font-semibold text-emerald-700 dark:text-emerald-400 mt-2">
                  Recommended Contingency Reserve: {formatCurrency(optimizationResult.recommendedReserve, activeEvent.currency)}
                </p>
              )}
            </div>

            {optimizationResult.savingsOpportunities.length > 0 && (
              <div className="space-y-3">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
                  <TrendingDown className="w-4 h-4 text-emerald-500" />
                  <span>Actionable Cost-Saving Reallocations</span>
                </h4>
                <div className="space-y-2">
                  {optimizationResult.savingsOpportunities.map((opp, idx) => (
                    <div key={idx} className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/80 text-xs sm:text-sm space-y-1">
                      <div className="flex items-center justify-between font-bold">
                        <span className="text-slate-900 dark:text-white capitalize">{opp.category}</span>
                        <span className="text-emerald-600 dark:text-emerald-400">
                          Suggest: {formatCurrency(opp.suggestedEstimated, activeEvent.currency)} (save {formatCurrency(opp.currentEstimated - opp.suggestedEstimated, activeEvent.currency)})
                        </span>
                      </div>
                      <p className="text-slate-600 dark:text-slate-300">{opp.actionableTip}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {optimizationResult.hiddenCostWarnings && optimizationResult.hiddenCostWarnings.length > 0 && (
              <div className="space-y-2">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500">
                  Hidden Overrun Risks to Watch
                </h4>
                <ul className="list-disc list-inside text-xs sm:text-sm text-slate-600 dark:text-slate-400 space-y-1">
                  {optimizationResult.hiddenCostWarnings.map((cost: string, idx: number) => (
                    <li key={idx}>{cost}</li>
                  ))}
                </ul>
              </div>
            )}

            <div className="pt-2 flex justify-end">
              <button
                type="button"
                onClick={() => setIsAiModalOpen(false)}
                className="px-5 py-2.5 text-sm font-bold text-white bg-brand-600 hover:bg-brand-700 rounded-xl shadow-sm transition-all"
              >
                Done Reviewing
              </button>
            </div>
          </div>
        ) : null}
      </Modal>
    </div>
  );
};
