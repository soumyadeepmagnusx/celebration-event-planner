import React from 'react';
import { useEvent } from '../../context/EventContext';
import { ActiveTab } from '../event/EventHeader';
import { calculateBudgetMetrics, calculateMilestoneMetrics, calculateVendorMetrics } from '../../utils/calculations';
import { formatCurrency, formatDate } from '../../utils/formatters';
import { MetricCard } from '../common/MetricCard';
import { ProgressBar } from '../common/ProgressBar';
import { 
  Wallet, 
  CalendarCheck, 
  Users, 
  Sparkles, 
  ArrowRight, 
  CheckCircle2, 
  Store,
  Palette
} from 'lucide-react';

interface OverviewDashboardProps {
  setActiveTab: (tab: ActiveTab) => void;
}

export const OverviewDashboard: React.FC<OverviewDashboardProps> = ({ setActiveTab }) => {
  const { activeEvent, toggleMilestone, setIsDrawerOpen } = useEvent();

  const budgetMetrics = calculateBudgetMetrics(activeEvent);
  const milestoneMetrics = calculateMilestoneMetrics(activeEvent);
  const vendorMetrics = calculateVendorMetrics(activeEvent);

  const upcomingMilestones = activeEvent.milestones
    .filter(m => !m.completed)
    .sort((a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime())
    .slice(0, 4);

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Top Key Performance Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard
          title="Budget Allocation"
          value={formatCurrency(budgetMetrics.totalEstimated, activeEvent.currency)}
          subtitle={`of ${formatCurrency(activeEvent.totalBudget, activeEvent.currency)} target`}
          icon={<Wallet className="w-5 h-5" />}
          badge={{
            text: budgetMetrics.isOverBudget ? 'Over Target' : `${budgetMetrics.percentBudgetUsed}% Allocated`,
            variant: budgetMetrics.isOverBudget ? 'danger' : 'success',
          }}
        />

        <MetricCard
          title="Timeline Progress"
          value={`${milestoneMetrics.percentage}%`}
          subtitle={`${milestoneMetrics.completed} of ${milestoneMetrics.total} tasks completed`}
          icon={<CalendarCheck className="w-5 h-5" />}
          badge={{
            text: `${milestoneMetrics.highPriorityPending} High Priority`,
            variant: milestoneMetrics.highPriorityPending > 0 ? 'warning' : 'success',
          }}
        />

        <MetricCard
          title="Vendor Pipeline"
          value={`${vendorMetrics.booked} / ${vendorMetrics.total}`}
          subtitle={`${formatCurrency(vendorMetrics.totalCommittedAmount, activeEvent.currency)} committed`}
          icon={<Store className="w-5 h-5" />}
          badge={{
            text: `${vendorMetrics.quoted} Awaiting Quote`,
            variant: 'info',
          }}
        />

        <MetricCard
          title="Guest Count"
          value={activeEvent.guestCount}
          subtitle={`Location: ${activeEvent.location.split(',')[0]}`}
          icon={<Users className="w-5 h-5" />}
          badge={{
            text: 'Confirmed Scale',
            variant: 'info',
          }}
        />
      </div>

      {/* Main Split: Budget & Timeline Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Budget Visualizer */}
        <div className="lg:col-span-7 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <Wallet className="w-4 h-4 text-brand-500" />
                Budget Allocation by Category
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Tracking {activeEvent.budgetItems.length} expenses against {formatCurrency(activeEvent.totalBudget, activeEvent.currency)} target.
              </p>
            </div>
            <button
              onClick={() => setActiveTab('budget')}
              className="text-xs font-semibold text-brand-600 dark:text-brand-400 hover:text-brand-700 flex items-center gap-1 transition-colors"
            >
              <span>Manage</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Master Progress Bar */}
          <div className="mb-6 p-4 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800">
            <div className="flex justify-between items-center text-xs font-bold text-slate-700 dark:text-slate-300 mb-2">
              <span>Total Estimated vs Target Budget</span>
              <span className={budgetMetrics.isOverBudget ? 'text-rose-600 dark:text-rose-400' : 'text-emerald-600 dark:text-emerald-400'}>
                {budgetMetrics.isOverBudget ? `Over by ${formatCurrency(Math.abs(budgetMetrics.variance), activeEvent.currency)}` : `${formatCurrency(budgetMetrics.remainingBudget, activeEvent.currency)} available`}
              </span>
            </div>
            <ProgressBar
              value={budgetMetrics.totalEstimated}
              max={activeEvent.totalBudget}
              size="lg"
              colorClass={budgetMetrics.isOverBudget ? 'bg-rose-500' : 'bg-gradient-to-r from-brand-500 to-emerald-500'}
            />
          </div>

          {/* Category Progress List */}
          <div className="space-y-3.5">
            {budgetMetrics.categoryBreakdown.slice(0, 5).map(cat => (
              <div key={cat.category} className="space-y-1">
                <div className="flex justify-between items-center text-xs">
                  <span className="font-medium text-slate-700 dark:text-slate-300 flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: cat.color }} />
                    {cat.name}
                  </span>
                  <span className="font-semibold text-slate-900 dark:text-white tabular-nums">
                    {formatCurrency(cat.estimated, activeEvent.currency)} ({cat.percentOfBudget}%)
                  </span>
                </div>
                <div className="h-1.5 w-full bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all duration-500"
                    style={{ width: `${Math.min(100, cat.percentOfBudget)}%`, backgroundColor: cat.color }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right Column: Urgent Action Milestones */}
        <div className="lg:col-span-5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                  <CalendarCheck className="w-4 h-4 text-brand-500" />
                  Upcoming Milestones
                </h2>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  {milestoneMetrics.pending} pending tasks remaining.
                </p>
              </div>
              <button
                onClick={() => setActiveTab('timeline')}
                className="text-xs font-semibold text-brand-600 dark:text-brand-400 hover:text-brand-700 flex items-center gap-1 transition-colors"
              >
                <span>View All</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

            {upcomingMilestones.length === 0 ? (
              <div className="py-8 text-center text-slate-400 text-xs">
                <CheckCircle2 className="w-8 h-8 mx-auto text-emerald-500 mb-2 opacity-80" />
                All scheduled milestones are complete!
              </div>
            ) : (
              <div className="space-y-2.5">
                {upcomingMilestones.map(m => (
                  <div
                    key={m.id}
                    className="p-3 rounded-xl border border-slate-100 dark:border-slate-800/80 bg-slate-50/70 dark:bg-slate-800/40 hover:bg-white dark:hover:bg-slate-800 transition-all flex items-start gap-3 group"
                  >
                    <button
                      onClick={() => toggleMilestone(m.id)}
                      className="mt-0.5 p-1 text-slate-400 hover:text-brand-600 rounded transition-colors"
                      aria-label={`Mark milestone "${m.title}" as complete`}
                    >
                      <div className="w-4 h-4 rounded border-2 border-slate-400 group-hover:border-brand-500 flex items-center justify-center" />
                    </button>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-bold text-slate-800 dark:text-slate-200 truncate">
                        {m.title}
                      </p>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="text-[11px] text-slate-500 dark:text-slate-400">
                          Due: {formatDate(m.dueDate)}
                        </span>
                        {m.priority === 'high' && (
                          <span className="px-1.5 py-0.2 text-[10px] font-bold rounded bg-rose-50 text-rose-600 dark:bg-rose-950/50 dark:text-rose-400">
                            High Priority
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Quick AI Suggestion Card */}
          <div className="mt-6 p-4 rounded-xl bg-gradient-to-tr from-brand-50 to-pink-50 dark:from-brand-950/30 dark:to-pink-950/20 border border-brand-100 dark:border-brand-900/50 flex items-start gap-3">
            <Sparkles className="w-5 h-5 text-brand-600 dark:text-brand-400 mt-0.5 shrink-0" />
            <div className="text-xs text-brand-900 dark:text-brand-200">
              <span className="font-bold">AI Co-Planner Insight:</span> You have {vendorMetrics.quoted} vendor quotes awaiting contract reviews. Use our AI Negotiation Writer to draft tailored agreements and save up to 12% on setup fees.
              <button
                onClick={() => setIsDrawerOpen(true)}
                className="mt-2 text-xs font-bold text-brand-700 dark:text-brand-300 underline block hover:text-brand-800"
              >
                Open AI Negotiation Assistant &rarr;
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Launchpad to Tabs */}
      <div>
        <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-3">
          Explore Planning Modules
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <button
            onClick={() => setActiveTab('budget')}
            className="p-4 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 hover:border-brand-500 dark:hover:border-brand-500 text-left transition-all group shadow-sm"
          >
            <div className="w-10 h-10 rounded-xl bg-amber-50 dark:bg-amber-950/40 text-amber-600 dark:text-amber-400 flex items-center justify-center mb-3 group-hover:scale-105 transition-transform">
              <Wallet className="w-5 h-5" />
            </div>
            <h4 className="text-sm font-bold text-slate-900 dark:text-white group-hover:text-brand-600 dark:group-hover:text-brand-400">
              Smart Budget Optimizer
            </h4>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              AI reallocation analysis, expense tracking, and cost savings suggestions.
            </p>
          </button>

          <button
            onClick={() => setActiveTab('timeline')}
            className="p-4 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 hover:border-brand-500 dark:hover:border-brand-500 text-left transition-all group shadow-sm"
          >
            <div className="w-10 h-10 rounded-xl bg-cyan-50 dark:bg-cyan-950/40 text-cyan-600 dark:text-cyan-400 flex items-center justify-center mb-3 group-hover:scale-105 transition-transform">
              <CalendarCheck className="w-5 h-5" />
            </div>
            <h4 className="text-sm font-bold text-slate-900 dark:text-white group-hover:text-brand-600 dark:group-hover:text-brand-400">
              Day-Of Run-of-Show
            </h4>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              Minute-by-minute itinerary, team lead assignments, and milestone checklists.
            </p>
          </button>

          <button
            onClick={() => setActiveTab('vendors')}
            className="p-4 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 hover:border-brand-500 dark:hover:border-brand-500 text-left transition-all group shadow-sm"
          >
            <div className="w-10 h-10 rounded-xl bg-purple-50 dark:bg-purple-950/40 text-purple-600 dark:text-purple-400 flex items-center justify-center mb-3 group-hover:scale-105 transition-transform">
              <Store className="w-5 h-5" />
            </div>
            <h4 className="text-sm font-bold text-slate-900 dark:text-white group-hover:text-brand-600 dark:group-hover:text-brand-400">
              Vendor CRM & Quotes
            </h4>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              Kanban status, deposit tracking, and AI-drafted inquiry letters.
            </p>
          </button>

          <button
            onClick={() => setActiveTab('ideas')}
            className="p-4 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 hover:border-brand-500 dark:hover:border-brand-500 text-left transition-all group shadow-sm"
          >
            <div className="w-10 h-10 rounded-xl bg-pink-50 dark:bg-pink-950/40 text-pink-600 dark:text-pink-400 flex items-center justify-center mb-3 group-hover:scale-105 transition-transform">
              <Palette className="w-5 h-5" />
            </div>
            <h4 className="text-sm font-bold text-slate-900 dark:text-white group-hover:text-brand-600 dark:group-hover:text-brand-400">
              GenAI Creative Studio
            </h4>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              Themes, invitation copy, signature cocktails, playlist curation & speeches.
            </p>
          </button>
        </div>
      </div>
    </div>
  );
};
