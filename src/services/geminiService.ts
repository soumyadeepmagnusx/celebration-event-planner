import { 
  EventData, 
  ThemeIdea, 
  InvitationCopy, 
  MenuIdea, 
  EntertainmentIdea, 
  SpeechIdea, 
  ContingencyPlan, 
  Vendor,
  ChatMessage 
} from '../types/event';
import { 
  GenerateEventPlanRequest, 
  BudgetOptimizationResult, 
  VendorNegotiationDraft, 
  AIGeneratedPlanResponse 
} from '../types/ai';
import { getStoredApiKey } from './storageService';
import { sanitizePromptText } from '../utils/validation';

const DEFAULT_MODEL = 'gemini-2.5-flash';

async function callGeminiApi(prompt: string, systemInstruction?: string, isJson: boolean = false): Promise<string> {
  const apiKey = getStoredApiKey();
  if (!apiKey) {
    throw new Error('NO_API_KEY');
  }

  const sanitizedPrompt = sanitizePromptText(prompt);
  const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/${DEFAULT_MODEL}:generateContent?key=${apiKey}`;

  const payload: any = {
    contents: [
      {
        parts: [{ text: sanitizedPrompt }]
      }
    ],
    generationConfig: {
      temperature: 0.7,
      topP: 0.95,
      maxOutputTokens: 2500,
    }
  };

  if (systemInstruction) {
    payload.systemInstruction = {
      parts: [{ text: systemInstruction }]
    };
  }

  if (isJson) {
    payload.generationConfig.responseMimeType = 'application/json';
  }

  const response = await fetch(endpoint, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload)
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Gemini API error (${response.status}): ${errorText}`);
  }

  const data = await response.json();
  const textOutput = data?.candidates?.[0]?.content?.parts?.[0]?.text;
  if (!textOutput) {
    throw new Error('Empty response from Gemini API');
  }

  return textOutput;
}

// 1. Generate Complete Event Plan
export async function generateCompleteEventPlan(req: GenerateEventPlanRequest): Promise<AIGeneratedPlanResponse> {
  const prompt = `You are a world-class celebration & event planning director.
Create a comprehensive, personalized plan for a ${req.type.toUpperCase()}:
Title: "${req.title}"
Date: ${req.date}
Location: ${req.location}
Guest Count: ${req.guestCount}
Budget: ${req.currency} ${req.totalBudget}
Special Requests: ${req.specialRequests || 'None'}

Return a strictly valid JSON object matching this schema:
{
  "budgetItems": [
    { "id": "b-1", "category": "venue"|"catering"|"decor"|"photography"|"entertainment"|"attire"|"logistics"|"marketing"|"permits"|"contingency"|"other", "name": string, "estimatedCost": number, "actualCost": 0, "paid": false, "notes": string }
  ],
  "milestones": [
    { "id": "m-1", "title": string, "description": string, "phase": "12_months"|"6_months"|"3_months"|"1_month"|"1_week"|"day_of"|"post_event", "dueDate": "YYYY-MM-DD", "completed": false, "category": string, "priority": "high"|"medium"|"low" }
  ],
  "vendors": [
    { "id": "v-1", "name": string, "category": "venue"|"catering"|"florist"|"photography"|"videography"|"dj_music"|"cake"|"transport"|"rentals"|"entertainment"|"speaker"|"security"|"other", "status": "researching", "estimatedCost": number, "quoteAmount": 0, "depositPaid": 0, "notes": string, "rating": 5 }
  ],
  "themes": [
    { "id": "t-1", "title": string, "description": string, "colorPalette": [{"name": string, "hex": string}], "decorStyle": string, "sensoryDetails": string, "diyTips": [string] }
  ],
  "invitations": [
    { "id": "inv-1", "tone": "formal"|"warm"|"witty"|"playful"|"cultural"|"minimalist", "headline": string, "body": string, "rsvpWording": string, "dressCodeNotice": string }
  ],
  "menus": [
    { "id": "menu-1", "title": string, "welcomeDrinks": [string], "appetizers": [string], "mains": [string], "desserts": [string], "dietaryAccommodations": [string] }
  ],
  "entertainment": [
    { "id": "ent-1", "playlistVibe": string, "keyMoments": [{"moment": string, "suggestion": string}], "interactiveActivities": [string] }
  ],
  "speeches": [
    { "id": "sp-1", "speakerRole": string, "tone": string, "speechText": string, "keyPoints": [string] }
  ],
  "contingencies": [
    { "id": "c-1", "risk": string, "severity": "high"|"medium"|"low", "mitigation": string, "planBAction": string }
  ]
}`;

  try {
    const rawJson = await callGeminiApi(prompt, 'You are an expert event planning algorithm. Output strictly valid JSON.', true);
    return JSON.parse(rawJson);
  } catch (err) {
    console.warn('Gemini API call bypassed or unavailable, using high-fidelity offline heuristic plan generator:', err);
    return generateOfflineEventPlan(req);
  }
}

