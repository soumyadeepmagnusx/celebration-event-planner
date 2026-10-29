import React, { useState } from 'react';
import { useEvent } from '../../context/EventContext';
import { Vendor, VendorCategory, VendorStatus } from '../../types/event';
import { VENDOR_CATEGORIES, VENDOR_STATUSES } from '../../constants/categories';
import { calculateVendorMetrics } from '../../utils/calculations';
import { formatCurrency } from '../../utils/formatters';
import { generateVendorInquiryLetter } from '../../services/geminiService';
import { VendorNegotiationDraft } from '../../types/ai';
import { Modal } from '../common/Modal';
import { vendorSchema, sanitizeInput } from '../../utils/validation';
import { 
  Store, 
  Plus, 
  Sparkles, 
  Mail, 
  Phone, 
  Trash2, 
  Copy, 
  Check, 
  Loader2 
} from 'lucide-react';

export const VendorList: React.FC = () => {
  const { activeEvent, addVendor, updateVendor, deleteVendor } = useEvent();
  const metrics = calculateVendorMetrics(activeEvent);

  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [isAddVendorModalOpen, setIsAddVendorModalOpen] = useState(false);

  // AI Email Modal State
  const [selectedVendorForAi, setSelectedVendorForAi] = useState<Vendor | null>(null);
  const [aiDraft, setAiDraft] = useState<VendorNegotiationDraft | null>(null);
  const [isDraftingAi, setIsDraftingAi] = useState(false);
  const [copied, setCopied] = useState(false);

  // Add Vendor Form State
  const [vName, setVName] = useState('');
  const [vCategory, setVCategory] = useState<VendorCategory>('venue');
  const [vStatus, setVStatus] = useState<VendorStatus>('researching');
  const [vContact, setVContact] = useState('');
  const [vEmail, setVEmail] = useState('');
  const [vPhone, setVPhone] = useState('');
  const [vWebsite, setVWebsite] = useState('');
  const [vEstCost, setVEstCost] = useState<number>(1000);
  const [vQuote, setVQuote] = useState<number>(0);
  const [vDeposit, setVDeposit] = useState<number>(0);
  const [vNotes, setVNotes] = useState('');
  const [vRating, setVRating] = useState<number>(5);
  const [vErrors, setVErrors] = useState<Record<string, string>>({});

  const filteredVendors = activeEvent.vendors.filter(v => {
    if (statusFilter === 'all') return true;
    return v.status === statusFilter;
  });

  const handleOpenAiDraft = async (vendor: Vendor) => {
    setSelectedVendorForAi(vendor);
    setIsDraftingAi(true);
    setCopied(false);
    try {
      const draft = await generateVendorInquiryLetter(activeEvent, vendor);
      setAiDraft(draft);
    } catch (err) {
      console.error('Failed to generate vendor inquiry letter:', err);
    } finally {
      setIsDraftingAi(false);
    }
  };

  const handleCopyDraft = () => {
    if (!aiDraft) return;
    const fullText = `Subject: ${aiDraft.subject}\n\n${aiDraft.salutation}\n\n${aiDraft.body}\n\nKey Inquiry: ${aiDraft.keyAsk}\n\nReschedule & Contingency: ${aiDraft.contingencyClause}\n\n${aiDraft.signoff}`;
    navigator.clipboard.writeText(fullText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleCreateVendor = (e: React.FormEvent) => {
    e.preventDefault();
    const payload = {
      name: sanitizeInput(vName),
      category: vCategory,
      status: vStatus,
      contactPerson: sanitizeInput(vContact),
      email: vEmail ? sanitizeInput(vEmail) : '',
      phone: sanitizeInput(vPhone),
      website: vWebsite ? sanitizeInput(vWebsite) : '',
      estimatedCost: Number(vEstCost) || 0,
      quoteAmount: Number(vQuote) || 0,
      depositPaid: Number(vDeposit) || 0,
      notes: sanitizeInput(vNotes),
      rating: Number(vRating) || 5,
    };

    const res = vendorSchema.safeParse(payload);
    if (!res.success) {
      const errMap: Record<string, string> = {};
      res.error.issues.forEach(i => {
        if (i.path[0]) errMap[i.path[0].toString()] = i.message;
      });
      setVErrors(errMap);
      return;
    }

    addVendor(res.data);
    setVName('');
    setVContact('');
    setVEmail('');
    setVPhone('');
    setVNotes('');
    setVErrors({});
    setIsAddVendorModalOpen(false);
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Vendor Pipeline Metrics */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
          <p className="text-xs font-semibold text-slate-500 uppercase">Booked & Confirmed</p>
          <p className="text-2xl font-black text-emerald-600 dark:text-emerald-400 mt-1">
            {metrics.booked}
          </p>
          <p className="text-xs text-slate-500 mt-0.5">{formatCurrency(metrics.totalCommittedAmount, activeEvent.currency)} contracted</p>
        </div>

        <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
          <p className="text-xs font-semibold text-slate-500 uppercase">Quotes Under Review</p>
          <p className="text-2xl font-black text-amber-500 mt-1">
            {metrics.quoted}
          </p>
          <p className="text-xs text-slate-500 mt-0.5">Proposals received</p>
        </div>

        <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
          <p className="text-xs font-semibold text-slate-500 uppercase">Initial Outreach</p>
          <p className="text-2xl font-black text-blue-500 mt-1">
            {metrics.contacted + metrics.researching}
          </p>
          <p className="text-xs text-slate-500 mt-0.5">Contacted or researching</p>
        </div>

        <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
          <p className="text-xs font-semibold text-slate-500 uppercase">Deposits Settled</p>
          <p className="text-2xl font-black text-slate-900 dark:text-white mt-1">
            {formatCurrency(metrics.totalDepositPaid, activeEvent.currency)}
          </p>
          <p className="text-xs text-slate-500 mt-0.5">Secured advance payments</p>
        </div>
      </div>

      {/* Filter and Action Header */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200 dark:border-slate-800">
        <div className="flex gap-2 overflow-x-auto no-scrollbar">
          <button
            onClick={() => setStatusFilter('all')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors ${
              statusFilter === 'all'
                ? 'bg-slate-900 text-white dark:bg-white dark:text-slate-900'
                : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400'
            }`}
          >
            All Vendors ({activeEvent.vendors.length})
          </button>
          {VENDOR_STATUSES.map(s => (
            <button
              key={s.id}
              onClick={() => setStatusFilter(s.id)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors ${
                statusFilter === s.id
                  ? 'bg-brand-600 text-white'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400'
              }`}
            >
              {s.label}
            </button>
          ))}
        </div>

        <button
          onClick={() => setIsAddVendorModalOpen(true)}
          className="inline-flex items-center justify-center gap-1.5 px-4 py-2 text-xs font-bold text-white bg-brand-600 hover:bg-brand-700 rounded-xl shadow-sm transition-all whitespace-nowrap"
        >
          <Plus className="w-4 h-4" />
          <span>Add Vendor</span>
        </button>
      </div>

      {/* Vendors Grid */}
      {filteredVendors.length === 0 ? (
        <div className="py-16 text-center bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 text-slate-400 text-xs">
          <Store className="w-10 h-10 mx-auto text-slate-300 dark:text-slate-700 mb-2" />
          No vendors currently match this status filter. Click "Add Vendor" or switch filters.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredVendors.map(vendor => {
            const statusConfig = VENDOR_STATUSES.find(s => s.id === vendor.status) || VENDOR_STATUSES[0];
            const categoryName = VENDOR_CATEGORIES.find(c => c.id === vendor.category)?.name || vendor.category;

            return (
              <div
                key={vendor.id}
                className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-sm hover:shadow-md transition-all flex flex-col justify-between space-y-4 overflow-hidden"
              >
                <div>
                  {/* Luxury Vendor Cover Image */}
                  {vendor.image && (
                    <div className="relative h-40 -mx-5 -mt-5 mb-3 overflow-hidden rounded-t-2xl">
                      <img 
                        src={vendor.image} 
                        alt={vendor.name} 
                        className="w-full h-full object-cover transition-transform duration-500 hover:scale-105" 
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-black/20" />
                      {vendor.role && (
                        <span className="absolute bottom-2 left-3 px-2.5 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider bg-black/70 text-white backdrop-blur-md border border-white/20">
                          {vendor.role}
                        </span>
                      )}
                      {vendor.rating && (
                        <span className="absolute top-2 right-3 px-2 py-0.5 rounded-md text-[11px] font-extrabold bg-amber-500/90 text-white backdrop-blur-md flex items-center gap-1 shadow-sm">
                          ★ {vendor.rating.toFixed(1)}
                        </span>
                      )}
                    </div>
                  )}

                  {/* Category and Status Pill */}
                  <div className="flex items-center justify-between gap-2 mb-2">
                    <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                      {categoryName}
                    </span>
                    <select
                      value={vendor.status}
                      onChange={(e) => updateVendor(vendor.id, { status: e.target.value as VendorStatus })}
                      className={`text-[11px] font-bold px-2 py-0.5 rounded-full border-0 cursor-pointer ${statusConfig.badgeClass}`}
                      aria-label={`Update status for ${vendor.name}`}
                    >
                      {VENDOR_STATUSES.map(s => (
                        <option key={s.id} value={s.id} className="bg-white dark:bg-slate-900 text-slate-900 dark:text-white">
                          {s.label}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Vendor Name */}
                  <h3 className="text-base font-bold text-slate-900 dark:text-white">
                    {vendor.name}
                  </h3>

                  {vendor.notes && (
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 line-clamp-2">
                      {vendor.notes}
                    </p>
                  )}

                  {/* Contact Info */}
                  <div className="mt-3 space-y-1 text-xs text-slate-600 dark:text-slate-400">
                    {vendor.contactPerson && (
                      <p className="font-medium text-slate-800 dark:text-slate-200">
                        Contact: {vendor.contactPerson}
                      </p>
                    )}
                    {vendor.email && (
                      <a href={`mailto:${vendor.email}`} className="flex items-center gap-1.5 hover:text-brand-600 truncate">
                        <Mail className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                        <span className="truncate">{vendor.email}</span>
                      </a>
                    )}
                    {vendor.phone && (
                      <p className="flex items-center gap-1.5">
                        <Phone className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                        <span>{vendor.phone}</span>
                      </p>
                    )}
                  </div>
                </div>

                {/* Financial Rates & Actions */}
                <div className="pt-3 border-t border-slate-100 dark:border-slate-800 space-y-3">
                  <div className="flex justify-between items-center text-xs">
                    <div>
                      <span className="text-slate-400 block text-[10px] uppercase font-bold">Estimated</span>
                      <span className="font-semibold text-slate-700 dark:text-slate-300">
                        {formatCurrency(vendor.estimatedCost, activeEvent.currency)}
                      </span>
                    </div>

                    <div>
                      <span className="text-slate-400 block text-[10px] uppercase font-bold text-right">Quote / Contract</span>
                      <span className="font-extrabold text-slate-900 dark:text-white text-right block">
                        {vendor.quoteAmount > 0 ? formatCurrency(vendor.quoteAmount, activeEvent.currency) : '—'}
                      </span>
                    </div>

                    <div>
                      <span className="text-slate-400 block text-[10px] uppercase font-bold text-right">Deposit Paid</span>
                      <span className="font-semibold text-emerald-600 dark:text-emerald-400 text-right block">
                        {formatCurrency(vendor.depositPaid, activeEvent.currency)}
                      </span>
                    </div>
                  </div>

                  {/* AI Negotiation & Delete Buttons */}
                  <div className="flex items-center gap-2 pt-1">
                    <button
                      onClick={() => handleOpenAiDraft(vendor)}
                      className="flex-1 inline-flex items-center justify-center gap-1.5 px-3 py-1.5 text-xs font-bold rounded-xl text-brand-700 dark:text-brand-300 bg-brand-50 dark:bg-brand-950/40 hover:bg-brand-100 dark:hover:bg-brand-900/60 border border-brand-200 dark:border-brand-900 transition-all"
                    >
                      <Sparkles className="w-3.5 h-3.5" />
                      <span>AI Inquiry Letter</span>
                    </button>

                    <button
                      onClick={() => deleteVendor(vendor.id)}
                      className="p-2 text-slate-400 hover:text-rose-600 rounded-xl hover:bg-rose-50 dark:hover:bg-rose-950/30 transition-colors"
                      title="Delete Vendor"
                      aria-label={`Delete ${vendor.name}`}
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* AI Vendor Inquiry Email Modal */}
      <Modal
        isOpen={Boolean(selectedVendorForAi)}
        onClose={() => {
          setSelectedVendorForAi(null);
          setAiDraft(null);
        }}
        title={`GenAI Inquiry & Negotiation Letter`}
        description={selectedVendorForAi ? `Customized proposal for ${selectedVendorForAi.name} (${selectedVendorForAi.category})` : ''}
        maxWidth="2xl"
      >
        {isDraftingAi ? (
          <div className="py-12 text-center space-y-3">
            <Loader2 className="w-8 h-8 text-brand-600 animate-spin mx-auto" />
            <p className="text-sm font-semibold text-slate-800 dark:text-slate-200">
              Drafting customized vendor inquiry & negotiation clauses...
            </p>
            <p className="text-xs text-slate-500">Tailoring parameters to your budget and guest count</p>
          </div>
        ) : aiDraft ? (
          <div className="space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-slate-800">
              <span className="text-xs text-slate-500">
                Ready to send via email or inquiry form
              </span>
              <button
                onClick={handleCopyDraft}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold text-brand-700 dark:text-brand-300 bg-brand-50 dark:bg-brand-950/40 hover:bg-brand-100 transition-colors"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copied ? 'Copied to Clipboard!' : 'Copy Letter'}</span>
              </button>
            </div>

            {/* Subject */}
            <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/70 border border-slate-200 dark:border-slate-700">
              <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400 block mb-0.5">
                Email Subject
              </span>
              <p className="text-xs font-bold text-slate-900 dark:text-white">
                {aiDraft.subject}
              </p>
            </div>

            {/* Body */}
            <div className="p-4 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs sm:text-sm text-slate-700 dark:text-slate-200 space-y-3 whitespace-pre-line leading-relaxed">
              <p className="font-semibold">{aiDraft.salutation}</p>
              <p>{aiDraft.body}</p>
              
              <div className="p-3 rounded-lg bg-brand-50/50 dark:bg-brand-950/20 border-l-4 border-brand-500 text-xs">
                <span className="font-bold text-brand-900 dark:text-brand-300 block mb-1">Key Negotiation Ask:</span>
                <span>{aiDraft.keyAsk}</span>
              </div>

              <div className="p-3 rounded-lg bg-amber-50/50 dark:bg-amber-950/20 border-l-4 border-amber-500 text-xs">
                <span className="font-bold text-amber-900 dark:text-amber-300 block mb-1">Contingency / Reschedule Clause:</span>
                <span>{aiDraft.contingencyClause}</span>
              </div>

              <p className="pt-2">{aiDraft.signoff}</p>
            </div>

            <div className="pt-2 flex justify-end">
              <button
                type="button"
                onClick={() => {
                  setSelectedVendorForAi(null);
                  setAiDraft(null);
                }}
                className="px-4 py-2 text-sm font-semibold text-slate-700 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 rounded-xl"
              >
                Close
              </button>
            </div>
          </div>
        ) : null}
      </Modal>

      {/* Add Vendor Modal */}
      <Modal
        isOpen={isAddVendorModalOpen}
        onClose={() => setIsAddVendorModalOpen(false)}
        title="Add Vendor Partner"
        description="Add a venue, caterer, photographer, or entertainer to your planning pipeline."
      >
        <form onSubmit={handleCreateVendor} className="space-y-4">
          <div>
            <label htmlFor="vendor-name-input" className="block text-xs font-bold uppercase text-slate-500 mb-1">
              Vendor Business Name
            </label>
            <input
              id="vendor-name-input"
              type="text"
              value={vName}
              onChange={(e) => setVName(e.target.value)}
              placeholder="e.g. Skyline Grand Ballroom"
              className="w-full px-3.5 py-2 text-sm bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl dark:text-white"
            />
            {vErrors.name && <p className="mt-1 text-xs text-rose-500">{vErrors.name}</p>}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label htmlFor="vendor-cat-select" className="block text-xs font-bold uppercase text-slate-500 mb-1">
                Category
              </label>
              <select
                id="vendor-cat-select"
                value={vCategory}
                onChange={(e) => setVCategory(e.target.value as VendorCategory)}
                className="w-full px-3 py-2 text-sm bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl dark:text-white"
              >
                {VENDOR_CATEGORIES.map(c => (
                  <option key={c.id} value={c.id}>{c.name}</option>
                ))}
              </select>
            </div>

            <div>
              <label htmlFor="vendor-status-select" className="block text-xs font-bold uppercase text-slate-500 mb-1">
                Pipeline Status
              </label>
              <select
                id="vendor-status-select"
                value={vStatus}
                onChange={(e) => setVStatus(e.target.value as VendorStatus)}
                className="w-full px-3 py-2 text-sm bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl dark:text-white"
              >
                {VENDOR_STATUSES.map(s => (
                  <option key={s.id} value={s.id}>{s.label}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label htmlFor="vendor-contact-input" className="block text-xs font-bold uppercase text-slate-500 mb-1">
                Contact Person
              </label>
              <input
                id="vendor-contact-input"
                type="text"
                value={vContact}
                onChange={(e) => setVContact(e.target.value)}
                placeholder="e.g. Chef Marco"
                className="w-full px-3 py-2 text-sm bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl dark:text-white"
              />
            </div>

            <div>
              <label htmlFor="vendor-email-input" className="block text-xs font-bold uppercase text-slate-500 mb-1">
                Email
              </label>
              <input
                id="vendor-email-input"
                type="email"
                value={vEmail}
                onChange={(e) => setVEmail(e.target.value)}
                placeholder="events@vendor.com"
                className="w-full px-3 py-2 text-sm bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl dark:text-white"
              />
              {vErrors.email && <p className="mt-1 text-xs text-rose-500">{vErrors.email}</p>}
            </div>

            <div>
              <label htmlFor="vendor-phone-input" className="block text-xs font-bold uppercase text-slate-500 mb-1">
                Phone
              </label>
              <input
                id="vendor-phone-input"
                type="text"
                value={vPhone}
                onChange={(e) => setVPhone(e.target.value)}
                placeholder="(555) 000-0000"
                className="w-full px-3 py-2 text-sm bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl dark:text-white"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label htmlFor="vendor-est-input" className="block text-xs font-bold uppercase text-slate-500 mb-1">
                Estimated Cost ({activeEvent.currency})
              </label>
              <input
                id="vendor-est-input"
                type="number"
                min="0"
                step="50"
                value={vEstCost}
                onChange={(e) => setVEstCost(Number(e.target.value))}
                className="w-full px-3 py-2 text-sm bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl dark:text-white"
              />
            </div>

            <div>
              <label htmlFor="vendor-quote-input" className="block text-xs font-bold uppercase text-slate-500 mb-1">
                Actual Quote Amount
              </label>
              <input
                id="vendor-quote-input"
                type="number"
                min="0"
                step="50"
                value={vQuote}
                onChange={(e) => setVQuote(Number(e.target.value))}
                className="w-full px-3 py-2 text-sm bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl dark:text-white"
              />
            </div>

            <div>
              <label htmlFor="vendor-deposit-input" className="block text-xs font-bold uppercase text-slate-500 mb-1">
                Deposit Paid
              </label>
              <input
                id="vendor-deposit-input"
                type="number"
                min="0"
                step="50"
                value={vDeposit}
                onChange={(e) => setVDeposit(Number(e.target.value))}
                className="w-full px-3 py-2 text-sm bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl dark:text-white"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label htmlFor="vendor-website-input" className="block text-xs font-bold uppercase text-slate-500 mb-1">
                Website URL (Optional)
              </label>
              <input
                id="vendor-website-input"
                type="url"
                value={vWebsite}
                onChange={(e) => setVWebsite(e.target.value)}
                placeholder="https://..."
                className="w-full px-3 py-2 text-sm bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl dark:text-white"
              />
              {vErrors.website && <p className="mt-1 text-xs text-rose-500">{vErrors.website}</p>}
            </div>

            <div>
              <label htmlFor="vendor-rating-input" className="block text-xs font-bold uppercase text-slate-500 mb-1">
                Rating (1–5 Stars)
              </label>
              <select
                id="vendor-rating-input"
                value={vRating}
                onChange={(e) => setVRating(Number(e.target.value))}
                className="w-full px-3 py-2 text-sm bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl dark:text-white"
              >
                <option value={5}>★★★★★ (5 - Preferred)</option>
                <option value={4}>★★★★☆ (4 - Recommended)</option>
                <option value={3}>★★★☆☆ (3 - Standard)</option>
              </select>
            </div>
          </div>

          <div>
            <label htmlFor="vendor-notes-input" className="block text-xs font-bold uppercase text-slate-500 mb-1">
              Deliverables & Requirements Notes
            </label>
            <textarea
              id="vendor-notes-input"
              rows={2}
              value={vNotes}
              onChange={(e) => setVNotes(e.target.value)}
              placeholder="e.g. Includes setup, teardown, and liability insurance rider."
              className="w-full px-3.5 py-2 text-sm bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl dark:text-white"
            />
          </div>

          <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex justify-end gap-2">
            <button
              type="button"
              onClick={() => setIsAddVendorModalOpen(false)}
              className="px-4 py-2 text-sm text-slate-600 dark:text-slate-400 hover:bg-slate-100 rounded-xl"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 text-sm font-bold text-white bg-brand-600 hover:bg-brand-700 rounded-xl shadow-sm"
            >
              Save Vendor
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
