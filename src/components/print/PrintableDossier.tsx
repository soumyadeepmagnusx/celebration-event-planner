import React from 'react';
import { useEvent } from '../../context/EventContext';
import { formatCurrency, formatDate } from '../../utils/formatters';
import { calculateBudgetMetrics } from '../../utils/calculations';
import { triggerPrintDossier } from '../../services/exportService';
import { Printer } from 'lucide-react';

export const PrintableDossier: React.FC = () => {
  const { activeEvent } = useEvent();
  const metrics = calculateBudgetMetrics(activeEvent);

  return (
    <div className="space-y-6 animate-fadeIn max-w-4xl mx-auto">
      {/* Action Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-sm print:hidden">
        <div>
          <h2 className="text-base font-bold text-slate-900 dark:text-white">
            Official Event Planning Dossier & Executive Summary
          </h2>
          <p className="text-xs text-slate-500">
            Clean, printable format designed for physical binders, team distribution, or PDF export.
          </p>
        </div>
        <button
          onClick={triggerPrintDossier}
          className="inline-flex items-center gap-2 px-5 py-2.5 text-xs font-bold text-white bg-slate-900 dark:bg-brand-600 hover:bg-slate-800 dark:hover:bg-brand-700 rounded-xl shadow-md transition-all self-start sm:self-auto"
        >
          <Printer className="w-4 h-4" />
          <span>Print / Save as PDF</span>
        </button>
      </div>

      {/* Printable Sheet */}
      <div className="bg-white text-slate-900 p-8 sm:p-12 rounded-2xl border border-slate-200 shadow-lg print:shadow-none print:border-none print:p-0 space-y-8 font-sans">
        {/* Dossier Header */}
        <div className="border-b-2 border-slate-900 pb-6 flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div>
            <p className="text-xs uppercase font-extrabold tracking-widest text-slate-500">
              Celebratify AI Master Plan
            </p>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-950 mt-1">
              {activeEvent.title}
            </h1>
            <p className="text-xs text-slate-600 mt-1 font-medium">
              Category: <span className="uppercase font-bold">{activeEvent.type}</span> | Location: {activeEvent.location}
            </p>
          </div>

          <div className="text-left sm:text-right space-y-0.5 text-xs">
            <p><strong>Event Date:</strong> {formatDate(activeEvent.date)}</p>
            <p><strong>Expected Attendance:</strong> {activeEvent.guestCount} Guests</p>
            <p><strong>Target Budget:</strong> {formatCurrency(activeEvent.totalBudget, activeEvent.currency)}</p>
          </div>
        </div>

        {/* Section 1: Budget Summary & Categories */}
        <div className="space-y-3">
          <h3 className="text-sm font-extrabold uppercase tracking-wider text-slate-900 border-b border-slate-200 pb-1">
            1. Financial Overview & Allocations
          </h3>
          <div className="grid grid-cols-3 gap-4 text-xs p-3 bg-slate-50 rounded-lg">
            <div>
              <span className="text-slate-500 block">Total Estimated:</span>
              <span className="font-bold text-slate-900 text-sm">
                {formatCurrency(metrics.totalEstimated, activeEvent.currency)}
              </span>
            </div>
            <div>
              <span className="text-slate-500 block">Actual Incurred:</span>
              <span className="font-bold text-slate-900 text-sm">
                {formatCurrency(metrics.totalActual, activeEvent.currency)}
              </span>
            </div>
            <div>
              <span className="text-slate-500 block">Remaining Variance:</span>
              <span className={`font-bold text-sm ${metrics.isOverBudget ? 'text-rose-600' : 'text-emerald-700'}`}>
                {formatCurrency(metrics.remainingBudget, activeEvent.currency)}
              </span>
            </div>
          </div>

          <table className="w-full text-left text-xs border border-slate-200">
            <thead className="bg-slate-100 text-slate-700 font-bold">
              <tr>
                <th className="p-2 border-b border-slate-200">Category</th>
                <th className="p-2 border-b border-slate-200">Item</th>
                <th className="p-2 border-b border-slate-200 text-right">Estimated</th>
                <th className="p-2 border-b border-slate-200 text-right">Actual</th>
                <th className="p-2 border-b border-slate-200 text-center">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {activeEvent.budgetItems.map(item => (
                <tr key={item.id}>
                  <td className="p-2 uppercase text-[10px] font-bold text-slate-500">{item.category}</td>
                  <td className="p-2 font-medium">{item.name}</td>
                  <td className="p-2 text-right">{formatCurrency(item.estimatedCost, activeEvent.currency)}</td>
                  <td className="p-2 text-right">{item.actualCost > 0 ? formatCurrency(item.actualCost, activeEvent.currency) : '—'}</td>
                  <td className="p-2 text-center font-bold text-[10px]">
                    {item.paid ? <span className="text-emerald-700">PAID</span> : <span className="text-slate-400">PENDING</span>}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Section 2: Day-Of Itinerary */}
        <div className="space-y-3">
          <h3 className="text-sm font-extrabold uppercase tracking-wider text-slate-900 border-b border-slate-200 pb-1">
            2. Day-Of Execution Schedule (Run of Show)
          </h3>
          <div className="space-y-2">
            {activeEvent.runOfShow.map(ros => (
              <div key={ros.id} className="p-2.5 rounded border border-slate-200 flex justify-between items-start text-xs">
                <div>
                  <span className="font-bold text-slate-950 mr-2">[{ros.time}]</span>
                  <span className="font-bold">{ros.title}</span>
                  {ros.notes && <p className="text-slate-600 text-[11px] mt-0.5">{ros.notes}</p>}
                </div>
                <div className="text-right text-[11px] text-slate-500 shrink-0 ml-4">
                  <p>Lead: {ros.leadPerson}</p>
                  <p>Location: {ros.location}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Section 3: Confirmed Vendors */}
        <div className="space-y-3">
          <h3 className="text-sm font-extrabold uppercase tracking-wider text-slate-900 border-b border-slate-200 pb-1">
            3. Key Vendor Contacts & Contract Directory
          </h3>
          <div className="grid grid-cols-2 gap-3 text-xs">
            {activeEvent.vendors.map(v => (
              <div key={v.id} className="p-3 rounded border border-slate-200 space-y-1">
                <div className="flex justify-between items-center">
                  <span className="font-bold text-slate-900">{v.name}</span>
                  <span className="text-[10px] uppercase font-bold text-slate-500">{v.category}</span>
                </div>
                <p className="text-slate-600">Contact: {v.contactPerson || 'N/A'} {v.phone && `(${v.phone})`}</p>
                {v.email && <p className="text-slate-600">{v.email}</p>}
                <p className="text-[11px] font-semibold text-slate-800">
                  Status: <span className="uppercase font-bold">{v.status}</span> | Agreed: {v.quoteAmount > 0 ? formatCurrency(v.quoteAmount, activeEvent.currency) : 'Pending'}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Section 4: Emergency Plan B Contingencies */}
        {activeEvent.contingencies.length > 0 && (
          <div className="space-y-2">
            <h3 className="text-sm font-extrabold uppercase tracking-wider text-slate-900 border-b border-slate-200 pb-1">
              4. Emergency Contingency Plan B
            </h3>
            <div className="space-y-1.5 text-xs">
              {activeEvent.contingencies.map(c => (
                <div key={c.id} className="p-2 rounded bg-slate-50 border border-slate-200">
                  <p className="font-bold text-slate-900">⚠️ Risk: {c.risk} ({c.severity} Severity)</p>
                  <p className="text-slate-700 mt-0.5">Plan B Action: {c.planBAction}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Dossier Footer */}
        <div className="pt-6 border-t border-slate-200 text-center text-[10px] text-slate-400">
          Generated via Celebratify AI • PromptWars [Challenge 5] Celebration & Event Planner Assistant
        </div>
      </div>
    </div>
  );
};