// 2. Budget Optimization with AI
export async function optimizeBudgetAI(event: EventData): Promise<BudgetOptimizationResult> {
  const prompt = `Analyze this event budget and provide savings recommendations:
Event: ${event.title} (${event.type})
Guest Count: ${event.guestCount}
Total Budget: ${event.currency} ${event.totalBudget}
Current items: ${JSON.stringify(event.budgetItems.map(b => ({ name: b.name, category: b.category, est: b.estimatedCost, act: b.actualCost })))}

Return strictly valid JSON with this shape:
{
  "analysisSummary": string,
  "projectedCost": number,
  "savingsOpportunities": [
    { "category": string, "currentEstimated": number, "suggestedEstimated": number, "actionableTip": string }
  ],
  "hiddenCostWarnings": [string],
  "recommendedReserve": number
}`;

  try {
    const rawJson = await callGeminiApi(prompt, 'You are a certified master event financial planner. Output strictly valid JSON.', true);
    return JSON.parse(rawJson);
  } catch {
    return generateOfflineBudgetOptimization(event);
  }
}

// 3. Vendor Negotiation Draft
export async function generateVendorInquiryLetter(event: EventData, vendor: Vendor): Promise<VendorNegotiationDraft> {
  const prompt = `Draft a polite, professional, and negotiation-friendly inquiry/booking email to a vendor for this event:
Event: ${event.title} (${event.type})
Date: ${event.date}
Location: ${event.location}
Guest Count: ${event.guestCount}
Vendor: ${vendor.name} (${vendor.category})
Target Budget: ${event.currency} ${vendor.estimatedCost}
Current Quote (if any): ${vendor.quoteAmount > 0 ? `${event.currency} ${vendor.quoteAmount}` : 'Not yet quoted'}

Return JSON:
{
  "subject": string,
  "salutation": string,
  "body": string,
  "keyAsk": string,
  "contingencyClause": string,
  "signoff": string
}`;

  try {
    const raw = await callGeminiApi(prompt, 'You are an expert wedding and event contract negotiator. Output strictly valid JSON.', true);
    return JSON.parse(raw);
  } catch {
    return {
      subject: `Inquiry & Availability for ${event.title} on ${event.date} - ${vendor.name}`,
      salutation: `Dear ${vendor.contactPerson || `${vendor.name} Team`},`,
      body: `I hope this message finds you well. We are currently organizing "${event.title}", taking place on ${event.date} in ${event.location} with approximately ${event.guestCount} valued guests. We have long admired your exceptional reputation in ${vendor.category} and would love to partner with you for this milestone celebration.\n\nOur allocated budget for this scope is approximately ${event.currency} ${vendor.estimatedCost.toLocaleString()}. We would appreciate knowing your availability for our date and whether you offer customized packages that align with this scale.`,
      keyAsk: `Could you share your standard contract package options, setup timeframe requirements, and whether deposit milestones can be structured across two phases?`,
      contingencyClause: `Please also share your policy regarding flexible rescheduling or weather-related adjustments should venue conditions change.`,
      signoff: `Warmest regards,\nThe Planning Committee for ${event.title}`,
    };
  }
}

// 4. Creative Themes Generator
export async function generateCreativeThemes(event: EventData, customPrompt?: string): Promise<ThemeIdea[]> {
  const prompt = `Generate 2 unique, highly atmospheric theme concepts for a ${event.type}:
Title: "${event.title}"
Location: ${event.location}
Guests: ${event.guestCount}
Vibe/Preference: ${customPrompt || event.themeNotes || 'Fresh, elegant, memorable'}

Return JSON array of ThemeIdea objects:
[
  {
    "id": string,
    "title": string,
    "description": string,
    "colorPalette": [{"name": string, "hex": string}],
    "decorStyle": string,
    "sensoryDetails": string,
    "diyTips": [string]
  }
]`;

  try {
    const raw = await callGeminiApi(prompt, 'You are an avant-garde creative event designer. Output strictly JSON array.', true);
    return JSON.parse(raw);
  } catch {
    return generateOfflineThemes(event);
  }
}

