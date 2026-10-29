import { EventType, CurrencyCode, ThemeIdea, InvitationCopy, MenuIdea, EntertainmentIdea, SpeechIdea, ContingencyPlan, BudgetItem, Milestone, Vendor } from './event';

export interface GenerateEventPlanRequest {
  title: string;
  type: EventType;
  date: string;
  location: string;
  guestCount: number;
  totalBudget: number;
  currency: CurrencyCode;
  specialRequests?: string;
}

export interface BudgetOptimizationResult {
  analysisSummary: string;
  projectedCost: number;
  savingsOpportunities: {
    category: string;
    currentEstimated: number;
    suggestedEstimated: number;
    actionableTip: string;
  }[];
  hiddenCostWarnings: string[];
  recommendedReserve: number;
}

export interface VendorNegotiationDraft {
  subject: string;
  salutation: string;
  body: string;
  keyAsk: string;
  contingencyClause: string;
  signoff: string;
}

export interface AIGeneratedPlanResponse {
  budgetItems: BudgetItem[];
  milestones: Milestone[];
  vendors: Vendor[];
  themes: ThemeIdea[];
  invitations: InvitationCopy[];
  menus: MenuIdea[];
  entertainment: EntertainmentIdea[];
  speeches: SpeechIdea[];
  contingencies: ContingencyPlan[];
}
