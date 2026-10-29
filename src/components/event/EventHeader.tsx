import React from 'react';
import { useEvent } from '../../context/EventContext';
import { EVENT_TYPE_DETAILS } from '../../constants/categories';
import { formatCurrency, formatDate, calculateDaysRemaining } from '../../utils/formatters';
import { 
  Calendar, 
  MapPin, 
  Users, 
  Clock, 
  Sparkles, 
  Wallet, 
  CheckSquare, 
  Palette,
  Layers,
  FileText
} from 'lucide-react';

export type ActiveTab = 'overview' | 'budget' | 'timeline' | 'vendors' | 'ideas' | 'dossier';

interface EventHeaderProps {
  activeTab: ActiveTab;
  setActiveTab: (tab: ActiveTab) => void;
}

export const EventHeader: React.FC<EventHeaderProps> = ({ activeTab, setActiveTab }) => {
  const { activeEvent, setIsDrawerOpen } = useEvent();
  const eventConfig = EVENT_TYPE_DETAILS[activeEvent.type] || EVENT_TYPE_DETAILS.wedding;
  const countdown = calculateDaysRemaining(activeEvent.date);

  const tabs: { id: ActiveTab; label: string; icon: React.ReactNode; count?: number }[] = [
    { id: 'overview', label: 'Dashboard', icon: <Layers className="w-4 h-4" /> },
    { id: 'budget', label: 'Budget Planner', icon: <Wallet className="w-4 h-4" />, count: activeEvent.budgetItems.length },
    { id: 'timeline', label: 'Timelines & Run-of-Show', icon: <Clock className="w-4 h-4" />, count: activeEvent.milestones.length },
    { id: 'vendors', label: 'Vendor Checklists', icon: <CheckSquare className="w-4 h-4" />, count: activeEvent.vendors.length },
    { id: 'ideas', label: 'GenAI Creative Studio', icon: <Palette className="w-4 h-4" /> },
    { id: 'dossier', label: 'Printable Dossier', icon: <FileText className="w-4 h-4" /> },
  ];

  return (
    <div className="bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 pb-0">
        {/* Top Hero Banner */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-5 pb-6">
          <div className="space-y-2">
            <div className="flex flex-wrap items-center gap-2.5">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-brand-50 text-brand-700 dark:bg-brand-950/60 dark:text-brand-300 border border-brand-200 dark:border-brand-900">
                <span>{eventConfig.icon}</span>
                <span>{eventConfig.label}</span>
              </span>

              <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold ${
                countdown.isPast
                  ? 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400'
                  : 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/50 dark:text-emerald-400 border border-emerald-200/60 dark:border-emerald-800/60'
              }`}>
                <Clock className="w-3 h-3" />
                {countdown.label}
              </span>
            </div>

            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">
              {activeEvent.title}
            </h1>

            {/* Event Meta Pills */}
            <div className="flex flex-wrap items-center gap-y-2 gap-x-5 text-xs sm:text-sm text-slate-600 dark:text-slate-400 pt-1">
              <span className="flex items-center gap-1.5">
                <Calendar className="w-4 h-4 text-brand-500" />
                {formatDate(activeEvent.date)}
              </span>
              <span className="flex items-center gap-1.5">
                <MapPin className="w-4 h-4 text-brand-500" />
                {activeEvent.location}
              </span>
              <span className="flex items-center gap-1.5">
                <Users className="w-4 h-4 text-brand-500" />
                {activeEvent.guestCount} Guests
              </span>
              <span className="flex items-center gap-1.5 font-semibold text-slate-900 dark:text-white">
                <Wallet className="w-4 h-4 text-brand-500" />
                {formatCurrency(activeEvent.totalBudget, activeEvent.currency)} Target Budget
              </span>
            </div>
          </div>

          {/* Quick AI Trigger */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsDrawerOpen(true)}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl font-bold text-sm text-white bg-gradient-to-r from-brand-600 to-pink-600 hover:from-brand-700 hover:to-pink-700 shadow-md shadow-brand-500/25 transition-all transform hover:-translate-y-0.5 active:translate-y-0"
            >
              <Sparkles className="w-4 h-4 animate-spin" style={{ animationDuration: '4s' }} />
              <span>Ask AI Co-Planner</span>
            </button>
          </div>
        </div>

        {/* Tab Navigation Navigation Bar */}
        <nav 
          role="navigation" 
          aria-label="Event Management Modules"
          className="flex space-x-1 sm:space-x-2 overflow-x-auto no-scrollbar border-t border-slate-100 dark:border-slate-800"
        >
          {tabs.map((tab) => {
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 py-3.5 px-3 sm:px-4 text-xs sm:text-sm font-semibold border-b-2 whitespace-nowrap transition-all ${
                  isActive
                    ? 'border-brand-600 text-brand-600 dark:text-brand-400 dark:border-brand-400'
                    : 'border-transparent text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200 hover:border-slate-300 dark:hover:border-slate-700'
                }`}
                aria-current={isActive ? 'page' : undefined}
              >
                <span>{tab.icon}</span>
                <span>{tab.label}</span>
                {tab.count !== undefined && (
                  <span className={`px-1.5 py-0.5 text-[11px] font-bold rounded-full ${
                    isActive
                      ? 'bg-brand-100 text-brand-700 dark:bg-brand-950 dark:text-brand-300'
                      : 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400'
                  }`}>
                    {tab.count}
                  </span>
                )}
              </button>
            );
          })}
        </nav>
      </div>
    </div>
  );
};