// 5. Invitation Copywriter
export async function generateInvitationCopy(event: EventData, tone: string): Promise<InvitationCopy> {
  const prompt = `Write an invitation card text in a "${tone}" tone for:
Event: ${event.title} (${event.type})
Date: ${event.date}
Location: ${event.location}
Guest Count: ${event.guestCount}

Return JSON:
{
  "id": "inv-${Date.now()}",
  "tone": "${tone}",
  "headline": string,
  "body": string,
  "rsvpWording": string,
  "dressCodeNotice": string
}`;

  try {
    const raw = await callGeminiApi(prompt, 'You are an acclaimed creative copywriter. Output strictly valid JSON.', true);
    return JSON.parse(raw);
  } catch {
    return generateOfflineInvitation(event, tone);
  }
}

// 6. Curated Menu Generator
export async function generateMenuIdeas(event: EventData, dietary?: string): Promise<MenuIdea> {
  const prompt = `Curate a stunning, modern food and beverage menu for:
Event: ${event.title} (${event.type})
Guests: ${event.guestCount}
Dietary specifications: ${dietary || 'Include vegan, vegetarian, and gluten-free accommodations'}

Return JSON matching MenuIdea:
{
  "id": "menu-${Date.now()}",
  "title": string,
  "welcomeDrinks": [string],
  "appetizers": [string],
  "mains": [string],
  "desserts": [string],
  "dietaryAccommodations": [string]
}`;

  try {
    const raw = await callGeminiApi(prompt, 'You are a master executive chef. Output strictly valid JSON.', true);
    return JSON.parse(raw);
  } catch {
    return generateOfflineMenu(event);
  }
}

// 7. Entertainment & Music Playlist
export async function generateEntertainmentPlan(event: EventData): Promise<EntertainmentIdea> {
  const prompt = `Curate an entertainment, music vibe, and interactive games plan for:
Event: ${event.title} (${event.type})
Guests: ${event.guestCount}
Location: ${event.location}

Return JSON matching EntertainmentIdea:
{
  "id": "ent-${Date.now()}",
  "playlistVibe": string,
  "keyMoments": [{"moment": string, "suggestion": string}],
  "interactiveActivities": [string]
}`;

  try {
    const raw = await callGeminiApi(prompt, 'You are a premier event entertainment producer. Output strictly valid JSON.', true);
    return JSON.parse(raw);
  } catch {
    return generateOfflineEntertainment(event);
  }
}

// 8. Speech and Toast Writer
export async function generateSpeechToast(event: EventData, speakerRole: string, tone: string, personalNotes?: string): Promise<SpeechIdea> {
  const prompt = `Write a memorable 2.5-minute speech for an event:
Speaker Role: ${speakerRole}
Event: ${event.title} (${event.type})
Tone: ${tone}
Personal details/memories: ${personalNotes || 'Focus on gratitude, shared milestones, and a warm toast.'}

Return JSON:
{
  "id": "sp-${Date.now()}",
  "speakerRole": "${speakerRole}",
  "tone": "${tone}",
  "speechText": string,
  "keyPoints": [string]
}`;

  try {
    const raw = await callGeminiApi(prompt, 'You are a speechwriter for leaders and celebrations. Output strictly valid JSON.', true);
    return JSON.parse(raw);
  } catch {
    return generateOfflineSpeech(event, speakerRole, tone, personalNotes);
  }
}

// 9. Contingency Plan Generator (Plan B)
export async function generateContingencyPlan(event: EventData): Promise<ContingencyPlan[]> {
  const prompt = `Generate 3 vital Plan-B contingency scenarios for:
Event: ${event.title} (${event.type})
Location: ${event.location}
Guest Count: ${event.guestCount}

Return JSON array of ContingencyPlan:
[
  {
    "id": string,
    "risk": string,
    "severity": "high"|"medium"|"low",
    "mitigation": string,
    "planBAction": string
  }
]`;

  try {
    const raw = await callGeminiApi(prompt, 'You are an event risk and operations director. Output strictly JSON array.', true);
    return JSON.parse(raw);
  } catch {
    return generateOfflineContingency(event);
  }
}

