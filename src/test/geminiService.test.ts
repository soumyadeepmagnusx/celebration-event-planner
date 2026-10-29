import { describe, it, expect } from 'vitest';
import { 
  generateCompleteEventPlan, 
  optimizeBudgetAI, 
  generateVendorInquiryLetter, 
  generateCreativeThemes,
  generateInvitationCopy,
  generateMenuIdeas,
  generateEntertainmentPlan,
  generateSpeechToast,
  generateContingencyPlan
} from '../services/geminiService';
import { DEFAULT_EVENTS } from '../constants/defaultEvents';

describe('GenAI Planning Services & Heuristic Engine', () => {
  const event = DEFAULT_EVENTS[0];

  it('generates a complete event plan with all required submodules', async () => {
    const plan = await generateCompleteEventPlan({
      title: 'Lucas & Maya Beachside Wedding',
      type: 'wedding',
      date: '2026-12-10',
      location: 'Malibu Beach Cove, CA',
      guestCount: 120,
      totalBudget: 28000,
      currency: 'USD',
    });

    expect(plan.budgetItems.length).toBeGreaterThanOrEqual(4);
    expect(plan.milestones.length).toBeGreaterThanOrEqual(3);
    expect(plan.vendors.length).toBeGreaterThanOrEqual(3);
    expect(plan.themes.length).toBeGreaterThanOrEqual(1);
    expect(plan.invitations.length).toBeGreaterThanOrEqual(1);
    expect(plan.menus.length).toBeGreaterThanOrEqual(1);
    expect(plan.entertainment.length).toBeGreaterThanOrEqual(1);
    expect(plan.speeches.length).toBeGreaterThanOrEqual(1);
    expect(plan.contingencies.length).toBeGreaterThanOrEqual(1);
  });

  it('analyzes event budget and returns optimization recommendations', async () => {
    const analysis = await optimizeBudgetAI(event);
    expect(analysis.analysisSummary).toBeDefined();
    expect(analysis.savingsOpportunities.length).toBeGreaterThan(0);
    expect(analysis.hiddenCostWarnings.length).toBeGreaterThan(0);
    expect(analysis.recommendedReserve).toBeGreaterThan(0);
  });

  it('generates a structured vendor inquiry and negotiation letter', async () => {
    const vendor = event.vendors[0];
    const draft = await generateVendorInquiryLetter(event, vendor);
    expect(draft.subject).toContain(event.title);
    expect(draft.salutation).toBeDefined();
    expect(draft.body).toContain(vendor.name);
    expect(draft.keyAsk).toBeDefined();
    expect(draft.contingencyClause).toBeDefined();
  });

  it('generates theme concepts with complete color palettes and sensory details', async () => {
    const themes = await generateCreativeThemes(event);
    expect(themes.length).toBeGreaterThanOrEqual(1);
    expect(themes[0].colorPalette.length).toBeGreaterThanOrEqual(3);
    expect(themes[0].decorStyle).toBeDefined();
    expect(themes[0].sensoryDetails).toBeDefined();
  });

  it('generates invitation text matching specified tone', async () => {
    const invite = await generateInvitationCopy(event, 'witty');
    expect(invite.tone).toBe('witty');
    expect(invite.headline).toBeDefined();
    expect(invite.body).toBeDefined();
    expect(invite.rsvpWording).toBeDefined();
  });

  it('generates an artisan menu with dietary accommodations', async () => {
    const menu = await generateMenuIdeas(event);
    expect(menu.welcomeDrinks.length).toBeGreaterThan(0);
    expect(menu.appetizers.length).toBeGreaterThan(0);
    expect(menu.mains.length).toBeGreaterThan(0);
    expect(menu.desserts.length).toBeGreaterThan(0);
    expect(menu.dietaryAccommodations.length).toBeGreaterThan(0);
  });

  it('generates entertainment schedule and interactive activities', async () => {
    const ent = await generateEntertainmentPlan(event);
    expect(ent.playlistVibe).toBeDefined();
    expect(ent.keyMoments.length).toBeGreaterThan(0);
    expect(ent.interactiveActivities.length).toBeGreaterThan(0);
  });

  it('writes a personalized speech with cue points', async () => {
    const speech = await generateSpeechToast(event, 'Maid of Honor', 'Humorous & Sweet', 'Known the bride since 3rd grade');
    expect(speech.speakerRole).toBe('Maid of Honor');
    expect(speech.speechText.length).toBeGreaterThan(50);
    expect(speech.keyPoints.length).toBeGreaterThan(0);
  });

  it('generates risk contingency plans with severity ratings', async () => {
    const contingencies = await generateContingencyPlan(event);
    expect(contingencies.length).toBeGreaterThan(0);
    expect(contingencies[0].risk).toBeDefined();
    expect(['high', 'medium', 'low']).toContain(contingencies[0].severity);
    expect(contingencies[0].planBAction).toBeDefined();
  });
});
