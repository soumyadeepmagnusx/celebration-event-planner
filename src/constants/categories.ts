import { BudgetCategory, CurrencyCode, CurrencyConfig, EventType, TimelinePhase, VendorCategory, VendorStatus } from '../types/event';

export const CURRENCIES: Record<CurrencyCode, CurrencyConfig> = {
  USD: { code: 'USD', symbol: '$', name: 'US Dollar (USD)' },
  INR: { code: 'INR', symbol: '₹', name: 'Indian Rupee (INR)' },
  EUR: { code: 'EUR', symbol: '€', name: 'Euro (EUR)' },
  GBP: { code: 'GBP', symbol: '£', name: 'British Pound (GBP)' },
  CAD: { code: 'CAD', symbol: 'C$', name: 'Canadian Dollar (CAD)' },
  AUD: { code: 'AUD', symbol: 'A$', name: 'Australian Dollar (AUD)' },
};

export const BUDGET_CATEGORIES: { id: BudgetCategory; name: string; color: string; defaultBenchmarkPct: number }[] = [
  { id: 'venue', name: 'Venue & Facilities', color: '#6366f1', defaultBenchmarkPct: 25 },
  { id: 'catering', name: 'Food & Beverage', color: '#f59e0b', defaultBenchmarkPct: 30 },
  { id: 'decor', name: 'Decor, Florals & Lighting', color: '#ec4899', defaultBenchmarkPct: 12 },
  { id: 'photography', name: 'Photo & Video', color: '#8b5cf6', defaultBenchmarkPct: 10 },
  { id: 'entertainment', name: 'Music, Sound & Fun', color: '#06b6d4', defaultBenchmarkPct: 8 },
  { id: 'attire', name: 'Attire & Styling', color: '#10b981', defaultBenchmarkPct: 5 },
  { id: 'logistics', name: 'Transport & Logistics', color: '#64748b', defaultBenchmarkPct: 4 },
  { id: 'marketing', name: 'Invitations & Marketing', color: '#f97316', defaultBenchmarkPct: 2 },
  { id: 'permits', name: 'Licenses & Security', color: '#14b8a6', defaultBenchmarkPct: 1 },
  { id: 'contingency', name: 'Contingency & Reserve', color: '#ef4444', defaultBenchmarkPct: 3 },
];

export const VENDOR_STATUSES: { id: VendorStatus; label: string; badgeClass: string }[] = [
  { id: 'researching', label: 'Researching', badgeClass: 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300' },
  { id: 'contacted', label: 'Contacted', badgeClass: 'bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300' },
  { id: 'quoted', label: 'Quote Received', badgeClass: 'bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300' },
  { id: 'booked', label: 'Booked / Confirmed', badgeClass: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300' },
  { id: 'completed', label: 'Delivered / Paid', badgeClass: 'bg-purple-100 text-purple-700 dark:bg-purple-900/40 dark:text-purple-300' },
  { id: 'cancelled', label: 'Declined', badgeClass: 'bg-rose-100 text-rose-700 dark:bg-rose-900/40 dark:text-rose-300' },
];

export const VENDOR_CATEGORIES: { id: VendorCategory; name: string }[] = [
  { id: 'venue', name: 'Venue & Banquet Hall' },
  { id: 'catering', name: 'Catering & Beverages' },
  { id: 'florist', name: 'Florist & Botanical Decor' },
  { id: 'photography', name: 'Lead Photographer' },
  { id: 'videography', name: 'Cinematographer / Drone' },
  { id: 'dj_music', name: 'DJ & Sound Production' },
  { id: 'cake', name: 'Baker & Artisanal Cake' },
  { id: 'transport', name: 'Chauffeuring & Shuttle' },
  { id: 'rentals', name: 'Furniture & Tableware Rentals' },
  { id: 'entertainment', name: 'Performers & Games' },
  { id: 'speaker', name: 'Emcee & Host' },
  { id: 'security', name: 'Security & First Aid' },
  { id: 'other', name: 'Specialty Vendor' },
];

export const TIMELINE_PHASES: { id: TimelinePhase; label: string; offsetOrder: number }[] = [
  { id: '12_months', label: '9–12 Months Ahead', offsetOrder: 1 },
  { id: '6_months', label: '4–6 Months Ahead', offsetOrder: 2 },
  { id: '3_months', label: '2–3 Months Ahead', offsetOrder: 3 },
  { id: '1_month', label: '3–4 Weeks Ahead', offsetOrder: 4 },
  { id: '1_week', label: 'Final Week Countdown', offsetOrder: 5 },
  { id: 'day_of', label: 'Day-Of Execution', offsetOrder: 6 },
  { id: 'post_event', label: 'Post-Event Wrap-up', offsetOrder: 7 },
];

export const EVENT_TYPE_DETAILS: Record<EventType, { label: string; icon: string; defaultBudget: number; defaultGuests: number; description: string }> = {
  wedding: {
    label: 'Grand Wedding & Reception',
    icon: '💍',
    defaultBudget: 25000,
    defaultGuests: 150,
    description: 'Bespoke multi-ceremony wedding timeline, vendor coordination, seating, and emotional vows.',
  },
  birthday: {
    label: 'Milestone Birthday Party',
    icon: '🎂',
    defaultBudget: 3500,
    defaultGuests: 45,
    description: 'Themed birthday celebration with custom playlists, signature mocktails, and interactive fun.',
  },
  community: {
    label: 'Community Festival & Fair',
    icon: '🎪',
    defaultBudget: 8000,
    defaultGuests: 300,
    description: 'Civic gatherings, neighborhood block parties, fundraisers, volunteer schedules, and city permits.',
  },
  anniversary: {
    label: 'Silver/Golden Anniversary',
    icon: '🥂',
    defaultBudget: 6000,
    defaultGuests: 60,
    description: 'Sentimental milestone celebration honoring lifelong commitment with nostalgic storytelling.',
  },
  corporate: {
    label: 'Corporate Gala & Awards',
    icon: '🏆',
    defaultBudget: 15000,
    defaultGuests: 120,
    description: 'Professional networking, keynote staging, audiovisual production, and sponsor recognition.',
  },
  festival: {
    label: 'Cultural & Seasonal Festival',
    icon: '✨',
    defaultBudget: 10000,
    defaultGuests: 400,
    description: 'Vibrant cultural traditions, food stalls, artisan booths, and live acoustic stage setup.',
  },
};