// 10. Multi-Turn Interactive AI Co-Planner Chat
export async function chatWithAICoPlanner(event: EventData, history: ChatMessage[], userMessage: string): Promise<string> {
  const systemInstruction = `You are Celebratify Co-Planner, a warm, proactive, and exceptionally organized GenAI celebration assistant.
Current Event Context:
- Title: ${event.title}
- Type: ${event.type}
- Date: ${event.date}
- Location: ${event.location}
- Guests: ${event.guestCount}
- Budget: ${event.currency} ${event.totalBudget}
- Budget Items Count: ${event.budgetItems.length}
- Milestones Count: ${event.milestones.length}
- Vendors Count: ${event.vendors.length}

Help the user solve problems, suggest timeline refinements, propose vendor negotiation strategies, brainstorm themes, or calculate cost trade-offs. Be concise, actionable, and encouraging!`;

  const conversationText = history
    .slice(-6)
    .map(h => `${h.role === 'user' ? 'User' : 'Assistant'}: ${h.content}`)
    .join('\n');

  const fullPrompt = `${conversationText}\nUser: ${userMessage}\nAssistant:`;

  try {
    return await callGeminiApi(fullPrompt, systemInstruction, false);
  } catch {
    return generateOfflineChatResponse(event, userMessage);
  }
}

// --- High-Fidelity Offline Generative Heuristic Engines ---

