export type EventType = 
  | 'wedding' 
  | 'birthday' 
  | 'community' 
  | 'anniversary' 
  | 'corporate' 
  | 'festival';

export type CurrencyCode = 'USD' | 'INR' | 'EUR' | 'GBP' | 'CAD' | 'AUD';

export interface CurrencyConfig {
  code: CurrencyCode;
  symbol: string;
  name: string;
}

export type BudgetCategory = 
  | 'venue' 
  | 'catering' 
  | 'decor' 
  | 'photography' 
  | 'entertainment' 
  | 'attire' 
  | 'logistics' 
  | 'marketing' 
  | 'permits' 
  | 'contingency' 
  | 'other';

export interface BudgetItem {
  id: string;
  category: BudgetCategory;
  name: string;
  estimatedCost: number;
  actualCost: number;
  paid: boolean;
  notes?: string;
  dueDate?: string;
  color?: string;
}

export type TimelinePhase = 
  | '12_months' 
  | '6_months' 
  | '3_months' 
  | '1_month' 
  | '1_week' 
  | 'day_of' 
  | 'post_event';

export type PriorityLevel = 'high' | 'medium' | 'low';

export interface Milestone {
  id: string;
  title: string;
  description: string;
  phase: TimelinePhase;
  dueDate: string;
  completed: boolean;
  category: BudgetCategory | 'general';
  priority: PriorityLevel;
}

export interface RunOfShowItem {
  id: string;
  time: string;
  title: string;
  durationMinutes: number;
  leadPerson: string;
  location: string;
  notes: string;
  completed: boolean;
}

export type VendorCategory = 
  | 'venue' 
  | 'catering' 
  | 'florist' 
  | 'photography' 
  | 'videography' 
  | 'dj_music' 
  | 'cake' 
  | 'transport' 
  | 'rentals' 
  | 'entertainment' 
  | 'speaker' 
  | 'security' 
  | 'other';

export type VendorStatus = 
  | 'researching' 
  | 'contacted' 
  | 'quoted' 
  | 'booked' 
  | 'completed' 
  | 'cancelled';

export interface Vendor {
  id: string;
  name: string;
  category: VendorCategory;
  status: VendorStatus;
  role?: string;
  image?: string;
  contactPerson?: string;
  email?: string;
  phone?: string;
  website?: string;
  estimatedCost: number;
  quoteAmount: number;
  depositPaid: number;
  notes?: string;
  rating?: number;
}

export interface ThemeIdea {
  id: string;
  title: string;
  description: string;
  category?: string;
  vibe?: string;
  impact?: string;
  colorPalette: { name: string; hex: string }[];
  decorStyle: string;
  sensoryDetails: string;
  diyTips: string[];
}

export interface InvitationCopy {
  id: string;
  tone: 'formal' | 'warm' | 'witty' | 'playful' | 'cultural' | 'minimalist';
  headline: string;
  body: string;
  rsvpWording: string;
  dressCodeNotice: string;
}

export interface MenuIdea {
  id: string;
  title: string;
  welcomeDrinks: string[];
  appetizers: string[];
  mains: string[];
  desserts: string[];
  dietaryAccommodations: string[];
}

export interface EntertainmentIdea {
  id: string;
  playlistVibe: string;
  keyMoments: { moment: string; suggestion: string }[];
  interactiveActivities: string[];
}

export interface SpeechIdea {
  id: string;
  speakerRole: string;
  tone: string;
  speechText: string;
  keyPoints: string[];
}

export interface ContingencyPlan {
  id: string;
  risk: string;
  severity: 'high' | 'medium' | 'low';
  mitigation: string;
  planBAction: string;
}

export interface EventData {
  id: string;
  title: string;
  type: EventType;
  subtitle?: string;
  themeName?: string;
  heroImage?: string;
  fontClass?: string;
  accentPrimary?: string;
  accentSecondary?: string;
  gradientText?: string;
  gradientBg?: string;
  badgeBg?: string;
  palette?: { name: string; hex: string }[];
  date: string;
  location: string;
  guestCount: number;
  totalBudget: number;
  currency: CurrencyCode;
  themeNotes?: string;
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
  createdAt: string;
  updatedAt: string;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: string;
  suggestedAction?: {
    type: 'add_budget' | 'add_milestone' | 'add_vendor' | 'add_theme' | 'general';
    label: string;
    payload?: unknown;
  };
}
