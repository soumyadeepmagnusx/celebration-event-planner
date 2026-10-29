# 🎉 Celebratify AI — Intelligent Celebration & Event Planner
> **PromptWars [Challenge 5] Celebration & Event Planner Submission**  
> *A GenAI-powered planning director that helps users organize weddings, birthdays, and community celebrations with automated budgets, execution timelines, vendor checklists, and personalized creative ideas.*

---

## 🌟 Executive Summary & Problem Alignment

Organizing celebrations—whether a 150-guest botanical wedding, a milestone 30th rooftop birthday, or a 350-attendee green community fair—is notoriously stressful. Planners juggle complex budgets, unpredictable vendor quotes, time-sensitive milestones, day-of minute-by-minute schedules, and creative ideation.

**Celebratify AI** solves this with a **GenAI-powered planning engine** built on top of **Google Gemini API** (with a high-intelligence offline heuristic simulation engine), enabling anyone to transition from high-level vision to flawless execution in seconds.

---

## 🚀 Key Features

### 1. 💰 Smart Budget Planner & AI Optimizer
- **Category Allocation**: Venue, Catering, Decor, Photography, Entertainment, Attire, Logistics, Marketing, Permits, and Contingencies.
- **Dynamic Variance Engine**: Tracks estimated costs, actual signed quotes, paid deposits, and remaining budget buffers in real-time.
- **AI Budget Optimizer**: Scans allocations against guest count and industry benchmarks to propose actionable cost-saving substitutions (e.g. food stations vs plated dinner) and identifies hidden overrun traps.
- **Multi-Currency Support**: USD ($), INR (₹), EUR (€), GBP (£), CAD (C$), and AUD (A$).

### 2. ⏱️ Timeline Milestones & Day-Of Run-of-Show
- **Phased Milestone Checklist**: Organizes milestones across 12 Months, 6 Months, 3 Months, 1 Month, Final Week, and Day-Of.
- **Minute-by-Minute Run-of-Show Itinerary**: Detailed Day-Of agenda items specifying exact start times, duration in minutes, lead person/vendor, room location, and execution notes.
- **Progress Tracking**: Real-time progress bars, priority badges (`High`, `Medium`, `Low`), and interactive status toggles.

### 3. 📋 Vendor Checklists & AI Negotiation CRM
- **Pipeline Tracking**: Tracks vendors across `Researching` ➔ `Contacted` ➔ `Quoted` ➔ `Booked` ➔ `Completed`.
- **Financial Ledger**: Tracks estimated targets vs. actual vendor quotes vs. deposit milestone payments.
- **AI Inquiry & Negotiation Email Drafter**: Automatically drafts polite, highly persuasive vendor outreach letters containing event specs, budget targets, custom package requests, and rescheduling/weather contingency clauses.

### 4. 🎨 GenAI Creative Ideation Studio
- **Themes & Aesthetics Generator**: Curated color palettes with HEX swatches, decor style guidelines, sensory atmosphere notes, and budget-friendly DIY tips.
- **Multi-Tone Invitation Copywriter**: Generates ready-to-send invitation copy across 6 distinct tones (*Warm & Heartfelt*, *Formal & Black Tie*, *Witty & Playful*, *Cultural*, *Minimalist Modern*) with RSVP and dress code notices.
- **Curated Menu & Beverage Planner**: Custom welcome cocktails/mocktails, canapés, signature mains, artisan desserts, and dedicated dietary accommodations (vegan, gluten-free, allergen safe).
- **Music & Entertainment Curator**: Playlist vibes, key moment soundtracks (Procession, Entrance, First Dance, Peak Dance Floor), and crowd icebreaker activities.
- **AI Speech & Toast Ghostwriter**: Writes custom 2.5-minute speeches tailored to the speaker's role (*Best Man*, *Maid of Honor*, *Parents*, *Birthday Host*, *Civic Leader*) with delivery cue points.
- **Plan B Contingency Shield**: Proactive contingency protocols for sudden rain, equipment failures, vendor delays, and crowd overages.

