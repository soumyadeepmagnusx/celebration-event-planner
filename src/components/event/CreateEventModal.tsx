import React, { useState } from 'react';
import { Modal } from '../common/Modal';
import { useEvent } from '../../context/EventContext';
import { 
  EventType, 
  CurrencyCode, 
  EventData, 
  BudgetItem, 
  Milestone, 
  RunOfShowItem, 
  Vendor, 
  ThemeIdea, 
  InvitationCopy, 
  MenuIdea, 
  EntertainmentIdea, 
  SpeechIdea, 
  ContingencyPlan 
} from '../../types/event';
import { EVENT_TYPE_DETAILS, CURRENCIES } from '../../constants/categories';
import { createEventSchema, sanitizeInput } from '../../utils/validation';
import { generateCompleteEventPlan } from '../../services/geminiService';
import { Sparkles, Calendar, MapPin, Users, Wallet, Loader2 } from 'lucide-react';

interface CreateEventModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const CreateEventModal: React.FC<CreateEventModalProps> = ({ isOpen, onClose }) => {
  const { createEvent } = useEvent();
  
  const [eventType, setEventType] = useState<EventType>('wedding');
  const [title, setTitle] = useState('');
  const [date, setDate] = useState('');
  const [location, setLocation] = useState('');
  const [guestCount, setGuestCount] = useState<number>(100);
  const [totalBudget, setTotalBudget] = useState<number>(15000);
  const [currency, setCurrency] = useState<CurrencyCode>('USD');
  const [specialRequests, setSpecialRequests] = useState('');

  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  // When event type changes, update sensible default title & budget
  const handleTypeChange = (type: EventType) => {
    setEventType(type);
    const defaults = EVENT_TYPE_DETAILS[type];
    if (!title || Object.values(EVENT_TYPE_DETAILS).some(d => title.includes(d.label))) {
      setTitle(defaults.label);
    }
    setTotalBudget(defaults.defaultBudget);
    setGuestCount(defaults.defaultGuests);
  };