function generateOfflineEventPlan(req: GenerateEventPlanRequest): AIGeneratedPlanResponse {
  const b = req.totalBudget;
  const isWedding = req.type === 'wedding';
  const isBday = req.type === 'birthday';

  return {
    budgetItems: [
      { id: `b-${Date.now()}-1`, category: 'venue', name: isWedding ? 'Ceremony & Reception Ballroom' : isBday ? 'Private Lounge Venue' : 'Civic Pavilion & Lawn Rental', estimatedCost: Math.round(b * 0.28), actualCost: 0, paid: false, dueDate: req.date },
      { id: `b-${Date.now()}-2`, category: 'catering', name: `Catering Feast for ${req.guestCount} guests`, estimatedCost: Math.round(b * 0.32), actualCost: 0, paid: false, dueDate: req.date },
      { id: `b-${Date.now()}-3`, category: 'decor', name: 'Ambient Lighting & Custom Floral Installations', estimatedCost: Math.round(b * 0.12), actualCost: 0, paid: false, dueDate: req.date },
      { id: `b-${Date.now()}-4`, category: 'photography', name: 'Professional Lead Photographer & Drone Package', estimatedCost: Math.round(b * 0.10), actualCost: 0, paid: false, dueDate: req.date },
      { id: `b-${Date.now()}-5`, category: 'entertainment', name: isWedding ? 'Live 5-Piece Band & Sound Technician' : isBday ? 'Featured DJ & Sound System' : 'Stage Production & PA Rental', estimatedCost: Math.round(b * 0.08), actualCost: 0, paid: false, dueDate: req.date },
      { id: `b-${Date.now()}-6`, category: 'marketing', name: 'Digital & Physical Invitations + Signage', estimatedCost: Math.round(b * 0.03), actualCost: 0, paid: false, dueDate: req.date },
      { id: `b-${Date.now()}-7`, category: 'contingency', name: 'Emergency Contingency Reserve (5%)', estimatedCost: Math.round(b * 0.07), actualCost: 0, paid: false, dueDate: req.date },
    ],
    milestones: [
      { id: `m-${Date.now()}-1`, title: 'Finalize Primary Venue Contract', description: 'Confirm venue capacity, security, and sign contract.', phase: '6_months', dueDate: req.date, completed: false, category: 'venue', priority: 'high' },
      { id: `m-${Date.now()}-2`, title: 'Menu Tasting & Bar Package Lock', description: 'Review sample appetizers, mains, and beverage packages.', phase: '3_months', dueDate: req.date, completed: false, category: 'catering', priority: 'high' },
      { id: `m-${Date.now()}-3`, title: 'Send Official Invitations', description: 'Distribute invitations and launch online RSVP portal.', phase: '1_month', dueDate: req.date, completed: false, category: 'marketing', priority: 'high' },
      { id: `m-${Date.now()}-4`, title: 'Day-Of Schedule Sync with All Vendors', description: 'Send run-of-show itinerary and contact sheet to all team leads.', phase: '1_week', dueDate: req.date, completed: false, category: 'general', priority: 'high' },
      { id: `m-${Date.now()}-5`, title: 'Day-Of Event Execution & Guest Welcome', description: 'Coordinate on-site arrivals, staging, and celebration highlights.', phase: 'day_of', dueDate: req.date, completed: false, category: 'general', priority: 'high' },
    ],
    vendors: [
      { id: `v-${Date.now()}-1`, name: `${req.location.split(',')[0]} Signature Venue`, category: 'venue', status: 'researching', estimatedCost: Math.round(b * 0.28), quoteAmount: 0, depositPaid: 0, notes: 'Fits 150+ seated; includes AV hookup.', rating: 5 },
      { id: `v-${Date.now()}-2`, name: 'Artisan Culinary Kitchen', category: 'catering', status: 'researching', estimatedCost: Math.round(b * 0.32), quoteAmount: 0, depositPaid: 0, notes: 'Farm-to-table cuisine, dietary cards provided.', rating: 5 },
      { id: `v-${Date.now()}-3`, name: 'Golden Hour Visuals', category: 'photography', status: 'researching', estimatedCost: Math.round(b * 0.10), quoteAmount: 0, depositPaid: 0, notes: 'Full day coverage with digital gallery delivery.', rating: 5 },
      { id: `v-${Date.now()}-4`, name: 'Sonic Pulse Entertainment', category: 'dj_music', status: 'researching', estimatedCost: Math.round(b * 0.08), quoteAmount: 0, depositPaid: 0, notes: 'Custom song curation and wireless mics.', rating: 4 },
    ],
    themes: [
      {
        id: `t-${Date.now()}`,
        title: isWedding ? 'Luminescent Garden Elegance' : isBday ? 'Midnight Velvet & Neon Luxe' : 'Vibrant Community Mosaic',
        description: `Customized aesthetic crafted for ${req.title} with cohesive color accents and welcoming ambience.`,
        colorPalette: [
          { name: 'Champagne Blush', hex: '#f7d6d0' },
          { name: 'Eucalyptus Sage', hex: '#94a796' },
          { name: 'Deep Slate', hex: '#334155' },
          { name: 'Gilded Amber', hex: '#d97706' },
        ],
        decorStyle: 'Modern Organic with Warm Atmospheric Lighting',
        sensoryDetails: 'Delicate citrus-verbena scent, warm Edison fairy bulbs, and acoustic background rhythms.',
        diyTips: [
          'Design digital QR code table numbers linking guests to the collaborative photo upload album.',
          'Group varying height glass cylinder candles with seasonal greenery runners for budget-friendly luxe centerpieces.',
        ],
      },
    ],
    invitations: [
      {
        id: `inv-${Date.now()}`,
        tone: 'warm',
        headline: `Join Us to Celebrate: ${req.title}`,
        body: `We are thrilled to bring our favorite people together on ${req.date} at ${req.location} for an unforgettable gathering. Your presence will make this milestone truly complete.`,
        rsvpWording: 'Please RSVP by 3 weeks prior to the date so we can finalize seating and culinary arrangements.',
        dressCodeNotice: 'Cocktail Festive: Dress up in colors that make you feel joyful and ready to dance!',
      },
    ],
    menus: [
      {
        id: `m-${Date.now()}`,
        title: 'Celebration Tasting & Signature Sips',
        welcomeDrinks: ['Sparkling Citrus & Rosemary Spritz', 'Artisan Blood Orange Mocktail'],
        appetizers: ['Brie & Spiced Fig Tartlets', 'Crispy Polenta Bites with Garlic Herb Aioli', 'Chilled Shrimp Skewers'],
        mains: ['Slow-Braised Rosemary Tenderloin', 'Herb-Roasted Salmon with Lemon Beurre Blanc', 'Wild Mushroom Truffle Risotto (Vegan/GF)'],
        desserts: ['Mini Flourless Chocolate Tortes', 'Glazed Raspberry Macarons'],
        dietaryAccommodations: ['Full gluten-free bread options', 'Separate allergen-safe prep station for vegan guests'],
      },
    ],
    entertainment: [
      {
        id: `ent-${Date.now()}`,
        playlistVibe: 'Warm Upbeat Acoustic leading into High-Energy Soul & Modern Pop Anthems',
        keyMoments: [
          { moment: 'Guest Arrival', suggestion: 'Chill Lo-Fi & Soulful Guitar' },
          { moment: 'Highlight Moment', suggestion: 'Euphoric Fanfare & Confetti Drop' },
          { moment: 'Dance Kickoff', suggestion: 'Feel-good throwback funk classics' },
        ],
        interactiveActivities: [
          'Collaborative Memory Capsule: Guests drop handwritten advice or predictions into a sealed anniversary box',
          'Live Polaroid Photo Guestbook station with personalized metallic markers',
        ],
      },
    ],
    speeches: [
      {
        id: `sp-${Date.now()}`,
        speakerRole: 'Host / Honoree',
        tone: 'Heartfelt, Grateful, and Uplifting',
        speechText: `To every single friend, family member, and neighbor here today: thank you. Looking around this room at the smiling faces that shaped our journey is the greatest gift of this celebration. Let us make tonight a memory we revisit for decades to come. Cheers!`,
        keyPoints: ['Warm welcome to out-of-town guests', 'Special acknowledgment of organizers', 'The toast to togetherness'],
      },
    ],
    contingencies: [
      {
        id: `c-${Date.now()}-1`,
        risk: 'Inclement weather or sudden rain shower during outdoor segments',
        severity: 'high',
        mitigation: 'Pre-reserved indoor pavilion space and heavy-duty pop-up canopies on standby.',
        planBAction: 'Venue coordinator will transition guest welcome to covered veranda within 15 minutes.',
      },
      {
        id: `c-${Date.now()}-2`,
        risk: 'Key vendor delay or traffic breakdown',
        severity: 'medium',
        mitigation: 'All vendor arrival times are scheduled 2 hours before guest doors open.',
        planBAction: 'Assistant coordinator holds direct backup contact numbers for local rental equipment.',
      },
    ],
  };
}