### 5. 🤖 Interactive AI Co-Planner Assistant
- **Context-Aware Conversational Planning**: Slide-over drawer assistant loaded with real-time event parameters (budget status, guest scale, vendor progress).
- **Instant Inquiries**: Quick suggestion chips for rapid budget trims, vendor interview checklists, and timeline pacing.

### 6. 📄 Data Portability & Executive Dossier
- **Printable Event Dossier**: High-fidelity printable summary (`window.print()`) formatted for physical binders and PDF generation.
- **CSV Data Export**: 1-click export of Budget and Vendor records for external bookkeeping.
- **Full JSON Backup & Restore**: Download or import complete project plans seamlessly.

---

## 🏆 Hackathon Evaluation Parameters

| Criteria | Implementation Highlights |
| :--- | :--- |
| **Code Quality** | Clean TypeScript 5 architecture, modular component structure, React 18, zero build warnings, strict ESLint standards. |
| **Security** | Zero exposed secrets. Robust Zod input validation (`createEventSchema`, `budgetItemSchema`, `vendorSchema`). XSS input sanitization and prompt injection protection against instruction overrides. |
| **Efficiency** | Ultra-lean bundle size (~417 KB JS / ~45 KB CSS), zero runtime bottlenecks, debounced state persistence to `localStorage`, sub-10 MB repo size. |
| **Testing** | 100% automated test suite passing (23 tests across 4 suites) using Vitest and React Testing Library covering calculations, validation, AI fallbacks, and accessibility. |
| **Accessibility** | WCAG 2.1 AA compliant: keyboard navigation, skip-to-content link, semantic HTML5 landmarks (`<main>`, `<header>`, `<nav>`), ARIA progress bars (`role="progressbar"`), accessible modal dialogs with focus traps and ESC listeners. |
| **Problem Alignment** | Complete, turnkey solution directly addressing Weddings, Birthdays, Community Events, Anniversaries, and Corporate Galas. |

---

## 🛠️ Tech Stack

- **Framework**: React 18 + Vite 5 + TypeScript 5
- **Styling**: Tailwind CSS 3 (with dark mode and responsive layout)
- **Icons**: Lucide React
- **Validation**: Zod
- **Testing**: Vitest, React Testing Library, JSDOM, `@testing-library/jest-dom`
- **GenAI**: Google Gemini API (`gemini-2.5-flash` / `gemini-1.5-flash`) + Built-in Generative Heuristic Engine

---

## 🧪 Automated Test Suite

Run the full suite of automated unit and integration tests:

```bash
# Run tests
npm test

# Run tests with coverage
npm run test:coverage
```

### Test Suite Results:
```text
 ✓ src/test/calculations.test.ts (4 tests)
 ✓ src/test/validation.test.ts (6 tests)
 ✓ src/test/geminiService.test.ts (9 tests)
 ✓ src/test/Accessibility.test.tsx (4 tests)

Test Files  4 passed (4)
Tests       23 passed (23)
```

---

## 📦 Local Setup & Development

```bash
# 1. Clone repository
git clone https://github.com/<your-username>/celebration-event-planner.git
cd celebration-event-planner

# 2. Install dependencies
npm install

# 3. (Optional) Configure Gemini API Key
cp .env.example .env
# Add VITE_GEMINI_API_KEY=your_key_here

# 4. Start development server
npm run dev

# 5. Build production bundle
npm run build
```

---

## 🌐 1-Click Deployment Guide

This application builds into a static SPA and can be deployed instantly for free on:

### Vercel:
1. Push repository to GitHub.
2. Go to [Vercel](https://vercel.com) and import the repository.
3. Framework Preset: `Vite` (Build command: `npm run build`, Output directory: `dist`).
4. Click **Deploy**.

### Netlify:
1. Connect repository on [Netlify](https://netlify.com).
2. Set Build command: `npm run build` and Publish directory: `dist`.
3. Click **Deploy Site**.

---

## 🔒 Security & Privacy Notice
Celebratify AI does not transmit sensitive event data or user credentials to external databases. All project plans and optional API keys are isolated within the client's browser local storage sandbox.

---

## 📄 License
MIT License. Created for the PromptWars Hackathon 2026.
