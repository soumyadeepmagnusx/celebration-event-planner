import React, { useState } from 'react';
import { useEvent } from '../../context/EventContext';
import { EVENT_TYPE_DETAILS } from '../../constants/categories';
import { triggerPrintDossier } from '../../services/exportService';
import { 
  Sparkles, 
  Plus, 
  Download, 
  Key, 
  Printer, 
  Moon, 
  Sun, 
  Calendar,
  Menu,
  X
} from 'lucide-react';

interface NavbarProps {
  onOpenCreateModal: () => void;
  onOpenApiKeyModal: () => void;
  onOpenExportModal: () => void;
  darkMode: boolean;
  setDarkMode: (val: boolean | ((prev: boolean) => boolean)) => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  onOpenCreateModal,
  onOpenApiKeyModal,
  onOpenExportModal,
  darkMode,
  setDarkMode,
}) => {
  const { events, activeEventId, selectEvent, setIsDrawerOpen, apiKey } = useEvent();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-200/80 dark:border-slate-800/80 bg-white/90 dark:bg-slate-900/90 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Brand & Event Selector */}
          <div className="flex items-center gap-3 sm:gap-6">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-brand-600 to-pink-500 flex items-center justify-center text-white shadow-md shadow-brand-500/25">
                <span className="text-xl" role="img" aria-label="Celebration">🎉</span>
              </div>
              <div>
                <span className="font-extrabold text-lg tracking-tight bg-gradient-to-r from-slate-900 via-brand-700 to-pink-600 dark:from-white dark:via-pink-300 dark:to-brand-400 bg-clip-text text-transparent">
                  Celebratify<span className="text-brand-500 font-bold ml-0.5">AI</span>
                </span>
                <span className="hidden sm:inline-block ml-2 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider bg-brand-50 dark:bg-brand-950/60 text-brand-700 dark:text-brand-300 rounded-md border border-brand-200 dark:border-brand-900">
                  Challenge 5
                </span>
              </div>
            </div>

            {/* Event Dropdown Switcher */}
            <div className="hidden md:flex items-center gap-1.5 pl-4 border-l border-slate-200 dark:border-slate-800">
              <Calendar className="w-4 h-4 text-slate-400" />
              <select
                id="event-selector-nav"
                aria-label="Active Event Selection"
                value={activeEventId}
                onChange={(e) => {
                  if (e.target.value === '__new__') {
                    onOpenCreateModal();
                  } else {
                    selectEvent(e.target.value);
                  }
                }}
                className="text-xs sm:text-sm font-semibold text-slate-800 dark:text-slate-200 bg-transparent py-1.5 pl-2 pr-7 rounded-lg border-0 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors focus:ring-2 focus:ring-brand-500 cursor-pointer max-w-[200px] sm:max-w-[280px] truncate"
              >
                {events.map((e) => (
                  <option key={e.id} value={e.id} className="dark:bg-slate-900 text-slate-900 dark:text-white">
                    {EVENT_TYPE_DETAILS[e.type]?.icon || '✨'} {e.title}
                  </option>
                ))}
                <option value="__new__" className="text-brand-600 font-bold">
                  + Plan New Celebration...
                </option>
              </select>
            </div>
          </div>

          {/* Action Tools */}
          <div className="hidden sm:flex items-center gap-2">
            {/* New Celebration Modal Button */}
            <button
              onClick={onOpenCreateModal}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-xl text-brand-700 dark:text-brand-300 bg-brand-50 dark:bg-brand-950/40 hover:bg-brand-100 dark:hover:bg-brand-900/60 border border-brand-200/60 dark:border-brand-800/60 transition-colors"
              title="Create new event with GenAI assistance"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>New Event</span>
            </button>

            {/* AI Co-Planner Trigger */}
            <button
              onClick={() => setIsDrawerOpen(true)}
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-bold rounded-xl text-white bg-gradient-to-r from-brand-600 to-pink-600 hover:from-brand-700 hover:to-pink-700 shadow-sm shadow-brand-500/25 transition-all"
              title="Open AI Co-Planner Assistant"
            >
              <Sparkles className="w-3.5 h-3.5 animate-pulse" />
              <span>AI Co-Planner</span>
            </button>

            {/* Print Dossier */}
            <button
              onClick={triggerPrintDossier}
              className="p-2 text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-colors"
              title="Print or Save PDF Event Dossier"
              aria-label="Print Event Plan"
            >
              <Printer className="w-4 h-4" />
            </button>

            {/* Export / Import */}
            <button
              onClick={onOpenExportModal}
              className="p-2 text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-colors"
              title="Export / Import & CSV"
              aria-label="Export or Import Event Data"
            >
              <Download className="w-4 h-4" />
            </button>

            {/* API Key Config */}
            <button
              onClick={onOpenApiKeyModal}
              className={`p-2 rounded-xl transition-colors relative ${
                apiKey
                  ? 'text-emerald-600 hover:bg-emerald-50 dark:text-emerald-400 dark:hover:bg-emerald-950/30'
                  : 'text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800'
              }`}
              title="Configure Gemini API Key & GenAI Models"
              aria-label="Gemini API Key Settings"
            >
              <Key className="w-4 h-4" />
              {apiKey && (
                <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 bg-emerald-500 rounded-full" />
              )}
            </button>

            {/* Dark Mode Switch */}
            <button
              onClick={() => setDarkMode(prev => !prev)}
              className="p-2 text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-colors"
              aria-label={darkMode ? 'Switch to light theme' : 'Switch to dark theme'}
            >
              {darkMode ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            </button>
          </div>

          {/* Mobile Hamburger Button */}
          <div className="flex sm:hidden items-center gap-1.5">
            <button
              onClick={() => setIsDrawerOpen(true)}
              className="p-2 rounded-lg bg-brand-50 dark:bg-brand-950/50 text-brand-600"
              aria-label="Open AI Assistant"
            >
              <Sparkles className="w-4 h-4" />
            </button>
            <button
              onClick={() => setMobileMenuOpen(prev => !prev)}
              className="p-2 text-slate-600 dark:text-slate-300 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800"
              aria-label="Toggle navigation menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Dropdown Menu */}
        {mobileMenuOpen && (
          <div className="sm:hidden py-3 border-t border-slate-200 dark:border-slate-800 space-y-2">
            <div>
              <label htmlFor="mobile-event-select" className="text-xs font-semibold text-slate-500 block mb-1">
                Select Active Event:
              </label>
              <select
                id="mobile-event-select"
                value={activeEventId}
                onChange={(e) => {
                  if (e.target.value === '__new__') {
                    onOpenCreateModal();
                  } else {
                    selectEvent(e.target.value);
                  }
                  setMobileMenuOpen(false);
                }}
                className="w-full text-xs font-semibold bg-slate-100 dark:bg-slate-800 py-2 px-3 rounded-lg border-0 text-slate-900 dark:text-white"
              >
                {events.map((e) => (
                  <option key={e.id} value={e.id}>
                    {EVENT_TYPE_DETAILS[e.type]?.icon || '✨'} {e.title}
                  </option>
                ))}
                <option value="__new__">+ Plan New Celebration...</option>
              </select>
            </div>

            <div className="grid grid-cols-2 gap-2 pt-2">
              <button
                onClick={() => {
                  onOpenCreateModal();
                  setMobileMenuOpen(false);
                }}
                className="px-3 py-2 text-xs font-semibold rounded-lg bg-brand-50 text-brand-700 flex items-center justify-center gap-1.5"
              >
                <Plus className="w-3.5 h-3.5" /> New Event
              </button>
              <button
                onClick={() => {
                  triggerPrintDossier();
                  setMobileMenuOpen(false);
                }}
                className="px-3 py-2 text-xs font-semibold rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 flex items-center justify-center gap-1.5"
              >
                <Printer className="w-3.5 h-3.5" /> Print Dossier
              </button>
              <button
                onClick={() => {
                  onOpenExportModal();
                  setMobileMenuOpen(false);
                }}
                className="px-3 py-2 text-xs font-semibold rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 flex items-center justify-center gap-1.5"
              >
                <Download className="w-3.5 h-3.5" /> Export / CSV
              </button>
              <button
                onClick={() => {
                  onOpenApiKeyModal();
                  setMobileMenuOpen(false);
                }}
                className="px-3 py-2 text-xs font-semibold rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 flex items-center justify-center gap-1.5"
              >
                <Key className="w-3.5 h-3.5" /> API Keys
              </button>
            </div>
          </div>
        )}
      </div>
    </header>
  );
};