function generateOfflineBudgetOptimization(event: EventData): BudgetOptimizationResult {
  const currentTotal = event.budgetItems.reduce((acc, b) => acc + (b.actualCost > 0 ? b.actualCost : b.estimatedCost), 0);
  const variance = event.totalBudget - currentTotal;

  return {
    analysisSummary: variance >= 0
      ? `Your budget is in strong health with ${event.currency} ${variance.toLocaleString()} in remaining buffer! We identified 3 proactive strategies to maximize guest experience while guarding against last-minute surcharges.`
      : `Your projected allocations exceed your target budget by ${event.currency} ${Math.abs(variance).toLocaleString()}. We have structured immediate reallocations to bring your spending back within your target threshold without sacrificing quality.`,
    projectedCost: currentTotal,
    savingsOpportunities: [
      {
        category: 'Catering & Beverages',
        currentEstimated: Math.round(currentTotal * 0.35),
        suggestedEstimated: Math.round(currentTotal * 0.28),
        actionableTip: 'Opt for passed heavy hors d’oeuvres plus two food stations instead of a multi-course plated dinner to save up to 20% on staffing fees.',
      },
      {
        category: 'Florals & Decor',
        currentEstimated: Math.round(currentTotal * 0.15),
        suggestedEstimated: Math.round(currentTotal * 0.10),
        actionableTip: 'Repurpose ceremony statement floral arrangements to the banquet head table and cake display during cocktail hour.',
      },
      {
        category: 'Printed Materials',
        currentEstimated: Math.round(currentTotal * 0.05),
        suggestedEstimated: Math.round(currentTotal * 0.02),
        actionableTip: 'Use digital RSVPs with QR codes on a single master welcome board instead of printing 150 individual multi-card stationery sets.',
      },
    ],
    hiddenCostWarnings: [
      'Venue service charges & gratuity (often 18-24% added post-quote)',
      'Vendor overtime rates if dance floor extends past curfew',
      'Delivery, teardown, and trash removal surcharges',
    ],
    recommendedReserve: Math.round(event.totalBudget * 0.08),
  };
}

function generateOfflineThemes(event: EventData): ThemeIdea[] {
  const isWedding = event.type === 'wedding';
  return [
    {
      id: `t-opt-1-${Date.now()}`,
      title: isWedding ? 'Golden Hour Botanical Romance' : 'Golden Hour Velvet & Amber Lights',
      description: `Warm theatrical amber uplighting, brushed brass accents, tactile velvet seating, and styling tailored for ${event.title}.`,
      colorPalette: [
        { name: 'Warm Amber', hex: '#d97706' },
        { name: 'Deep Burgundy', hex: '#881337' },
        { name: 'Brushed Brass', hex: '#ca8a04' },
        { name: 'Alabaster White', hex: '#f8fafc' },
      ],
      decorStyle: 'Cinematic Modern Luxury',
      sensoryDetails: 'Scent of bourbon vanilla and amber resin; gentle acoustic string quartet playing modern pop covers.',
      diyTips: [
        'Collect assorted clear wine bottles, strip labels with warm water, and insert tapered wax candles as table centerpieces.',
        'Use custom wax seals in antique gold for place cards.',
      ],
    },
    {
      id: `t-opt-2-${Date.now()}`,
      title: 'Eucalyptus & Linen Minimalist Chic',
      description: 'Lush organic greenery interwoven with clean neutral linens, textured stoneware, and unbleached beeswax candlelight.',
      colorPalette: [
        { name: 'Eucalyptus Green', hex: '#15803d' },
        { name: 'Oatmeal Linen', hex: '#e2e8f0' },
        { name: 'Charcoal Slate', hex: '#334155' },
        { name: 'Soft Peach', hex: '#fed7aa' },
      ],
      decorStyle: 'Organic Scandinavian Elegance',
      sensoryDetails: 'Aroma of cut fresh eucalyptus and cedar; warm acoustic guitar harmonies and soft chatter.',
      diyTips: [
        'Cut live rosemary sprigs and tie them around folded cloth napkins with rustic twine.',
        'Print table menus on textured handmade torn-edge deckle paper.',
      ],
    },
  ];
}

