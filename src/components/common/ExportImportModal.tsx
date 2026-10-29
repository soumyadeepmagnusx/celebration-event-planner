import React, { useRef, useState } from 'react';
import { Modal } from './Modal';
import { useEvent } from '../../context/EventContext';
import { exportEventToJSON, importEventFromJSON } from '../../services/storageService';
import { exportBudgetToCSV, exportVendorsToCSV } from '../../services/exportService';
import { Download, Upload, FileSpreadsheet, RotateCcw, Check, AlertCircle } from 'lucide-react';

interface ExportImportModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ExportImportModal: React.FC<ExportImportModalProps> = ({ isOpen, onClose }) => {
  const { activeEvent, createEvent, resetToDefaults } = useEvent();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [importStatus, setImportStatus] = useState<string>('');
  const [importError, setImportError] = useState<string>('');

  const handleExportJSON = () => {
    exportEventToJSON(activeEvent);
  };

  const handleExportBudgetCSV = () => {
    exportBudgetToCSV(activeEvent);
  };

  const handleExportVendorsCSV = () => {
    exportVendorsToCSV(activeEvent);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const text = event.target?.result as string;
        const parsed = importEventFromJSON(text);
        // assign unique id so it doesn't overwrite existing
        parsed.id = `imported-${Date.now()}`;
        parsed.title = `${parsed.title} (Imported)`;
        createEvent(parsed);
        setImportStatus(`Successfully imported "${parsed.title}"!`);
        setImportError('');
        setTimeout(() => {
          onClose();
          setImportStatus('');
        }, 1200);
      } catch (err: any) {
        setImportError(err.message || 'Failed to parse JSON file.');
      }
    };
    reader.readAsText(file);
  };

  const handleReset = () => {
    if (window.confirm('Reset all sample event templates? Your custom events will be restored to the default curated plans.')) {
      resetToDefaults();
      onClose();
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Data Portability & File Exports"
      description="Backup your event plans as structured JSON or export spreadsheets for vendors and accountants."
    >
      <div className="space-y-6">
        {/* CSV Exports */}
        <div>
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-3">
            Spreadsheet Exports (CSV)
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <button
              onClick={handleExportBudgetCSV}
              className="p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 hover:border-brand-500 dark:hover:border-brand-500 bg-slate-50 dark:bg-slate-800/60 hover:bg-white dark:hover:bg-slate-800 transition-all flex items-center gap-3 text-left group"
            >
              <div className="p-2 rounded-lg bg-emerald-100 dark:bg-emerald-950/50 text-emerald-600 dark:text-emerald-400">
                <FileSpreadsheet className="w-5 h-5" />
              </div>
              <div>
                <p className="text-sm font-semibold text-slate-900 dark:text-white group-hover:text-brand-600 dark:group-hover:text-brand-400">
                  Export Budget CSV
                </p>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Category allocations, actuals & due dates
                </p>
              </div>
            </button>

            <button
              onClick={handleExportVendorsCSV}
              className="p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 hover:border-brand-500 dark:hover:border-brand-500 bg-slate-50 dark:bg-slate-800/60 hover:bg-white dark:hover:bg-slate-800 transition-all flex items-center gap-3 text-left group"
            >
              <div className="p-2 rounded-lg bg-blue-100 dark:bg-blue-950/50 text-blue-600 dark:text-blue-400">
                <FileSpreadsheet className="w-5 h-5" />
              </div>
              <div>
                <p className="text-sm font-semibold text-slate-900 dark:text-white group-hover:text-brand-600 dark:group-hover:text-brand-400">
                  Export Vendors CSV
                </p>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Contacts, quote rates & booking status
                </p>
              </div>
            </button>
          </div>
        </div>

        {/* JSON Backup & Restore */}
        <div>
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-3">
            Full Plan Dossier (JSON Backup)
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <button
              onClick={handleExportJSON}
              className="p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 hover:border-brand-500 dark:hover:border-brand-500 bg-slate-50 dark:bg-slate-800/60 hover:bg-white dark:hover:bg-slate-800 transition-all flex items-center gap-3 text-left group"
            >
              <div className="p-2 rounded-lg bg-brand-100 dark:bg-brand-950/50 text-brand-600 dark:text-brand-400">
                <Download className="w-5 h-5" />
              </div>
              <div>
                <p className="text-sm font-semibold text-slate-900 dark:text-white group-hover:text-brand-600 dark:group-hover:text-brand-400">
                  Download Full Plan
                </p>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Complete JSON backup of this event
                </p>
              </div>
            </button>

            <div>
              <input
                ref={fileInputRef}
                type="file"
                accept=".json"
                onChange={handleFileChange}
                className="hidden"
                id="json-file-input"
              />
              <button
                onClick={() => fileInputRef.current?.click()}
                className="w-full p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 hover:border-brand-500 dark:hover:border-brand-500 bg-slate-50 dark:bg-slate-800/60 hover:bg-white dark:hover:bg-slate-800 transition-all flex items-center gap-3 text-left group"
              >
                <div className="p-2 rounded-lg bg-purple-100 dark:bg-purple-950/50 text-purple-600 dark:text-purple-400">
                  <Upload className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-slate-900 dark:text-white group-hover:text-brand-600 dark:group-hover:text-brand-400">
                    Import Event JSON
                  </p>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    Load previously saved plan
                  </p>
                </div>
              </button>
            </div>
          </div>
        </div>

        {importStatus && (
          <div className="p-3 rounded-lg bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800 text-xs text-emerald-800 dark:text-emerald-300 font-medium flex items-center gap-2">
            <Check className="w-4 h-4 text-emerald-600" />
            {importStatus}
          </div>
        )}

        {importError && (
          <div className="p-3 rounded-lg bg-rose-50 dark:bg-rose-950/30 border border-rose-200 dark:border-rose-800 text-xs text-rose-800 dark:text-rose-300 font-medium flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-rose-600" />
            {importError}
          </div>
        )}

        {/* Reset button */}
        <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex justify-between items-center">
          <button
            onClick={handleReset}
            className="text-xs text-slate-500 hover:text-slate-800 dark:hover:text-slate-300 flex items-center gap-1.5 transition-colors"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            Reset to Sample Events
          </button>
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm font-semibold text-slate-700 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-xl transition-colors"
          >
            Done
          </button>
        </div>
      </div>
    </Modal>
  );
};
