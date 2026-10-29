import { useState, useEffect } from 'react';
import { EventProvider } from './context/EventContext';
import { Navbar } from './components/common/Navbar';
import { EventHeader, ActiveTab } from './components/event/EventHeader';
import { OverviewDashboard } from './components/dashboard/OverviewDashboard';
import { BudgetOverview } from './components/budget/BudgetOverview';
import { TimelineView } from './components/timeline/TimelineView';
import { VendorList } from './components/vendors/VendorList';
import { CreativeIdeationHub } from './components/ideas/CreativeIdeationHub';
import { PrintableDossier } from './components/print/PrintableDossier';
import { CreateEventModal } from './components/event/CreateEventModal';
import { ApiKeyModal } from './components/common/ApiKeyModal';
import { ExportImportModal } from './components/common/ExportImportModal';
import { AICoPlannerDrawer } from './components/chat/AICoPlannerDrawer';

function AppContent() {
  const [activeTab, setActiveTab] = useState<ActiveTab>('overview');
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isApiKeyModalOpen, setIsApiKeyModalOpen] = useState(false);
  const [isExportModalOpen, setIsExportModalOpen] = useState(false);

  const [darkMode, setDarkMode] = useState<boolean>(() => {
    try {
      return localStorage.getItem('celebratify_dark_mode') === 'true' ||
        window.matchMedia('(prefers-color-scheme: dark)').matches;
    } catch {
      return false;
    }
  });

  useEffect(() => {
    try {
      if (darkMode) {
        document.documentElement.classList.add('dark');
        localStorage.setItem('celebratify_dark_mode', 'true');
      } else {
        document.documentElement.classList.remove('dark');
        localStorage.setItem('celebratify_dark_mode', 'false');
      }
    } catch (err) {
      console.error(err);
    }
  }, [darkMode]);

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 transition-colors">
      {/* Accessibility Skip-To-Content Link (WCAG 2.1 AA) */}
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 z-50 px-4 py-2 bg-brand-600 text-white font-bold rounded-lg shadow-lg focus:outline-none"
      >
        Skip to main content
      </a>

      {/* Top Navbar */}
      <Navbar
        onOpenCreateModal={() => setIsCreateModalOpen(true)}
        onOpenApiKeyModal={() => setIsApiKeyModalOpen(true)}
        onOpenExportModal={() => setIsExportModalOpen(true)}
        darkMode={darkMode}
        setDarkMode={setDarkMode}
      />

      {/* Event Header with Tab Bar */}
      <EventHeader activeTab={activeTab} setActiveTab={setActiveTab} />

      {/* Main Content Area */}
      <main id="main-content" className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8" tabIndex={-1}>
        {activeTab === 'overview' && <OverviewDashboard setActiveTab={setActiveTab} />}
        {activeTab === 'budget' && <BudgetOverview />}
        {activeTab === 'timeline' && <TimelineView />}
        {activeTab === 'vendors' && <VendorList />}
        {activeTab === 'ideas' && <CreativeIdeationHub />}
        {activeTab === 'dossier' && <PrintableDossier />}
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-200 dark:border-slate-800 bg-white/50 dark:bg-slate-900/50 py-6 text-xs text-slate-500 text-center print:hidden">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-2">
          <p>
            <strong>Celebratify AI</strong> • Challenge 5: Celebration & Event Planner • PromptWars
          </p>
          <p className="text-[11px] text-slate-400">
            Built with React, TypeScript, Tailwind CSS & Google Gemini API • Offline Generative Engine Included
          </p>
        </div>
      </footer>

      {/* Modals & Slide-Over Assistant Drawer */}
      <CreateEventModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
      />

      <ApiKeyModal
        isOpen={isApiKeyModalOpen}
        onClose={() => setIsApiKeyModalOpen(false)}
      />

      <ExportImportModal
        isOpen={isExportModalOpen}
        onClose={() => setIsExportModalOpen(false)}
      />

      <AICoPlannerDrawer />
    </div>
  );
}

export default function App() {
  return (
    <EventProvider>
      <AppContent />
    </EventProvider>
  );
}