function generateOfflineInvitation(event: EventData, tone: string): InvitationCopy {
  if (tone === 'witty') {
    return {
      id: `inv-${Date.now()}`,
      tone: 'witty',
      headline: `Clear Your Schedule: It’s Time for ${event.title}`,
      body: `We could have celebrated quietly, but what fun would that be? Join us on ${event.date} at ${event.location} for delicious drinks, questionable dance moves, and top-tier memories.`,
      rsvpWording: 'RSVP soon so the caterers don’t panic! Let us know if you need special dietary considerations.',
      dressCodeNotice: 'Attire: Dress up enough to look amazing in photos, but comfortable enough to dance all night.',
    };
  }

  if (tone === 'formal') {
    return {
      id: `inv-${Date.now()}`,
      tone: 'formal',
      headline: `The Honour of Your Presence is Requested`,
      body: `You are cordially invited to attend the celebration of ${event.title}, taking place on ${event.date} at ${event.location}. We look forward to sharing this momentous occasion in the company of our most cherished family and friends.`,
      rsvpWording: 'Please respond via our online portal or reply card no later than three weeks prior to the event.',
      dressCodeNotice: 'Formal Black Tie Optional: Evening gowns and dinner jackets or dark suits requested.',
    };
  }

  return {
    id: `inv-${Date.now()}`,
    tone: 'warm',
    headline: `Celebrating Life, Love & Laughter`,
    body: `Our lives are richer because of the friendships and love we share with each of you. Please join us on ${event.date} at ${event.location} as we gather to celebrate ${event.title}.`,
    rsvpWording: 'Kindly confirm your attendance so we can prepare your place at our table.',
    dressCodeNotice: 'Celebration Chic: Wear what makes you feel festive, radiant, and comfortable.',
  };
}

function generateOfflineMenu(event: EventData): MenuIdea {
  return {
    id: `menu-${Date.now()}`,
    title: `Artisan Seasonal Feast for ${event.title}`,
    welcomeDrinks: ['Sparkling Pomegranate & Rosemary Fizz', 'Cucumber Mint Hydration Elixir'],
    appetizers: ['Whipped Ricotta Crostini with Hot Honey', 'Smoked Duck Breast with Cherry Compote', 'Crispy Artichoke Hearts with Lemon Aioli'],
    mains: ['Pan-Seared Halibut with Saffron Broth', 'Dry-Aged Beef Tenderloin with Truffled Demi-Glace', 'Charred Cauliflower Steak with Chimichurri (Vegan)'],
    desserts: ['Mini Meyer Lemon Tartlets with Torched Meringue', 'Dark Chocolate Pots de Crème'],
    dietaryAccommodations: [
      'Clear allergen tags on all buffet/station items (GF, DF, Vegan, Nut-Free)',
      'Dedicated plated vegan course prepared by executive sous chef',
    ],
  };
}

function generateOfflineEntertainment(event: EventData): EntertainmentIdea {
  return {
    id: `ent-${Date.now()}`,
    playlistVibe: `Curated for ${event.title}: Joyful, uplifting soul, timeless indie classics, and contagious dance floor anthems`,
    keyMoments: [
      { moment: 'Guest Welcome', suggestion: 'Bossa Nova & Acoustic Lo-Fi' },
      { moment: 'Grand Entrance', suggestion: 'Upbeat brass-heavy soul fanfare' },
      { moment: 'Toast Transition', suggestion: 'Subtle instrumental warmth' },
      { moment: 'Peak Dance Floor', suggestion: '90s/00s Singalongs and Motown Funk' },
    ],
    interactiveActivities: [
      'Table Trivia Icebreaker: 5 funny trivia questions about the honorees hidden under centerpieces',
      'Audio Guestbook: Retro telephone where guests leave audio voice memos that are compiled into a podcast-style keepsake',
      'Live Sparkler / Light-wand procession during the final crescendo',
    ],
  };
}

