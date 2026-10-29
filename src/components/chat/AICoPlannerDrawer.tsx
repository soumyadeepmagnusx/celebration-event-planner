import React, { useState, useRef, useEffect } from 'react';
import { useEvent } from '../../context/EventContext';
import { 
  Sparkles, 
  X, 
  Send, 
  Trash2, 
  Loader2, 
  Bot, 
  User, 
  Lightbulb
} from 'lucide-react';

export const AICoPlannerDrawer: React.FC = () => {
  const { 
    activeEvent, 
    chatMessages, 
    sendChatMessage, 
    clearChat, 
    isGeneratingAI, 
    isDrawerOpen, 
    setIsDrawerOpen 
  } = useEvent();

  const [inputMessage, setInputMessage] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isDrawerOpen) {
      setTimeout(() => inputRef.current?.focus(), 100);
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [isDrawerOpen, chatMessages]);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputMessage.trim() || isGeneratingAI) return;
    const msg = inputMessage;
    setInputMessage('');
    await sendChatMessage(msg);
  };

  const quickPrompts = [
    `How can I trim 10% off my catering budget?`,
    `What is the best order for Day-Of toasts & first dance?`,
    `Draft 3 questions to ask my photographer before signing.`,
    `What should our Plan B be for sudden rain?`,
  ];

  if (!isDrawerOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 overflow-hidden"
      role="dialog"
      aria-modal="true"
      aria-label="AI Co-Planner Assistant"
    >
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-slate-950/60 backdrop-blur-sm transition-opacity"
        onClick={() => setIsDrawerOpen(false)}
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md sm:max-w-lg bg-white dark:bg-slate-900 border-l border-slate-200 dark:border-slate-800 shadow-2xl flex flex-col h-full">
          {/* Drawer Header */}
          <div className="p-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between bg-slate-50/80 dark:bg-slate-900/80">
            <div className="flex items-center gap-2.5">
              <div className="p-2 rounded-xl bg-gradient-to-tr from-brand-600 to-pink-500 text-white shadow-sm">
                <Sparkles className="w-4 h-4 animate-pulse" />
              </div>
              <div>
                <h2 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                  Celebratify Co-Planner
                </h2>
                <p className="text-[11px] text-slate-500 dark:text-slate-400">
                  Planning: <span className="font-semibold text-slate-700 dark:text-slate-300">{activeEvent.title}</span>
                </p>
              </div>
            </div>

            <div className="flex items-center gap-1">
              <button
                onClick={clearChat}
                className="p-2 text-slate-400 hover:text-rose-600 rounded-lg transition-colors"
                title="Clear Chat History"
                aria-label="Clear Chat History"
              >
                <Trash2 className="w-4 h-4" />
              </button>
              <button
                onClick={() => setIsDrawerOpen(false)}
                className="p-2 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 rounded-lg transition-colors"
                aria-label="Close Assistant Drawer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Messages Scroll Area */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {chatMessages.map((msg) => {
              const isAssistant = msg.role === 'assistant';
              return (
                <div
                  key={msg.id}
                  className={`flex items-start gap-3 ${isAssistant ? '' : 'flex-row-reverse'}`}
                >
                  <div className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 text-xs font-bold ${
                    isAssistant
                      ? 'bg-brand-100 text-brand-700 dark:bg-brand-950 dark:text-brand-300'
                      : 'bg-slate-900 text-white dark:bg-slate-100 dark:text-slate-900'
                  }`}>
                    {isAssistant ? <Bot className="w-4 h-4" /> : <User className="w-4 h-4" />}
                  </div>

                  <div className={`max-w-[85%] rounded-2xl p-3.5 text-xs sm:text-sm leading-relaxed whitespace-pre-line shadow-sm ${
                    isAssistant
                      ? 'bg-slate-50 dark:bg-slate-800/80 border border-slate-200/60 dark:border-slate-700 text-slate-800 dark:text-slate-200'
                      : 'bg-gradient-to-r from-brand-600 to-pink-600 text-white'
                  }`}>
                    {msg.content}
                    <div className={`text-[10px] mt-1.5 opacity-60 text-right`}>
                      {msg.timestamp}
                    </div>
                  </div>
                </div>
              );
            })}

            {isGeneratingAI && (
              <div className="flex items-start gap-3">
                <div className="w-7 h-7 rounded-lg bg-brand-100 dark:bg-brand-950 flex items-center justify-center text-brand-600">
                  <Bot className="w-4 h-4 animate-spin" />
                </div>
                <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200/60 dark:border-slate-700 text-xs text-slate-500 flex items-center gap-2">
                  <Loader2 className="w-3.5 h-3.5 animate-spin text-brand-600" />
                  <span>Thinking & formulating recommendations...</span>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Quick Suggestion Chips */}
          <div className="px-4 py-2 border-t border-slate-100 dark:border-slate-800/80 bg-slate-50/50 dark:bg-slate-900/50">
            <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1.5 flex items-center gap-1">
              <Lightbulb className="w-3 h-3 text-amber-500" /> Quick Inquiries
            </p>
            <div className="flex gap-1.5 overflow-x-auto no-scrollbar py-0.5">
              {quickPrompts.map((prompt, idx) => (
                <button
                  key={idx}
                  onClick={() => sendChatMessage(prompt)}
                  disabled={isGeneratingAI}
                  className="px-2.5 py-1 rounded-lg text-[11px] font-medium bg-white dark:bg-slate-800 hover:bg-brand-50 dark:hover:bg-brand-950/40 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 whitespace-nowrap transition-colors disabled:opacity-50"
                >
                  {prompt}
                </button>
              ))}
            </div>
          </div>

          {/* Drawer Input Form */}
          <form onSubmit={handleSend} className="p-3.5 border-t border-slate-200 dark:border-slate-800 flex items-center gap-2 bg-white dark:bg-slate-900">
            <input
              ref={inputRef}
              type="text"
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              placeholder="Ask anything about budgets, vendors, or timelines..."
              className="flex-1 px-3.5 py-2.5 text-xs sm:text-sm bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-brand-500 dark:text-white"
            />
            <button
              type="submit"
              disabled={isGeneratingAI || !inputMessage.trim()}
              className="p-2.5 rounded-xl bg-brand-600 hover:bg-brand-700 text-white disabled:opacity-50 transition-colors shadow-sm"
              aria-label="Send message to AI assistant"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
