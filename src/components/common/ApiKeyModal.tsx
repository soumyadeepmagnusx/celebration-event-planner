import React, { useState } from 'react';
import { Modal } from './Modal';
import { useEvent } from '../../context/EventContext';
import { Key, Sparkles, CheckCircle2, AlertCircle, ShieldCheck } from 'lucide-react';

interface ApiKeyModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ApiKeyModal: React.FC<ApiKeyModalProps> = ({ isOpen, onClose }) => {
  const { apiKey, setApiKey } = useEvent();
  const [inputKey, setInputKey] = useState<string>(apiKey);
  const [testStatus, setTestStatus] = useState<'idle' | 'testing' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState<string>('');

  const handleSave = () => {
    setApiKey(inputKey);
    onClose();
  };

  const handleTestKey = async () => {
    if (!inputKey.trim()) {
      setTestStatus('error');
      setErrorMessage('Please enter an API key to test.');
      return;
    }

    setTestStatus('testing');
    setErrorMessage('');

    try {
      const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${inputKey.trim()}`;
      const res = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ parts: [{ text: 'Respond with "OK"' }] }],
        }),
      });

      if (!res.ok) {
        const text = await res.text();
        throw new Error(`Invalid Key (${res.status}): ${text}`);
      }

      setTestStatus('success');
    } catch (err: any) {
      setTestStatus('error');
      setErrorMessage(err.message || 'Verification failed. Check your API key.');
    }
  };

  const handleClear = () => {
    setInputKey('');
    setApiKey('');
    setTestStatus('idle');
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="GenAI Services & Gemini API Configuration"
      description="Connect Google Gemini API for live multi-modal AI generation or run in intelligent offline mode."
    >
      <div className="space-y-5">
        <div className="p-4 rounded-xl bg-brand-50/50 dark:bg-brand-950/20 border border-brand-200 dark:border-brand-900/50 flex items-start gap-3">
          <Sparkles className="w-5 h-5 text-brand-600 dark:text-brand-400 mt-0.5 shrink-0" />
          <div className="text-xs text-brand-900 dark:text-brand-200 leading-relaxed">
            <strong>Hybrid AI Engine:</strong> Celebratify AI integrates Google Gemini models (2.5 Flash / 1.5 Flash) with an intelligent fallback engine. Even without an API key, all budget optimizers, vendor inquiry drafts, and ideation tools will work seamlessly!
          </div>
        </div>

        <div>
          <label htmlFor="gemini-key-input" className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
            Google Gemini API Key (Optional)
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
              <Key className="w-4 h-4" />
            </div>
            <input
              id="gemini-key-input"
              type="password"
              value={inputKey}
              onChange={(e) => {
                setInputKey(e.target.value);
                setTestStatus('idle');
              }}
              placeholder="AIzaSy..."
              className="w-full pl-10 pr-4 py-2.5 text-sm bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-brand-500 focus:border-brand-500 dark:text-white"
            />
          </div>
          <p className="mt-1.5 text-xs text-slate-500 dark:text-slate-400 flex items-center gap-1">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
            Keys are strictly saved in your local browser sandbox and never sent to external servers.
          </p>
        </div>

        {testStatus === 'success' && (
          <div className="p-3 rounded-lg bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800 flex items-center gap-2 text-xs text-emerald-800 dark:text-emerald-300 font-medium">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            Gemini API key verified successfully! Live AI generation active.
          </div>
        )}

        {testStatus === 'error' && (
          <div className="p-3 rounded-lg bg-rose-50 dark:bg-rose-950/30 border border-rose-200 dark:border-rose-800 flex items-start gap-2 text-xs text-rose-800 dark:text-rose-300 font-medium">
            <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
            <div>
              <p>Key test failed.</p>
              <p className="text-[11px] opacity-80 mt-0.5">{errorMessage}</p>
            </div>
          </div>
        )}

        <div className="flex items-center justify-between pt-3 border-t border-slate-100 dark:border-slate-800">
          <div className="flex gap-2">
            <button
              type="button"
              onClick={handleTestKey}
              disabled={testStatus === 'testing' || !inputKey.trim()}
              className="px-3.5 py-2 text-xs font-semibold text-slate-700 dark:text-slate-200 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-lg transition-colors disabled:opacity-50"
            >
              {testStatus === 'testing' ? 'Verifying...' : 'Test Connection'}
            </button>
            {inputKey && (
              <button
                type="button"
                onClick={handleClear}
                className="px-3 py-2 text-xs text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/30 rounded-lg transition-colors"
              >
                Clear
              </button>
            )}
          </div>

          <div className="flex gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-colors"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleSave}
              className="px-4 py-2 text-sm font-semibold text-white bg-brand-600 hover:bg-brand-700 rounded-xl transition-colors shadow-sm shadow-brand-500/20"
            >
              Save Key
            </button>
          </div>
        </div>
      </div>
    </Modal>
  );
};