function generateOfflineSpeech(event: EventData, speakerRole: string, tone: string, personalNotes?: string): SpeechIdea {
  return {
    id: `sp-${Date.now()}`,
    speakerRole,
    tone,
    speechText: `Good evening everyone. What a rare and precious gift it is to have everyone we love gathered together under one roof for "${event.title}".\n\n${personalNotes ? `As I reflect on this journey: ${personalNotes}\n\n` : ''}Special celebrations like this don’t just happen—they are forged through love, devotion, and community. May tonight be filled with stories you will tell for the next thirty years, and laughter that warms your heart on cold days.\n\nPlease raise your glasses with me in honor of this unforgettable milestone. To friendship, to love, and to tonight!`,
    keyPoints: [
      'Acknowledge the effort guests made to be here',
      'Share a heartfelt personal reflection or anecdote',
      'Toast to the honorees and the future ahead',
    ],
  };
}

function generateOfflineContingency(event: EventData): ContingencyPlan[] {
  return [
    {
      id: `c-1-${Date.now()}`,
      risk: `Unseasonal rain or weather disruption near ${event.location}`,
      severity: 'high',
      mitigation: 'Pre-book venue backup pavilion space and secure tent rental cancellation window 72 hours prior.',
      planBAction: 'Activate indoor floor plan; sound technician shifts speakers to covered terrace in 15 minutes.',
    },
    {
      id: `c-2-${Date.now()}`,
      risk: 'Key vendor vehicle breakdown or transit delay',
      severity: 'medium',
      mitigation: 'Require all critical vendors (catering, music, photographer) to report on site 2.5 hours before doors.',
      planBAction: 'Coordinator keeps regional emergency backup contact sheet for substitute sound gear and emergency cake replacement.',
    },
    {
      id: `c-3-${Date.now()}`,
      risk: 'Guest count surge (+10-15% over RSVP ceiling)',
      severity: 'medium',
      mitigation: 'Caterer contracted with standard +10% overage safety buffer in protein and vegetarian sides.',
      planBAction: 'Event staff holds 2 additional tables and 16 folding chairs pre-draped in backstage storage ready to deploy.',
    },
  ];
}

function generateOfflineChatResponse(event: EventData, userMessage: string): string {
  const msg = userMessage.toLowerCase();
  
  if (msg.includes('budget') || msg.includes('cost') || msg.includes('money') || msg.includes('price')) {
    return `For ${event.title}, your current total budget is ${event.currency} ${event.totalBudget.toLocaleString()} across ${event.budgetItems.length} tracked items.\n\n💡 Pro tip: Venue and catering typically comprise 50–60% of total spend. Would you like me to run the AI Budget Optimizer to highlight cost-saving opportunities or draft vendor negotiation points?`;
  }

  if (msg.includes('vendor') || msg.includes('photographer') || msg.includes('cater') || msg.includes('dj')) {
    return `You currently have ${event.vendors.length} vendors in your pipeline. For any vendor, you can click "AI Inquiry Letter" on their card, and I will generate a customized negotiation email with structured deliverables and reschedule clauses tailored to ${event.title}!`;
  }

  if (msg.includes('timeline') || msg.includes('schedule') || msg.includes('run of show') || msg.includes('time')) {
    return `Your timeline has ${event.milestones.length} milestones and ${event.runOfShow.length} Day-Of agenda items. For seamless pacing on ${event.date}, remember to schedule 15-minute buffer windows between speeches and the main dinner so your timeline never feels rushed!`;
  }

  if (msg.includes('theme') || msg.includes('decor') || msg.includes('color') || msg.includes('idea')) {
    return `For a ${event.type} in ${event.location}, natural ambient lighting paired with rich organic textures (like velvet or linen) creates an unforgettable sensory experience. Check out the "Creative Ideas" tab to explore bespoke themes, playlists, and custom toast scripts!`;
  }

  return `I'm here to help coordinate every detail of ${event.title} (${event.type} on ${event.date})! I can assist with:\n• Generating custom budget trade-offs\n• Drafting vendor inquiry emails\n• Structuring your Day-Of minute-by-minute schedule\n• Brainstorming unique party themes, menus, and speeches\n\nWhat would you like to work on next?`;
}