  const handleSubmit = async (useAiPlan: boolean) => {
    const rawData = {
      title: sanitizeInput(title || EVENT_TYPE_DETAILS[eventType].label),
      type: eventType,
      date: date || new Date(Date.now() + 90 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      location: sanitizeInput(location || 'Metropolitan Grand Plaza'),
      guestCount: Number(guestCount) || 100,
      totalBudget: Number(totalBudget) || 10000,
      currency,
      themeNotes: sanitizeInput(specialRequests),
    };

    const validation = createEventSchema.safeParse(rawData);
    if (!validation.success) {
      const fieldErrors: Record<string, string> = {};
      validation.error.issues.forEach(issue => {
        if (issue.path[0]) fieldErrors[issue.path[0].toString()] = issue.message;
      });
      setErrors(fieldErrors);
      return;
    }

    setErrors({});
    setIsLoading(true);

    try {
      let planDetails: {
        budgetItems: BudgetItem[];
        milestones: Milestone[];
        runOfShow: RunOfShowItem[];
        vendors: Vendor[];
        themes: ThemeIdea[];
        invitations: InvitationCopy[];
        menus: MenuIdea[];
        entertainment: EntertainmentIdea[];
        speeches: SpeechIdea[];
        contingencies: ContingencyPlan[];
      } = {
        budgetItems: [],
        milestones: [],
        runOfShow: [],
        vendors: [],
        themes: [],
        invitations: [],
        menus: [],
        entertainment: [],
        speeches: [],
        contingencies: [],
      };

      if (useAiPlan) {
        const aiResponse = await generateCompleteEventPlan({
          title: rawData.title,
          type: rawData.type,
          date: rawData.date,
          location: rawData.location,
          guestCount: rawData.guestCount,
          totalBudget: rawData.totalBudget,
          currency: rawData.currency,
          specialRequests: rawData.themeNotes,
        });

        planDetails = {
          ...aiResponse,
          runOfShow: [
            { id: `ros-${Date.now()}-1`, time: '02:00 PM', title: 'Vendor Load-In & Audio Check', durationMinutes: 60, leadPerson: 'Event Lead', location: rawData.location, notes: 'Verify setup, mic frequencies, and floral placement.', completed: false },
            { id: `ros-${Date.now()}-2`, time: '04:00 PM', title: 'Guest Arrival & Welcome Refreshments', durationMinutes: 45, leadPerson: 'Hospitality Team', location: 'Main Foyer', notes: 'Welcome drinks and coat check.', completed: false },
            { id: `ros-${Date.now()}-3`, time: '05:00 PM', title: 'Main Program & Ceremony', durationMinutes: 60, leadPerson: 'Host / Emcee', location: 'Main Stage', notes: 'Key milestones, vows/speeches, and toast.', completed: false },
            { id: `ros-${Date.now()}-4`, time: '06:30 PM', title: 'Dinner Feast & Table Service', durationMinutes: 90, leadPerson: 'Catering Lead', location: 'Dining Hall', notes: 'Signature entrees and dietary courses served.', completed: false },
            { id: `ros-${Date.now()}-5`, time: '08:30 PM', title: 'Dance Floor & Grand Finale', durationMinutes: 120, leadPerson: 'DJ / Band', location: 'Dance Area', notes: 'Celebration anthems and photo station.', completed: false },
          ],
        };
      }

      const newEvent: EventData = {
        id: `evt-${Date.now()}`,
        ...rawData,
        ...planDetails,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      createEvent(newEvent);
      onClose();
    } catch (err) {
      console.error('Failed to create event:', err);
      alert('An unexpected error occurred while generating your plan. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Plan a New Celebration"
      description="Create a wedding, birthday, or community festival with instant GenAI-powered budgets and timelines."
      maxWidth="2xl"
    >
      <form onSubmit={(e) => { e.preventDefault(); handleSubmit(true); }} className="space-y-5">
        {/* Event Type Grid */}
        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-2">
            1. Select Celebration Category
          </label>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
            {(Object.keys(EVENT_TYPE_DETAILS) as EventType[]).map((type) => {
              const info = EVENT_TYPE_DETAILS[type];
              const isSelected = eventType === type;
              return (
                <button
                  key={type}
                  type="button"
                  onClick={() => handleTypeChange(type)}
                  className={`p-3 rounded-xl border text-left transition-all flex items-start gap-2.5 ${
                    isSelected
                      ? 'border-brand-500 bg-brand-50/70 dark:bg-brand-950/40 text-brand-950 dark:text-brand-100 ring-2 ring-brand-500/20 shadow-sm'
                      : 'border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300'
                  }`}
                >
                  <span className="text-2xl shrink-0">{info.icon}</span>
                  <div>
                    <p className="text-xs font-bold leading-tight">{info.label.split(' ')[0]}</p>
                    <p className="text-[10px] text-slate-500 dark:text-slate-400 mt-0.5 line-clamp-1">{info.description}</p>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Title */}
        <div>
          <label htmlFor="event-title-input" className="block text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1">
            2. Event Title
          </label>
          <input
            id="event-title-input"
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="e.g. Liam & Sophia’s Autumn Vineyard Wedding"
            className="w-full px-3.5 py-2.5 text-sm bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-brand-500 dark:text-white"
          />
          {errors.title && <p className="mt-1 text-xs text-rose-500">{errors.title}</p>}
        </div>

        {/* Date & Location Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label htmlFor="event-date-input" className="block text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1">
              Event Date
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                <Calendar className="w-4 h-4" />
              </div>
              <input
                id="event-date-input"
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full pl-10 pr-3.5 py-2.5 text-sm bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-brand-500 dark:text-white"
              />
            </div>
            {errors.date && <p className="mt-1 text-xs text-rose-500">{errors.date}</p>}
          </div>

          <div>
            <label htmlFor="event-location-input" className="block text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1">
              Venue / City Location
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                <MapPin className="w-4 h-4" />
              </div>
              <input
                id="event-location-input"
                type="text"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="e.g. Napa Valley, CA"
                className="w-full pl-10 pr-3.5 py-2.5 text-sm bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-brand-500 dark:text-white"
              />
            </div>
            {errors.location && <p className="mt-1 text-xs text-rose-500">{errors.location}</p>}
          </div>
        </div>

        {/* Guests, Budget, Currency */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label htmlFor="event-guests-input" className="block text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1">
              Estimated Guests
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                <Users className="w-4 h-4" />
              </div>
              <input
                id="event-guests-input"
                type="number"
                min="1"
                value={guestCount}
                onChange={(e) => setGuestCount(Number(e.target.value))}
                className="w-full pl-10 pr-3.5 py-2.5 text-sm bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-brand-500 dark:text-white"
              />
            </div>
          </div>

          <div>
            <label htmlFor="event-budget-input" className="block text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1">
              Target Budget
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                <Wallet className="w-4 h-4" />
              </div>
              <input
                id="event-budget-input"
                type="number"
                min="0"
                step="100"
                value={totalBudget}
                onChange={(e) => setTotalBudget(Number(e.target.value))}
                className="w-full pl-10 pr-3.5 py-2.5 text-sm bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-brand-500 dark:text-white"
              />
            </div>
          </div>

          <div>
            <label htmlFor="event-currency-select" className="block text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1">
              Currency
            </label>
            <select
              id="event-currency-select"
              value={currency}
              onChange={(e) => setCurrency(e.target.value as CurrencyCode)}
              className="w-full px-3.5 py-2.5 text-sm bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-brand-500 dark:text-white"
            >
              {(Object.keys(CURRENCIES) as CurrencyCode[]).map((c) => (
                <option key={c} value={c}>
                  {CURRENCIES[c].symbol} ({c})
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Special requests / Vibe */}
        <div>
          <label htmlFor="special-requests-input" className="block text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1">
            Theme Ideas or Special Requests (Optional)
          </label>
          <textarea
            id="special-requests-input"
            rows={2}
            value={specialRequests}
            onChange={(e) => setSpecialRequests(e.target.value)}
            placeholder="e.g. Boho chic aesthetic, rustic fairy lights, acoustic music, lots of vegan dishes..."
            className="w-full px-3.5 py-2 text-sm bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-brand-500 dark:text-white"
          />
        </div>

        {/* Actions */}
        <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-3">
          <button
            type="button"
            disabled={isLoading}
            onClick={() => handleSubmit(false)}
            className="w-full sm:w-auto px-4 py-2.5 text-xs font-semibold text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-colors"
          >
            Create Blank Plan
          </button>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            <button
              type="button"
              disabled={isLoading}
              onClick={onClose}
              className="w-1/2 sm:w-auto px-4 py-2.5 text-sm font-medium text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="w-1/2 sm:w-auto px-5 py-2.5 text-sm font-bold text-white bg-gradient-to-r from-brand-600 to-pink-600 hover:from-brand-700 hover:to-pink-700 rounded-xl shadow-md shadow-brand-500/25 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Generating with AI...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" />
                  <span>Generate Full AI Plan</span>
                </>
              )}
            </button>
          </div>
        </div>
      </form>
    </Modal>
  );
};
