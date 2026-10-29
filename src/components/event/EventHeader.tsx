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
  const { events, activeEvent, selectEvent, setIsDrawerOpen } = useEvent();
  const eventConfig = EVENT_TYPE_DETAILS[activeEvent.type] || EVENT_TYPE_DETAILS.wedding;
  const countdown = calculateDaysRemaining(activeEvent.date);

  const tabs: { id: ActiveTab; label: string; icon: React.ReactNode; count?: number }[] = [
    { id: 'overview', label: 'Executive Dashboard', icon: <Layers className="w-4 h-4" /> },
    { id: 'budget', label: 'Smart Budget & Optimizer', icon: <Wallet className="w-4 h-4" />, count: activeEvent.budgetItems.length },
    { id: 'timeline', label: 'Timelines & Run-of-Show', icon: <Clock className="w-4 h-4" />, count: activeEvent.milestones.length },
    { id: 'vendors', label: 'Vendor Checklists & CRM', icon: <CheckSquare className="w-4 h-4" />, count: activeEvent.vendors.length },
    { id: 'ideas', label: 'GenAI Creative Studio', icon: <Palette className="w-4 h-4" /> },
    { id: 'dossier', label: 'Printable Master Dossier', icon: <FileText className="w-4 h-4" /> },
  ];

  return (
    <div className="relative border-b border-slate-200 dark:border-slate-800 transition-colors">
      {/* Luxury Hero Background with Unsplash Imagery & Ambient Gradient */}
      <div className="relative overflow-hidden bg-slate-950 text-white min-h-[340px] flex flex-col justify-between">
        {activeEvent.heroImage && (
          <div 
            className="absolute inset-0 bg-cover bg-center transition-all duration-700 transform scale-105"
            style={{ backgroundImage: `url(${activeEvent.heroImage})` }}
          >
            {/* Multi-layered cinematic gradient overlays */}
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/75 to-slate-900/40 backdrop-blur-[1px]" />
            <div className={`absolute inset-0 opacity-20 bg-gradient-to-r ${activeEvent.gradientBg || 'from-rose-600 to-amber-600'}`} />
          </div>
        )}

        {/* Top Floating Preset Switcher Bar */}
        <div className="relative z-10 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 pt-5">
          <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-white/10">
            <div className="flex items-center gap-2 overflow-x-auto no-scrollbar py-0.5">
              <span className="text-[10px] font-extrabold uppercase tracking-widest text-slate-400 mr-1 hidden sm:inline">
                Preset Themes:
              </span>
              {events.slice(0, 3).map((preset) => {
                const isSelected = preset.id === activeEvent.id;
                return (
                  <button
                    key={preset.id}
                    onClick={() => selectEvent(preset.id)}
                    className={`px-3 py-1.5 rounded-full text-xs font-bold transition-all flex items-center gap-1.5 whitespace-nowrap backdrop-blur-md ${
                      isSelected
                        ? 'bg-white text-slate-950 shadow-lg shadow-white/10 ring-2 ring-white/50 scale-105'
                        : 'bg-white/10 hover:bg-white/20 text-white/90 border border-white/10'
                    }`}
                  >
                    <span>{EVENT_TYPE_DETAILS[preset.type]?.icon || '✨'}</span>
                    <span>{preset.themeName || preset.title}</span>
                  </button>
                );
              })}
            </div>

            <div className="flex items-center gap-2">
              <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold backdrop-blur-md ${
                countdown.isPast
                  ? 'bg-slate-800/80 text-slate-300 border border-slate-700'
                  : 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 shadow-sm'
              }`}>
                <Clock className="w-3.5 h-3.5" />
                <span>{countdown.label}</span>
              </span>
            </div>
          </div>
        </div>

        {/* Hero Banner Main Content */}
        <div className="relative z-10 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8 sm:py-10 space-y-4">
          <div className="max-w-3xl space-y-3">
            <div className="flex flex-wrap items-center gap-2">
              <span className={`px-3 py-0.5 rounded-full text-xs font-extrabold uppercase tracking-widest border backdrop-blur-md ${
                activeEvent.badgeBg || 'bg-rose-500/20 text-rose-300 border-rose-500/40'
              }`}>
                {eventConfig.icon} {activeEvent.themeName || eventConfig.label}
              </span>
              {activeEvent.subtitle && (
                <span className="text-xs font-medium text-slate-300 hidden md:inline-block">
                  • {activeEvent.subtitle}
                </span>
              )}
            </div>

            <h1 className={`text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-white drop-shadow-sm ${activeEvent.fontClass || 'font-serif'}`}>
              <span className={`bg-gradient-to-r ${activeEvent.gradientText || 'from-rose-400 via-amber-200 to-rose-300'} bg-clip-text text-transparent`}>
                {activeEvent.title}
              </span>
            </h1>

            {/* Event Meta Badges & Color Palette Row */}
            <div className="flex flex-wrap items-center gap-y-2 gap-x-4 text-xs sm:text-sm text-slate-200 pt-1">
              <span className="flex items-center gap-1.5 bg-black/30 backdrop-blur-md px-3 py-1.5 rounded-xl border border-white/10">
                <Calendar className="w-4 h-4 text-amber-400" />
                {formatDate(activeEvent.date)}
              </span>
              <span className="flex items-center gap-1.5 bg-black/30 backdrop-blur-md px-3 py-1.5 rounded-xl border border-white/10">
                <MapPin className="w-4 h-4 text-rose-400" />
                {activeEvent.location}
              </span>
              <span className="flex items-center gap-1.5 bg-black/30 backdrop-blur-md px-3 py-1.5 rounded-xl border border-white/10">
                <Users className="w-4 h-4 text-cyan-400" />
                {activeEvent.guestCount} Guests
              </span>
              <span className="flex items-center gap-1.5 bg-black/30 backdrop-blur-md px-3 py-1.5 rounded-xl border border-white/10 font-bold text-white">
                <Wallet className="w-4 h-4 text-emerald-400" />
                {formatCurrency(activeEvent.totalBudget, activeEvent.currency)} Budget
              </span>
            </div>

            {/* Palette Swatches */}
            {activeEvent.palette && activeEvent.palette.length > 0 && (
              <div className="pt-2 flex items-center gap-2">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                  Palette:
                </span>
                <div className="flex items-center gap-1.5">
                  {activeEvent.palette.map((color, idx) => (
                    <div 
                      key={idx}
                      className="group relative flex items-center"
                      title={`${color.name}: ${color.hex}`}
                    >
                      <span 
                        className="w-4 h-4 rounded-full border border-white/30 shadow-sm transition-transform hover:scale-125 cursor-pointer"
                        style={{ backgroundColor: color.hex }}
                      />
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Quick Action Bar in Hero */}
          <div className="pt-2 flex flex-wrap items-center justify-between gap-4">
            <div className="text-xs text-slate-400 italic">
              ✨ PromptWars [Challenge 5] Multi-modal Celebration & Event Intelligence Engine
            </div>

            <button
              onClick={() => setIsDrawerOpen(true)}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold text-xs sm:text-sm text-white bg-gradient-to-r from-rose-500 via-pink-500 to-amber-500 hover:opacity-95 shadow-lg shadow-pink-500/25 transition-all transform hover:-translate-y-0.5 active:translate-y-0"
            >
              <Sparkles className="w-4 h-4 animate-spin" style={{ animationDuration: '4s' }} />
              <span>Ask AI Co-Planner Assistant</span>
            </button>
          </div>
        </div>
      </div>

      {/* Tab Navigation Navigation Bar */}
      <div className="bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <nav 
            role="navigation" 
            aria-label="Event Management Modules"
            className="flex space-x-1 sm:space-x-2 overflow-x-auto no-scrollbar py-1"
          >
            {tabs.map((tab) => {
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-2 py-3.5 px-3.5 sm:px-4 text-xs sm:text-sm font-bold border-b-2 whitespace-nowrap transition-all ${
                    isActive
                      ? 'border-brand-600 text-brand-600 dark:text-brand-400 dark:border-brand-400'
                      : 'border-transparent text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200 hover:border-slate-300 dark:hover:border-slate-700'
                  }`}
                  aria-current={isActive ? 'page' : undefined}
                >
                  <span>{tab.icon}</span>
                  <span>{tab.label}</span>
                  {tab.count !== undefined && (
                    <span className={`px-2 py-0.5 text-[11px] font-bold rounded-full ${
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
    </div>
  );
};
